import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { History, Word } from '../../types/storiesTypes';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';
import { saveUserWord } from '../../api/userWords';

const { width } = Dimensions.get('window');
const SYNC_OFFSET = 0.2;

interface StoryScreenProps {
  route: { params: { story: History } };
  navigation: any;
}

export default function StoryScreen({ route, navigation }: StoryScreenProps) {
  const user = useUserStore(state => state.user);
  const { navTheme } = useAppTheme();
  const { story } = route.params;

  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(false);

  // -------------------- Audio --------------------
  useEffect(() => {
    const localPath = `${RNFS.CachesDirectoryPath}/${story.id}.mp3`;

    const loadSound = (path: string) => {
      const s = new Sound(path, '', error => {
        if (error) {
          console.log('Ошибка загрузки аудио:', error);
          setIsLoadingAudio(false);
          return;
        }
        setSound(s);
        setIsLoadingAudio(false);
      });
    };

    RNFS.exists(localPath)
      .then(exists => {
        if (exists) loadSound(localPath);
        else
          RNFS.downloadFile({
            fromUrl: `${SERVER_URL}${story.audioUrl}`,
            toFile: localPath,
          }).promise.then(() => loadSound(localPath));
      })
      .catch(err => {
        console.log('Ошибка при загрузке файла:', err);
        setIsLoadingAudio(false);
      });

    return () => {
      if (sound) sound.release();
      stopSync();
    };
  }, []);

  const playAudio = () => {
    if (!sound || isLoadingAudio) return;
    if (isPlaying) {
      sound.pause();
      stopSync();
      setIsPlaying(false);
    } else {
      sound.play(onAudioEnd);
      setIsPlaying(true);
      startSync(sound);
    }
  };

  const onAudioEnd = () => {
    stopSync();
    setIsPlaying(false);
    setActiveIndex(null);
  };

  const startSync = (soundInstance: Sound) => {
    const id = setInterval(() => {
      soundInstance.getCurrentTime(seconds => {
        const adjustedTime = seconds + SYNC_OFFSET;
        const index = story.wordTiming.findIndex(
          w => adjustedTime >= w.start && adjustedTime <= w.end,
        );
        setActiveIndex(index >= 0 ? index : null);
      });
    }, 60);
    setTimer(id);
  };

  const stopSync = () => {
    if (timer) clearInterval(timer);
    setTimer(null);
  };

  // -------------------- Word handling --------------------
  const normalizeForHighlight = (str: string) =>
    str
      .replace(/[.,!?;:°]/g, '')
      .replace(/^(der|die|das|ein|eine)\s+/i, '')
      .trim()
      .toLowerCase();

  const handleWordPress = (word: string) => {
    const cleanedWord = normalizeForHighlight(word);

    const found = story.words.find(w => {
      if (typeof w.word === 'string') {
        const normalized = normalizeForHighlight(w.word);
        return cleanedWord === normalized;
      }
      return false;
    });

    if (found) {
      setSelectedWord(word);
      setTranslation(found.translation);
    } else {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
    }
  };

  // -------------------- Split text --------------------
  const splitGermanText = (text: string): string[] => {
    return text.match(/[\wÄÖÜäöüß]+|[.,!?;:"()«»—-]|\s+/g) || [text];
  };

  const renderTextWithTouch = (text: string) => {
    const parts = splitGermanText(text);

    return (
      <Text style={{ flexWrap: 'wrap', lineHeight: 28 }}>
        {parts.map((part, index) => {
          // Слова кликабельные
          if (/[\wÄÖÜäöüß]+/.test(part)) {
            const isActive =
              activeIndex !== null &&
              normalizeForHighlight(
                story.wordTiming[activeIndex]?.word || '',
              ) === normalizeForHighlight(part);
            const isSelected = selectedWord
              ? normalizeForHighlight(selectedWord) ===
                normalizeForHighlight(part)
              : false;

            return (
              <Text
                key={index}
                onPress={() => handleWordPress(part)}
                style={{
                  backgroundColor: isActive
                    ? '#90EE90'
                    : isSelected
                    ? '#FFD700'
                    : 'transparent',
                  fontSize: 18,
                  lineHeight: 28,
                }}
              >
                {part}
              </Text>
            );
          }

          // Остальные символы (пунктуация, пробелы)
          return (
            <Text key={index} style={{ fontSize: 18, lineHeight: 28 }}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  // -------------------- Sentence rendering --------------------
  const renderStoryWithSentences = (deText: string, ruText: string) => {
    const deSentences = deText.match(/[^.!?]+[.!?]+/g) || [deText];
    const ruSentences = ruText.match(/[^.!?]+[.!?]+/g) || [ruText];

    return deSentences.map((deSentence, index) => {
      const ruSentence = ruSentences[index] || '';
      return (
        <View key={`sentence-${index}`} style={{ marginBottom: 12 }}>
          {renderTextWithTouch(deSentence)}
          <Text
            style={[
              styles.fullStory,
              {
                color: navTheme.colors.text,
                fontWeight: '400',
                marginTop: 4,
                backgroundColor: '#4e4e4e3a',
                borderRadius: 8,
                padding: 6,
                fontSize: 16,
              },
            ]}
          >
            {ruSentence}
          </Text>
        </View>
      );
    });
  };

  // -------------------- Add word --------------------
  const handleAddWord = async (wordText: string) => {
    if (!user) {
      Alert.alert('Войдите, чтобы сохранять слова');
      return;
    }

    const cleanedWordText = wordText
      .toLowerCase()
      .replace(/[.,!?;:°]/g, '')
      .trim();

    const foundWord: Word | undefined = story.words.find(w => {
      if (!w.word) return false;
      if (typeof w.word === 'string') {
        const normalized = w.word
          .toLowerCase()
          .replace(/^(der|die|das|ein|eine)\s+/, '');
        return cleanedWordText === normalized;
      }
      return false;
    });

    if (!foundWord) {
      Alert.alert('Слово не найдено в списке слов истории');
      return;
    }

    try {
      const response = await saveUserWord(user.id, story.id, foundWord);

      if (response?.success) {
        Alert.alert('✅ Слово добавлено!');
      } else if (response?.message === 'Слово уже сохранено') {
        Alert.alert('ℹ️ Это слово уже в вашем списке');
      } else {
        console.log('Ошибка API:', response);
        Alert.alert('Ошибка при сохранении слова');
      }
    } catch (error) {
      console.error('Ошибка при вызове saveUserWord:', error);
      Alert.alert('Ошибка при сохранении слова');
    }
  };

  // -------------------- Render --------------------
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
            style={styles.image}
            resizeMode="cover"
          />
          {translation && (
            <View style={styles.translationOverlay}>
              <Text style={styles.translationText}>{translation}</Text>
              {user && selectedWord && (
                <TouchableOpacity
                  style={styles.addWordButton}
                  onPress={() => handleAddWord(selectedWord)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Добавить слово
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isLoadingAudio ? '#888' : '#1dad00ff' },
          ]}
          onPress={playAudio}
          disabled={isLoadingAudio}
        >
          {isLoadingAudio ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: navTheme.colors.text }]}>
            {story.title.de}
          </Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{story.languageLevel}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowSentenceTranslation(!showSentenceTranslation)}
        >
          <Text style={styles.showButtonText}>
            {showSentenceTranslation ? 'Скрыть перевод ' : 'Показать перевод '}
          </Text>
        </TouchableOpacity>

        {!showSentenceTranslation ? (
          renderTextWithTouch(story.fullStory.de)
        ) : (
          <View>
            {renderStoryWithSentences(story.fullStory.de, story.fullStory.ru)}
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.viewWordsButton}
        onPress={() => navigation.navigate('SavedWords', { userId: user?.id })}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          📚 Посмотреть все слова
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  imageWrapper: { position: 'relative', marginBottom: 16 },
  image: { width: width - 32, height: 200, borderRadius: 16 },
  translationOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  translationText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  levelBadge: {
    backgroundColor: '#FFD700',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  levelText: { color: '#000', fontWeight: 'bold' },
  fullStory: {
    fontSize: 18,
    lineHeight: 28,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  playButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    width: '50%',
  },
  playButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  showButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  showButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  backButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  addWordButton: {
    backgroundColor: '#1dad00ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  viewWordsButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
});
