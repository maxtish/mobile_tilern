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

  // -------------------- Состояния --------------------
  const [sound, setSound] = useState<Sound | null>(null); // Объект аудио
  const [isPlaying, setIsPlaying] = useState(false); // Статус воспроизведения
  const [isLoadingAudio, setIsLoadingAudio] = useState(true); // Статус загрузки аудио
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Индекс текущего слова для подсветки
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null,
  ); // Таймер синхронизации

  const [selectedWord, setSelectedWord] = useState<string | null>(null); // Выбранное слово при нажатии
  const [translation, setTranslation] = useState<string | null>(null); // Перевод выбранного слова
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(false); // Флаг показа перевода предложений
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); ///Чтобы подсвечивался только кликнутый экземпляр

  // -------------------- Работа с аудио --------------------
  useEffect(() => {
    // Локальный путь для хранения аудио
    const localPath = `${RNFS.CachesDirectoryPath}/${story.id}.mp3`;

    // Функция загрузки аудио
    const loadSound = (path: string) => {
      const s = new Sound(path, '', error => {
        if (error) {
          console.log('Ошибка загрузки аудио:', error);
          setIsLoadingAudio(false);
          return;
        }
        setSound(s); // Сохраняем объект Sound
        setIsLoadingAudio(false); // Загрузка завершена
      });
    };

    // Проверяем, есть ли аудио локально
    RNFS.exists(localPath)
      .then(exists => {
        if (exists) loadSound(localPath); // Если есть — загружаем
        else
          RNFS.downloadFile({
            fromUrl: `${SERVER_URL}${story.audioUrl}`, // Скачиваем с сервера
            toFile: localPath,
          }).promise.then(() => loadSound(localPath));
      })
      .catch(err => {
        console.log('Ошибка при загрузке файла:', err);
        setIsLoadingAudio(false);
      });

    // Очистка при размонтировании
    return () => {
      if (sound) sound.release(); // Освобождаем ресурсы
      stopSync(); // Останавливаем таймер
    };
  }, []);

  // -------------------- Воспроизведение аудио --------------------
  const playAudio = () => {
    if (!sound || isLoadingAudio) return;
    if (isPlaying) {
      sound.pause(); // Пауза
      stopSync(); // Останавливаем синхронизацию
      setIsPlaying(false);
    } else {
      sound.play(onAudioEnd); // Воспроизведение
      setIsPlaying(true);
      startSync(sound); // Запускаем синхронизацию подсветки слов
    }
  };

  const onAudioEnd = () => {
    stopSync(); // Синхронизация завершена
    setIsPlaying(false);
    setActiveIndex(null); // Сбрасываем подсветку
  };

  // -------------------- Синхронизация подсветки слов --------------------
  const startSync = (soundInstance: Sound) => {
    const id = setInterval(() => {
    soundInstance.getCurrentTime(seconds => {
  const adjustedTime = seconds + SYNC_OFFSET;
  const index = story.wordTiming.findIndex(
    w => adjustedTime >= w.start && adjustedTime <= w.end,
  );
  if (index !== activeIndex) {
    setActiveIndex(index >= 0 ? index : null);
  }})})};

  const stopSync = () => {
    if (timer) clearInterval(timer);
    setTimer(null);
  };

  // -------------------- Обработка слов --------------------
  // Нормализация слов для подсветки и поиска
  const normalizeForHighlight = (str: string) =>
    str
      .replace(/[.,!?;:°]/g, '') // Убираем пунктуацию
      .replace(/^(der|die|das|ein|eine)\s+/i, '') // Убираем артикли
      .trim()
      .toLowerCase();

  const handleWordPress = (word: string) => {
    const cleanedWord = normalizeForHighlight(word);

    // Находим слово в словаре истории
    const found = story.words.find(w => {
      if (typeof w.word === 'string') {
        const normalized = normalizeForHighlight(w.word);
        return cleanedWord === normalized;
      }
      return false;
    });

    if (found) {
      setSelectedWord(word);
      setTranslation(found.translation); // Сохраняем перевод
    } else {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
    }
  };

  // -------------------- Разделение текста на слова и знаки --------------------
  const splitGermanText = (text: string): string[] => {
    return text.match(/[\wÄÖÜäöüß]+|[.,!?;:"()«»—-]|\s+/g) || [text];
  };

  // -------------------- Отрисовка текста с кликабельными словами --------------------
  const renderTextWithTouch = (text: string) => {
    const parts = splitGermanText(text);

    let timingCursor = 0; // Курсор для синхронизации с wordTiming

    return (
      <Text style={{ flexWrap: 'wrap', lineHeight: 28 }}>
        {parts.map((part, index) => {
          if (/[\wÄÖÜäöüß]+/.test(part)) {
            // Для слов
            const currentWordTiming = story.wordTiming[timingCursor];
            const isActive =
              activeIndex === timingCursor && currentWordTiming?.word
                ? normalizeForHighlight(currentWordTiming.word) ===
                  normalizeForHighlight(part)
                : false;

            const isSelected = selectedWord
              ? normalizeForHighlight(selectedWord) ===
                normalizeForHighlight(part)
              : false;

            timingCursor += 1; // Продвигаем курсор

            return (
              <Text
                key={index}
                onPress={() => {
                  setSelectedIndex(index);
                  handleWordPress(part);
                }} // Обработка нажатия
                style={{
                  backgroundColor: isActive
                    ? '#90EE90'
                    : selectedIndex === index
                    ? '#FFD700'
                    : 'transparent',
                  fontSize: 18,
                  lineHeight: 28,
                  color: navTheme.colors.text,
                }}
              >
                {part}
              </Text>
            );
          }

          // Для пробелов и пунктуации
          return (
            <Text
              key={index}
              style={{
                fontSize: 18,
                lineHeight: 28,
                color: navTheme.colors.text,
              }}
            >
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  // -------------------- Отображение предложений с переводом --------------------
  const renderStoryWithSentences = (deText: string, ruText: string) => {
    const deSentences = (deText.match(/[^.!?]+[.!?]+/g) || [deText])
      .map(s => s.trim())
      .filter(Boolean);
    const ruSentences = (ruText.match(/[^.!?]+[.!?]+/g) || [ruText])
      .map(s => s.trim())
      .filter(Boolean);

    return deSentences.map((deSentence, index) => {
      const ruSentence = ruSentences[index] || '';
      return (
        <View key={`sentence-${index}`} style={{ margin: 0, padding: 0 }}>
          {renderTextWithTouch(deSentence)}

          <Text
            style={[
              styles.fullStory,
              {
                color: '#136680ff',
                fontWeight: '400',
                margin: 0,
                padding: 0,
                borderRadius: 8,
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

  // -------------------- Добавление слова в пользовательский словарь --------------------
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
              {`${selectedWord} - ${translation}`}
            </Text>
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

      {/* Кнопка воспроизведения аудио */}
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
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {!showSentenceTranslation ? (
            renderTextWithTouch(story.fullStory.de)
          ) : (
            <View>
              {renderStoryWithSentences(story.fullStory.de, story.fullStory.ru)}
            </View>
          )}
        </ScrollView>

        {/* Кнопка возврата */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
        </TouchableOpacity>
      </View>

      {/* Кнопка просмотра всех сохраненных слов */}
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

// -------------------- Стили --------------------
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
