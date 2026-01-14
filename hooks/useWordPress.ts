import { useState } from 'react';
import { History } from '../types/storiesTypes';
import { splitWord } from '../components/TextWithTouch';

export const useWordPress = (story: History | null) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [baseFormText, setBaseFormText] = useState<string | null>(null);

  const handleWordPress = (word: string, index: number) => {
    // 1️⃣ история ещё не загружена
    if (!story || !Array.isArray(story.words)) {
      setSelectedWord(word);
      setTranslation(null);
      setBaseFormText(null);
      return;
    }

    // 2️⃣ защита от выхода за границы
    const wordEntry = story.words[index];
    if (!wordEntry) {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
      setBaseFormText(null);
      return;
    }

    // 3️⃣ нормализация слова
    const { pure } = splitWord(word);
    const { pure: pureFromStory } = splitWord(wordEntry.word);

    // 4️⃣ сравнение
    if (pure === pureFromStory) {
      setSelectedWord(word);
      setTranslation(wordEntry.translation);
      setBaseFormText(wordEntry.baseForm);
    } else {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
      setBaseFormText(null);
    }
  };

  return {
    selectedWord,
    translation,
    baseFormText,
    handleWordPress,
  };
};
