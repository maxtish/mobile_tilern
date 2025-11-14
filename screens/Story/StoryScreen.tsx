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
import { SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';
import { useAudio } from '../../hooks/useAudio';
import { TextWithTouch } from '../../components/TextWithTouch';
import { TextWithTranslation } from '../../components/TextWithTranslation';
import { useAddWord } from '../../hooks/useAddWord';
import { useWordPress } from '../../hooks/useWordPress';

// Получаем ширину экрана для адаптивных размеров
const { width } = Dimensions.get('window');
// Смещение времени для синхронизации подсветки слов
const SYNC_OFFSET = 0;

interface StoryScreenProps {
  route: { params: { story: History } }; // Передаем историю через параметры маршрута
  navigation: any; // Для навигации
}

export default function StoryScreen({ route, navigation }: StoryScreenProps) {
  const user = useUserStore(state => state.user); // Получаем текущего пользователя из стора
  const { navTheme } = useAppTheme(); // Тема приложения
  const { story } = route.params; // История из параметров
  const { addWord } = useAddWord(story);
  // -------------------- Состояния --------------------
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Индекс текущего слова для подсветки
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(false); // Флаг показа перевода предложений
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); ///Чтобы подсвечивался только кликнутый экземпляр
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const wordLayouts = React.useRef<{
    [key: number]: { y: number; height: number };
  }>({});

  // -------------------- Подсветка и автоскролл --------------------
  useEffect(() => {
    if (
      activeIndex !== null &&
      scrollViewRef.current &&
      wordLayouts.current[activeIndex]
    ) {
      const { y, height } = wordLayouts.current[activeIndex];
      scrollViewRef.current.scrollTo({ y: y - 50, animated: true }); // offset, чтобы слово было немного сверху
    }
  }, [activeIndex]);

  useEffect(() => {
    wordLayouts.current = {}; // сброс
  }, [showSentenceTranslation]);

  // -------------------- Работа с аудио --------------------
  const { sound, isPlaying, isLoading, play, timerRef, setIsPlaying } =
    useAudio(story.id, story.audioUrl);

  // -------------------- Синхронизация слов --------------------
  const startSync = () => {
    if (!sound) return;
    timerRef.current = setInterval(() => {
      sound.getCurrentTime(seconds => {
        const adjustedTime = seconds + SYNC_OFFSET;
        const index = story.wordTiming.findIndex(
          w => adjustedTime >= w.start && adjustedTime <= w.end,
        );
        setActiveIndex(index >= 0 ? index : null);
      });
    }, 100) as unknown as number;
  };

  const stopSync = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const handlePlayPress = () => {
    if (!sound || isLoading) return;
    if (isPlaying) {
      sound.pause();
      stopSync();
      setIsPlaying(false);
    } else {
      play(() => {
        stopSync();
        setActiveIndex(null);
      });
      startSync();
    }
  };

  // -------------------- Обработка слов --------------------

  const { selectedWord, translation, baseFormText, handleWordPress } =
    useWordPress(story);

  // -------------------- Основной рендер --------------------
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      {/* Изображение истории */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Перевод выбранного слова */}
        {translation && (
          <View style={styles.translationOverlay}>
            <Text style={styles.translationText}>
              {baseFormText
                ? `${baseFormText} - ${translation}`
                : `${selectedWord} - ${translation}`}
            </Text>
            {user && selectedWord && (
              <TouchableOpacity
                style={styles.addWordButton}
                onPress={() => selectedWord && addWord(selectedWord)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Добавить слово
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Кнопка воспроизведения аудио */}
      <TouchableOpacity
        style={[
          styles.playButton,
          { backgroundColor: isLoading ? '#888' : '#1dad00ff' },
        ]}
        onPress={handlePlayPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.playButtonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Заголовок и уровень истории */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: navTheme.colors.text }]}>
          {story.title.de}
        </Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{story.languageLevel}</Text>
        </View>
      </View>

      {/* Кнопка показа/скрытия перевода предложений */}
      <TouchableOpacity
        style={styles.showButton}
        onPress={() => setShowSentenceTranslation(!showSentenceTranslation)}
      >
        <Text style={styles.showButtonText}>
          {showSentenceTranslation ? 'Скрыть перевод ' : 'Показать перевод '}
        </Text>
      </TouchableOpacity>

      {/* Основной текст истории */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {showSentenceTranslation ? (
            <TextWithTranslation
              wordTiming={story.wordTiming}
              ruText={story.fullStory.ru}
              activeIndex={activeIndex}
              selectedWord={selectedWord}
              selectedIndex={selectedIndex}
              onWordPress={(word, index) => {
                setSelectedIndex(index);
                handleWordPress(word);
              }}
              onLayout={(index, layout) => {
                wordLayouts.current[index] = layout;
              }}
            />
          ) : (
            <TextWithTouch
              wordTiming={story.wordTiming}
              activeIndex={activeIndex}
              selectedWord={selectedWord}
              selectedIndex={selectedIndex}
              onWordPress={(word, index) => {
                setSelectedIndex(index);
                handleWordPress(word);
              }}
              onLayout={(index, layout) => {
                wordLayouts.current[index] = layout;
              }}
            />
          )}
        </ScrollView>
        {/* Кнопка WordTraining */}
        {user ? (
          <TouchableOpacity
            style={styles.wordTrainingButton}
            onPress={() =>
              navigation.navigate('WordTraining', { userId: user?.id })
            }
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>
              📚 Тренировка слов
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {/* Кнопка возврата */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    margin: 0,
    padding: 0,
    fontSize: 18,
    lineHeight: 24,
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
    marginBottom: 5,
  },
  addWordButton: {
    backgroundColor: '#1dad00ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  wordTrainingButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
});
