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
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { History } from '../../types/storiesTypes';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

const { width } = Dimensions.get('window');
const SERVER_URL = 'http://192.168.178.37:3000';
const SYNC_OFFSET = 0.2;

interface StoryScreenProps {
  route: {
    params: {
      story: History;
    };
  };
  navigation: any;
}

export default function StoryScreen({ route, navigation }: StoryScreenProps) {
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

  // -------------------------------------------
  // 🚀 Загружаем аудио
  // -------------------------------------------
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
        else {
          RNFS.downloadFile({
            fromUrl: `${SERVER_URL}${story.audioUrl}`,
            toFile: localPath,
          }).promise.then(() => loadSound(localPath));
        }
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

  // -------------------------------------------
  // ▶️ Аудио
  // -------------------------------------------
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

  // -------------------------------------------
  // 🔠 Слова
  // -------------------------------------------
  const normalize = (str: string) =>
    str
      .replace(/[.,!?;:°]/g, '')
      .trim()
      .toLowerCase();

  const removeArticle = (word: string) =>
    word.replace(/^(der|die|das|ein|eine)\s+/i, '').toLowerCase();

  const handleWordPress = (word: string) => {
    const cleanedWord = word.toLowerCase();

    const found = story.words.find(w => {
      if (w.type === 'noun' && typeof w.word === 'object') {
        const singular = removeArticle(w.word.singular || '');
        const plural = removeArticle(w.word.plural || '');
        return cleanedWord === singular || cleanedWord === plural;
      } else if (typeof w.word === 'string') {
        return cleanedWord === w.word.toLowerCase();
      }
      return false;
    });

    if (found) {
      setSelectedWord(word);
      if (found.type === 'noun' && typeof found.word === 'object') {
        const singular = removeArticle(found.word.singular || '');
        const plural = removeArticle(found.word.plural || '');
        const form =
          cleanedWord === singular
            ? '(singular)'
            : cleanedWord === plural
            ? '(plural)'
            : '';
        setTranslation(`${found.translation} ${form}`);
      } else {
        setTranslation(found.translation);
      }
    } else {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
    }
  };

  const renderTextWithTouch = (text: string) => {
    const parts = text.match(/\S+|\s+/g) || [];
    return parts.map((part, index) => {
      if (/^\s+$/.test(part))
        return (
          <Text key={`space-${index}`} style={styles.word}>
            {part}
          </Text>
        );

      const cleaned = normalize(part);
      const activeWordObj =
        activeIndex !== null ? story.wordTiming[activeIndex] : null;

      const isActive =
        activeWordObj && normalize(activeWordObj.word) === cleaned;
      const isSelected = selectedWord === cleaned;

      return (
        <TouchableOpacity
          key={`word-${index}`}
          onPress={() => handleWordPress(cleaned)}
        >
          <Text
            style={[
              styles.word,
              {
                color: navTheme.colors.text,
                backgroundColor: isActive
                  ? '#90EE90'
                  : isSelected
                  ? '#FFD700'
                  : 'transparent',
              },
            ]}
          >
            {part}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // -------------------------------------------
  // 📝 Рендер предложений с переводом
  // -------------------------------------------
  const renderStoryWithSentences = (deText: string, ruText: string) => {
    const deSentences = deText.match(/[^.!?]+[.!?]+/g) || [deText];
    const ruSentences = ruText.match(/[^.!?]+[.!?]+/g) || [ruText];

    return deSentences.map((deSentence, index) => {
      const ruSentence = ruSentences[index] || '';
      return (
        <View key={`sentence-${index}`} style={{ marginBottom: 12 }}>
          <Text style={styles.fullStory}>
            {renderTextWithTouch(deSentence)}
          </Text>
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
            source={{ uri: `${SERVER_URL}${story.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
          {translation && (
            <View style={styles.translationOverlay}>
              <Text style={styles.translationText}>{translation}</Text>
            </View>
          )}
        </View>

        {/* Play */}
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

        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: navTheme.colors.text }]}>
            {story.title.de}
          </Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{story.languageLevel}</Text>
          </View>
        </View>

        {/* Кнопка для активации перевода по предложениям */}
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowSentenceTranslation(!showSentenceTranslation)}
        >
          <Text style={styles.showButtonText}>
            {showSentenceTranslation ? 'Скрыть перевод ' : 'Показать перевод '}
          </Text>
        </TouchableOpacity>

        {/* Основной текст */}
        {!showSentenceTranslation ? (
          <Text style={styles.fullStory}>
            {renderTextWithTouch(story.fullStory.de)}
          </Text>
        ) : (
          <View>
            {renderStoryWithSentences(story.fullStory.de, story.fullStory.ru)}
          </View>
        )}

        {/* Кнопка назад */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// -------------------------------------------
// 🎨 Стили
// -------------------------------------------
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
  word: { fontSize: 18, lineHeight: 28, paddingHorizontal: 2, borderRadius: 6 },
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
});
