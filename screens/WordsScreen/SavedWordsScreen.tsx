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

type Props = NativeStackScreenProps<RootStackParamList, 'SavedWords'>;

export default function TrainingScreen({ route, navigation }: Props) {
  const { navTheme } = useAppTheme();
  const { userId } = route.params;

  const [words, setWords] = useState<{ word: Word }[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [round, setRound] = useState(1); // 1 или 2
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const data = await getUserWords(userId);

      setWords(
        Array.isArray(data)
          ? data.map((item: { word: Word }) => ({ word: item.word }))
          : [],
      );
      setLoading(false);
    })();
  }, [userId]);

  // Если ответ правильный, скрываем кнопку и запускаем таймер
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

  const colors: Record<string, string> = {
    der: '#007bff',
    die: '#ff0000',
    das: '#00cc44',
  };

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: navTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View
        style={[styles.center, { backgroundColor: navTheme.colors.background }]}
      >
        <Text style={{ color: navTheme.colors.text }}>
          Нет сохранённых слов
        </Text>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  const nextWord = () => {
    setShowTranslation(false);
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex % words.length);

    if (nextIndex % 3 === 0) {
      setRound(prev => (prev === 1 ? 2 : 1));
    }
  };

  const checkAnswer = () => {
    const correctWord = currentWord.word.word.trim().toLowerCase();
    const inputWord = userInput.trim().toLowerCase();
    setIsCorrect(correctWord === inputWord);
    setShowAnswer(true);
  };

  const renderRound1 = () => {
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

  const renderRound2 = () => {
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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: navTheme.colors.text }]}>
        Тренировка слов
      </Text>
      {round === 1 ? renderRound1() : renderRound2()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
});
