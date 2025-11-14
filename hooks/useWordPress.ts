import { useState } from 'react';
import { History } from '../types/storiesTypes';
import { normalizeWord } from '../utils/normalizeWord';

export const useWordPress = (story: History) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [baseFormText, setBaseFormText] = useState<string | null>(null);

  const handleWordPress = (word: string) => {
    const cleanedWord = normalizeWord(word);

    const found = story.words.find(w => {
      if (typeof w.word === 'string') {
        const normalized = normalizeWord(w.word);
        return cleanedWord === normalized;
      }
      return false;
    });

    if (found) {
      setSelectedWord(word);
      setTranslation(found.translation);
      setBaseFormText(found.baseForm);
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
