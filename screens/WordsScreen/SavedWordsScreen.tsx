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
type Props = NativeStackScreenProps<RootStackParamList, 'SavedWords'>;

type AddStoryScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'SavedWords'
>;
// -------------------------
// Основной компонент TrainingScreen
// -------------------------
export default function TrainingScreen({ route }: Props) {
  const { navTheme } = useAppTheme();
  const { userId } = route.params;

  // Zustand store
  const { words, setWords, markCorrect, markFailed } = useTrainingStore();
  const navigation = useNavigation<AddStoryScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState<TrainingWord | null>(null);
  const [round, setRound] = useState(1); // 1 или 2
  const [showTranslation, setShowTranslation] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wordsCount, setWordsCount] = useState(0);

  // Цвета для артиклей
  const colors: Record<string, string> = {
    der: '#007bff',
    die: '#ff0000',
    das: '#00cc44',
  };

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
      setLoading(false);

      // сразу выбираем первое слово
      if (trainingWords.length > 0) {
        setCurrentWord(trainingWords[0]); // или вызови nextWord()
      }
    })();
  }, [userId]);

  // -------------------------
  // Автоматический переход на следующее слово после правильного ответа
  // -------------------------
  useEffect(() => {
    let timer: number;
    if (isCorrect) {
      timer = setTimeout(() => {
        nextWord();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCorrect]);

  // -------------------------
  // Выбор следующего слова по алгоритму
  // 1. Берем непрошедшие слова
  // 2. Если все слова пройдены, повторяем ошибки
  // -------------------------
  const nextWord = () => {
    setShowTranslation(false);
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);

    if (words.length === 0) return;

    // Сначала выбираем слова, которые ещё не пройдены
    const unpassed = words.filter(w => !w.passedCorrectly);
    let next: TrainingWord | null = null;

    if (unpassed.length > 0) {
      // выбираем случайное из непрошедших
      next = unpassed[Math.floor(Math.random() * unpassed.length)];
    } else {
      // если все пройдены, повторяем слова с ошибками
      const failedWords = words.filter(w => w.failed);
      if (failedWords.length > 0) {
        next = failedWords[Math.floor(Math.random() * failedWords.length)];
      } else {
        // все слова пройдены верно — можно закончить тренировку
        setCurrentWord(null);
        return;
      }
    }

    setCurrentWord(next);

    // каждые 3 слова меняем раунд
    setWordsCount(prev => {
      const newCount = prev + 1;
      if (newCount % 3 === 0) {
        setRound(r => (r === 1 ? 2 : 1));
      }
      return newCount;
    });
  };

  // -------------------------
  // Проверка ответа в раунде 2
  // -------------------------
  const checkAnswer = () => {
    if (!currentWord) return;
    const correctWord = currentWord.word.word.trim().toLowerCase();
    const inputWord = userInput.trim().toLowerCase();
    const correct = correctWord === inputWord;
    setIsCorrect(correct);
    setShowAnswer(true);

    // Обновляем состояние слова
    if (correct) markCorrect(currentWord.id);
    else markFailed(currentWord.id);
  };

  // -------------------------
  // Рендер раунда 1: показать слово с артиклем и кнопку
  // Кнопка меняет текст: "Показать перевод" → "Дальше"
  // -------------------------
  const renderRound1 = () => {
    if (!currentWord) return null;
    const [article, ...rest] = currentWord.word.word.split(' ');
    const mainWord = rest.join(' ');

    return (
      <View style={styles.card}>
        <Text style={styles.wordText}>
          <Text style={{ color: colors[article] }}>{article}</Text> {mainWord}
        </Text>
        {showTranslation && (
          <Text
            style={[styles.translationText, { color: navTheme.colors.text }]}
          >
            {currentWord.word.translation}
          </Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (showTranslation) {
              nextWord();
            } else {
              setShowTranslation(true);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {showTranslation ? 'Дальше' : 'Показать перевод'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // -------------------------
  // Рендер раунда 2: показать перевод и поле для ввода
  // После правильного ответа таймер автоматически переходит к следующему слову
  // -------------------------
  const renderRound2 = () => {
    if (!currentWord) return null;
    const [article, ...rest] = currentWord.word.word.split(' ');
    const mainWord = rest.join(' ');

    return (
      <View style={styles.card}>
        <Text style={[styles.wordText, { color: navTheme.colors.text }]}>
          {currentWord.word.translation}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: navTheme.colors.text,
              color: navTheme.colors.text,
              backgroundColor: isCorrect === false ? '#ffeded' : '#fff',
            },
          ]}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Введите немецкое слово с артиклем"
          placeholderTextColor="#aaa"
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
                  color: colors[article],
                  opacity: showAnswer ? 1 : 0.3,
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
  // Loader
  // -------------------------
  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: navTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View
        style={[styles.center, { backgroundColor: navTheme.colors.background }]}
      >
        <Text style={{ color: navTheme.colors.text, fontSize: 18 }}>
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
  // Рендер основной UI
  // -------------------------
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[styles.title, { color: navTheme.colors.text }]}>
          Тренировка слов
        </Text>
        {round === 1 ? renderRound1() : renderRound2()}
      </ScrollView>

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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
