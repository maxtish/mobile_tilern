import { useState } from 'react';
import { History } from '../types/storiesTypes';
import { splitWord } from '../components/TextWithTouch';

export const useWordPress = (story: History) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [baseFormText, setBaseFormText] = useState<string | null>(null);
  let indexW: number | null = null;

  const handleWordPress = (word: string, index: number) => {
    const { pure } = splitWord(word);
    const purHW = splitWord(story.words[index].word).pure;
    const found = pure === purHW ? story.words[index] : undefined;

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
