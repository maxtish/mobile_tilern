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
  AppState,
  AppStateStatus,
  Alert,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { History } from '../../types/storiesTypes';
import { colorsArticle, SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';
import { useAudio } from '../../hooks/useAudio';
import { splitWord, TextWithTouch } from '../../components/TextWithTouch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAddWord } from '../../hooks/useAddWord';
import { useWordPress } from '../../hooks/useWordPress';
import { useFocusEffect } from '@react-navigation/native';
import { deleteHistory } from '../../api/deleteHistory';
import Toast from 'react-native-toast-message';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';

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
  const { isDark, appTheme } = useAppTheme(); // Тема приложения
  const { story } = route.params; // История из параметров

  // -------------------- Состояния --------------------
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Индекс текущего слова для подсветки
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(false); // Флаг показа перевода предложений
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); ///Чтобы подсвечивался только кликнутый экземпляр
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const wordLayouts = React.useRef<{
    [key: number]: { y: number; height: number };
  }>({});
  const [activeArticleColors, setActiveArticleColors] = useState(false);
  const { addWord } = useAddWord(story, selectedIndex);
  const [playbackRate, setPlaybackRate] = useState(1); // по умолчанию 1x

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
        // ищем первый токен, который имеет тайминги и попадает в текущий момент
        const index = story.tokenTiming.findIndex(
          w =>
            w.start !== null &&
            w.end !== null &&
            adjustedTime >= w.start &&
            adjustedTime <= w.end,
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

  const Pause = () => {
    if (sound && isPlaying) {
      sound.pause();
      stopSync(); // останавливаем подсветку слов
      setIsPlaying(false);
    }
  };

  // -------------------- скорость воспроизведения --------------------
  const handleChangeSpeed = (rate: number) => {
    setPlaybackRate(rate);

    if (sound) {
      sound.setSpeed(rate); // ✅ БЕЗ ошибок TS
    }
  };

  // -------------------- приложение ушло в фон или свернуто → ставим паузу--------------------
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState !== 'active') {
          // приложение ушло в фон или свернуто → ставим паузу
          Pause();
        }
      },
    );

    return () => subscription.remove();
  }, [sound, isPlaying]);

  // При уходе на другой экран
  useFocusEffect(
    React.useCallback(() => {
      activateKeepAwake(); // не даем экрану засыпать
      return () => {
        // когда экран теряет фокус (уходим на другой экран)
        deactivateKeepAwake();
        Pause(); // ставим аудио на паузу
      };
    }, [sound, isPlaying]),
  );

  // -------------------- Обработка слов --------------------

  const { selectedWord, translation, baseFormText, handleWordPress } =
    useWordPress(story);

  // -------------------- Основной рендер --------------------
  return (
    <View style={[styles.container]}>
      {/* Изображение истории */}
      <View>
        <Image
          source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
          style={[
            styles.image,
            isDark ? styles.imageWrapperIsDark : styles.imageWrapper, // ← ДОБАВИТЬ ТУТ
          ]}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#bbbbbb" />
        </TouchableOpacity>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{story.languageLevel}</Text>
        </View>
        {user?.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => {
              Alert.alert(
                'Удалить историю?',
                'После удаления восстановить нельзя.',
                [
                  { text: 'Отмена', style: 'cancel' },
                  {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await deleteHistory(story.id);

                        Toast.show({
                          type: 'success',
                          text1: 'История удалена',
                          position: 'top',
                          topOffset: 0,
                          visibilityTime: 2000,
                        });

                        navigation.goBack();
                      } catch (err: any) {
                        Toast.show({
                          type: 'success',
                          text1: 'Ошибка удаления',
                          position: 'top',
                          topOffset: 0,
                          visibilityTime: 2000,
                        });
                      }
                    },
                  },
                ],
              );
            }}
          >
            <Ionicons name="trash-outline" size={22} color="#ff4444" />
          </TouchableOpacity>
        )}

        {/* Перевод выбранного слова */}
        {translation && (
          <View style={styles.translationOverlay}>
            <Text style={styles.translationText}>
              {baseFormText && selectedWord
                ? `${baseFormText}  \n ${
                    splitWord(selectedWord).pure
                  } - ${translation}`
                : `${selectedWord} - ${translation}`}
            </Text>
            {user && selectedWord && (
              <TouchableOpacity
                style={styles.addWordButton}
                onPress={() => selectedWord && addWord(selectedWord)}
              >
                <Text style={{ color: appTheme.colors.text }}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginHorizontal: 16,
          marginVertical: 8,
        }}
      >
        {/* Кнопка воспроизведения аудио */}
        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isLoading ? '#424242ff' : '#424242ff' },
          ]}
          onPress={handlePlayPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#bbbbbb" />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause-outline' : 'play-outline'}
              size={22}
              color="#bbbbbb"
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 8,
          }}
        >
          {[0.7, 0.8, 0.9, 1, 1.1, 1.2].map(rate => (
            <TouchableOpacity
              key={rate}
              onPress={() => handleChangeSpeed(rate)}
              style={{
                marginHorizontal: 6,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor:
                  playbackRate === rate ? '#FFD700' : '#424242ff',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{rate}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.showButtonArticle}
          onPress={() => setActiveArticleColors(!activeArticleColors)}
        >
          <View style={styles.articlesRow}>
            <Text
              style={[
                styles.articleText,
                { color: colorsArticle.der || appTheme.colors.text },
              ]}
            >
              der{' '}
            </Text>
            <Text
              style={[
                styles.articleText,
                { color: colorsArticle.die || appTheme.colors.text },
              ]}
            >
              die{' '}
            </Text>
            <Text
              style={[
                styles.articleText,
                { color: colorsArticle.das || appTheme.colors.text },
              ]}
            >
              das
            </Text>
          </View>
        </TouchableOpacity>

        {/* Кнопка показа/скрытия перевода предложений  */}
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowSentenceTranslation(!showSentenceTranslation)}
        >
          <Text style={styles.showButtonText}>
            {showSentenceTranslation ? 'Скрыть перевод' : 'Показать перевод'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Заголовок и уровень истории */}
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: appTheme.colors.textHistory }]}
            >
              {story.title.de}
            </Text>
          </View>

          {/* Основной текст истории */}

          <TextWithTouch
            showSentenceTranslation={showSentenceTranslation}
            ruText={story.fullStory.ru}
            activeArticleColors={activeArticleColors}
            wordsHistory={story.words}
            tokenTiming={story.tokenTiming}
            activeIndex={activeIndex}
            selectedWord={selectedWord}
            selectedIndex={selectedIndex}
            onWordPress={(word, index) => {
              setSelectedIndex(index);
              handleWordPress(word, index);
            }}
            onLayout={(index, layout) => {
              wordLayouts.current[index] = layout;
            }}
          />
        </ScrollView>
        {/* Кнопка WordTraining */}
        {user ? (
          <TouchableOpacity
            style={styles.showButton}
            onPress={() =>
              navigation.navigate('WordTraining', { userId: user?.id })
            }
          >
            <Text style={styles.showButtonText}>📚 Тренировка слов</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageWrapper: { opacity: 0.99 },
  imageWrapperIsDark: { opacity: 0.4 },
  image: {
    width: '100%',
    aspectRatio: 16 / 7,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  translationOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // полупрозрачный, мягкий
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -18, // половина ширины контейнера 36px
    width: 36,
    height: 36,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  levelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffd900d8',
    width: 36,
    height: 36,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  translationText: {
    color: '#bbbbbb',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },

  levelText: { color: '#000', fontWeight: 'bold' },

  playButton: {
    padding: 8,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addWordButton: {
    backgroundColor: '#157002ff',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },

  showButtonArticle: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#424242ff', // тёмный бархатный
  },

  articlesRow: {
    flexDirection: 'row',
  },

  articleText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  showButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#424242ff',
    alignSelf: 'center',
    marginTop: 16,
  },

  showButtonText: {
    color: '#bbbbbb',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
