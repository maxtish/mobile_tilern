import { Card } from '../screens/Game/GameMemoryScreen';
import { UserWord } from '../types/userWord';

const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Дополнительный массив слов, чтобы можно было дополнять
const DEFAULT_WORDS = [
  { de: 'die Voraussetzung', ru: 'предпосылка, условие' },
  { de: 'die Gelegenheit', ru: 'возможность' },
  { de: 'die Lösung', ru: 'решение' },
  { de: 'der Vorteil', ru: 'преимущество' },
  { de: 'der Nachteil', ru: 'недостаток' },
  { de: 'die Entwicklung', ru: 'развитие' },
  { de: 'die Bedeutung', ru: 'значение' },
  { de: 'der Zusammenhang', ru: 'связь, контекст' },
  { de: 'das Ergebnis', ru: 'результат' },
  { de: 'die Herausforderung', ru: 'вызов, сложная задача' },
  { de: 'der Einfluss', ru: 'влияние' },
  { de: 'die Entscheidung', ru: 'решение' },
  { de: 'die Verantwortung', ru: 'ответственность' },
  { de: 'die Erfahrung', ru: 'опыт' },
  { de: 'die Unterstützung', ru: 'поддержка' },
  { de: 'das Verhalten', ru: 'поведение' },
];

export const createDeckFromUserWords = (userWords: UserWord[]): Card[] => {
  let selectedWords: UserWord[] = [];

  if (userWords.length > 8) {
    // Случайно выбираем 8 слов
    selectedWords = shuffle(userWords).slice(0, 8);
  } else if (userWords.length < 8) {
    // Добавляем недостающие слова из DEFAULT_WORDS
    const needed = 8 - userWords.length;

    const defaultWordsToAdd = shuffle(DEFAULT_WORDS)
      .slice(0, needed)
      .map((w, index) => ({
        id: `default-${index}`,
        userId: 'default',
        word: {
          type: 'default',
          word: w.de,
          plural: '',
          baseForm: w.de,
          translation: w.ru,
        },
        createdAt: new Date().toISOString(),
      }));

    selectedWords = [...userWords, ...defaultWordsToAdd];
  } else {
    selectedWords = [...userWords];
  }

  // Создаем колоду
  const cards: Card[] = [];

  selectedWords.forEach((userWord, index) => {
    const pairId = `pair-${index}`;

    cards.push({
      id: `${pairId}-word`,
      value: userWord.word.baseForm
        ? userWord.word.baseForm
        : userWord.word.word,
      pairId,
      isFlipped: false,
      isMatched: false,
    });

    cards.push({
      id: `${pairId}-translation`,
      value: userWord.word.translation,
      pairId,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffle(cards);
};
