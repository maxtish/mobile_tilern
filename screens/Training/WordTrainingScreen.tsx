import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { getUserWords } from '../../api/userWords';
import { Word } from '../../types/storiesTypes';
import { useAppTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTrainingStore } from '../../state/userStore';
import { TrainingWord } from '../../types/userWord';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { colorsArticle } from '../../constants/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'WordTraining'>;

type AddStoryScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'WordTraining'
>;

export default function TrainingScreen({ route }: Props) {
  const { appTheme } = useAppTheme();
  const { userId } = route.params;

  const { words, setWords, markCorrect, markFailed } = useTrainingStore();
  const navigation = useNavigation<AddStoryScreenNavigationProp>();

  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState<TrainingWord | null>(null);
  const [round, setRound] = useState(1); // 1 или 2
  const [showTranslation, setShowTranslation] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [round1WordsLeft, setRound1WordsLeft] = useState<TrainingWord[]>([]);

  const totalWords = words.length;
  const passedCount = words.filter(w => w.passedCorrectly).length;

  // -------------------------
  // Загрузка слов с сервера
  // -------------------------
  useEffect(() => {
    (async () => {
      if (!userId) return;
      const data = await getUserWords(userId);
      const trainingWords: TrainingWord[] = data.map(
        (w: { word: Word; id: string }) => ({
          word: w.word,
          id: w.id,
          passedCorrectly: false,
          failed: false,
        }),
      );
      setWords(trainingWords);

      if (trainingWords.length > 0) {
        setCurrentWord(trainingWords[0]);
        // Убираем первое слово из оставшихся для раунда 1
        setRound1WordsLeft(trainingWords.slice(1));
      } else {
        setRound1WordsLeft([]);
      }

      setLoading(false);
    })();
  }, [userId, reversed]);

  // -------------------------
  // Автоматический переход на следующее слово после правильного ответа
  // -------------------------
  useEffect(() => {
    let timer: number;
    if (isCorrect) {
      timer = setTimeout(() => nextWord(), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCorrect]);

  // -------------------------
  // Выбор следующего слова
  // -------------------------
  const nextWord = () => {
    setShowTranslation(false);
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);

    if (words.length === 0) return;

    // ---------- РАУНД 1 ----------
    if (round === 1) {
      if (round1WordsLeft.length === 0) {
        // Все слова раунда 1 пройдены — начинаем раунд 2
        setRound(2);
        // Сбрасываем состояния слов для раунда 2
        setWords(
          words.map(w => ({ ...w, passedCorrectly: false, failed: false })),
        );
        // Инициализируем первое слово раунда 2
        const unpassed = words.filter(w => !w.passedCorrectly);
        if (unpassed.length > 0) setCurrentWord(unpassed[0]);
        return;
      }

      // Берем случайное слово из оставшихся
      const index = Math.floor(Math.random() * round1WordsLeft.length);
      const next = round1WordsLeft[index];

      const newLeft = [...round1WordsLeft];
      newLeft.splice(index, 1);
      setRound1WordsLeft(newLeft);

      setCurrentWord(next);
      return;
    }

    // ---------- РАУНД 2 ----------
    const unpassed = words.filter(w => !w.passedCorrectly);
    let next: TrainingWord | null = null;

    if (unpassed.length > 0) {
      next = unpassed[Math.floor(Math.random() * unpassed.length)];
    } else {
      const failedWords = words.filter(w => w.failed);
      if (failedWords.length > 0) {
        next = failedWords[Math.floor(Math.random() * failedWords.length)];
      } else {
        setCurrentWord(null);
        return;
      }
    }

    setCurrentWord(next);
  };

  // -------------------------
  // Проверка ответа (раунд 2)
  // -------------------------
  const checkAnswer = () => {
    if (!currentWord) return;
    const correctWord = currentWord.word.baseForm
      ? currentWord.word.baseForm.trim().toLowerCase()
      : currentWord.word.word.trim().toLowerCase();
    const inputWord = userInput.trim().toLowerCase();
    const correct = correctWord === inputWord;
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) markCorrect(currentWord.id);
    else markFailed(currentWord.id);
  };

  // -------------------------
  // Компоненты для отображения слов
  // -------------------------
  const CurrentWordComponent: React.FC = () => {
    if (!currentWord) return null;

    const baseForm = currentWord.word.baseForm
      ? currentWord.word.baseForm
      : currentWord.word.word;
    let article = '';
    let mainWord = baseForm;

    if (baseForm.includes(' ')) {
      const parts = baseForm.split(' ');
      article = parts[0];
      mainWord = parts.slice(1).join(' ');
    }

    return (
      <Text style={[styles.wordText, { color: appTheme.colors.text }]}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          <Text
            style={{
              color:
                colorsArticle[article as keyof typeof colorsArticle] ||
                appTheme.colors.text,
            }}
          >
            {article}{' '}
          </Text>
          <Text
            style={{
              color:
                colorsArticle[article as keyof typeof colorsArticle] ||
                appTheme.colors.text,
            }}
          >
            {mainWord}
          </Text>
        </Text>
      </Text>
    );
  };

  const TranslationWordComponent: React.FC = () => {
    if (!currentWord) return null;
    return (
      <Text style={[styles.translationText, { color: appTheme.colors.text }]}>
        {currentWord.word.translation}
      </Text>
    );
  };

  // -------------------------
  // Рендер раундов
  // -------------------------
  const renderRound1 = () => {
    const handleNextRound1 = () => {
      if (!currentWord) return;

      // отмечаем слово как пройденное
      markCorrect(currentWord.id);

      nextWord();
    };

    return (
      <View style={styles.card}>
        {reversed ? (
          <>
            <CurrentWordComponent />
            {showTranslation && <TranslationWordComponent />}
          </>
        ) : (
          <>
            <TranslationWordComponent />
            {showTranslation && <CurrentWordComponent />}
          </>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (showTranslation) handleNextRound1();
            else setShowTranslation(true);
          }}
        >
          <Text style={styles.buttonText}>
            {showTranslation ? 'Дальше' : 'Показать перевод'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { flex: 1, marginLeft: 8, backgroundColor: '#6c757d' },
          ]}
          onPress={() => {
            setReversed(prev => !prev);
            setShowTranslation(false);
          }}
        >
          <Text style={styles.buttonText}>Наоборот</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRound2 = () => {
    if (!currentWord) return null;
    const [article, ...rest] = currentWord.word.baseForm.split(' ');
    const mainWord = rest.join(' ');

    return (
      <View style={styles.card}>
        <Text style={[styles.wordText, { color: appTheme.colors.text }]}>
          {currentWord.word.translation}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: appTheme.colors.text,
              backgroundColor:
                isCorrect === false ? '#661a1aff' : appTheme.colors.background,
              color: appTheme.colors.text,
            },
          ]}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Введите немецкое слово "
          placeholderTextColor={appTheme.colors.text}
        />
        {!isCorrect && (
          <TouchableOpacity style={styles.button} onPress={checkAnswer}>
            <Text style={styles.buttonText}>Проверить</Text>
          </TouchableOpacity>
        )}
        {showAnswer && (
          <TouchableOpacity onPress={() => setShowAnswer(false)}>
            <Text
              style={[
                styles.translationText,
                {
                  color:
                    colorsArticle[article as keyof typeof colorsArticle] ||
                    appTheme.colors.text,
                  opacity: 1,
                  fontSize: 20,
                },
              ]}
            >
              {article} {mainWord}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // -------------------------
  // Loader и окончание тренировки
  // -------------------------
  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: appTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View
        style={[styles.center, { backgroundColor: appTheme.colors.background }]}
      >
        <Text style={{ color: appTheme.colors.text, fontSize: 18 }}>
          Тренировка завершена! Все слова пройдены.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // -------------------------
  // Основной UI
  // -------------------------
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[styles.title, { color: appTheme.colors.text }]}>
          Тренировка слов
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: appTheme.colors.text }]}>
            Пройдено: {passedCount} из {totalWords}
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(passedCount / totalWords) * 100}%` },
              ]}
            />
          </View>
        </View>

        {round === 1 ? renderRound1() : renderRound2()}
      </ScrollView>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: '#28a745' }]}
        onPress={() => navigation.navigate('AllWords')}
      >
        <Text style={styles.backButtonText}>Все слова</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

// -------------------------
// Стили
// -------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#4e4e4e3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wordText: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  translationText: { fontSize: 20, marginBottom: 12 },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginTop: 12,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#6c757d',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  progressContainer: { marginBottom: 16 },
  progressText: { fontSize: 16, marginBottom: 6, textAlign: 'center' },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
});
