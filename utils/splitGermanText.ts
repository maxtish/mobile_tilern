// utils/splitGermanText.ts
export const splitGermanText = (text: string): string[] => {
  // Разделяем на слова, знаки препинания и пробелы
  return text.match(/[\wÄÖÜäöüß]+|[.,!?;:"()«»—-]|\s+/g) || [text];
};
