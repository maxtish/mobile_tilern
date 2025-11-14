import { WordTiming } from '../types/storiesTypes';

export const groupWordsIntoSentences = (wordTiming: WordTiming[]) => {
  const sentences: (WordTiming & { globalIndex: number })[][] = [];
  let currentSentence: (WordTiming & { globalIndex: number })[] = [];

  wordTiming.forEach((w, idx) => {
    currentSentence.push({ ...w, globalIndex: idx });
    if (/[.!?]$/.test(w.word)) {
      sentences.push(currentSentence);
      currentSentence = [];
    }
  });

  if (currentSentence.length) sentences.push(currentSentence);
  return sentences;
};
