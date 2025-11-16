import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Word, WordTiming } from '../types/storiesTypes';
import { useAppTheme } from '../theme/ThemeProvider';
import { normalizeWord } from '../utils/normalizeWord';
import { colorsArticle } from '../constants/constants';

interface TextWithTouchProps {
  showSentenceTranslation: boolean;
  ruText: string;
  activeArticleColors: boolean;
  wordsHistory: Word[];
  wordTiming: WordTiming[];
  activeIndex: number | null;
  selectedWord: string | null;
  selectedIndex: number | null;
  onWordPress: (word: string, index: number) => void;
  onLayout?: (index: number, layout: { y: number; height: number }) => void;
}

const splitWord = (text: string) => {
  const match = text.match(/^([\p{L}\p{N}%°]+)(.*)$/u);

  if (!match) {
    return { pure: text.trim(), extra: text.replace(text.trim(), '') };
  }

  return {
    pure: match[1], // чистое слово
    extra: match[2], // знаки, пробелы, хвост
  };
};
///////////////////////
export const TextWithTouch: React.FC<TextWithTouchProps> = ({
  showSentenceTranslation,
  ruText,
  activeArticleColors,
  wordsHistory,
  wordTiming,
  activeIndex,
  selectedWord,
  selectedIndex,
  onWordPress,
  onLayout,
}) => {
  const { appTheme } = useAppTheme();

  //////////////////

  const ruSentencesArr = (ruText.match(/[^.!?:]+[.!?:]+/g) || [ruText])
    .map(s => s.trim())
    .filter(Boolean);
  let sentences = 0;
  ////////
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {wordTiming.map((w, index) => {
        const currentWord: Word = wordsHistory[index];
        if (!currentWord) return null;
        const { pure, extra } = splitWord(w.word);

        const endsSentence = extra === '.' || extra === '!' || extra === '?';
        const extraSp = extra + ' ';
        // Фраза для отображения после конца предложения
        const ruSentence = endsSentence ? ruSentencesArr[sentences] : null;

        if (endsSentence) sentences = sentences + 1;
        const isActive = activeIndex === index;
        const baseForm = currentWord.baseForm
          ? currentWord.baseForm
          : currentWord.word;
        let article: string | null = null;
        let mainWord = baseForm;

        // Разделяем только если есть пробел
        if (baseForm.includes(' ')) {
          const parts = baseForm.split(' ');
          article = parts[0];
          mainWord = parts.slice(1).join(' ');
        }

        const isSelected =
          selectedWord && normalizeWord(selectedWord) === normalizeWord(w.word);

        return (
          <React.Fragment key={index}>
            <Text
              style={[
                styles.textWordHistory,
                {
                  fontFamily: appTheme.fonts.medium.fontFamily,
                  color: appTheme.colors.textHistory,
                },
              ]}
            >
              <Text
                onLayout={event => {
                  onLayout?.(index, event.nativeEvent.layout);
                }}
                onPress={() => onWordPress(w.word, index)}
                style={[
                  styles.textWordHistory,
                  {
                    backgroundColor: isActive
                      ? appTheme.colors.wordHistoryBackground
                      : selectedIndex === index
                      ? appTheme.colors.wordHistoryBackground
                      : 'transparent',
                    fontFamily: appTheme.fonts.medium.fontFamily,
                    color: activeArticleColors
                      ? appTheme.colors.textHistory
                      : (article &&
                          colorsArticle[
                            article as keyof typeof colorsArticle
                          ]) ||
                        appTheme.colors.textHistory
                      ? colorsArticle[article as keyof typeof colorsArticle] ||
                        appTheme.colors.textHistory
                      : appTheme.colors.textHistory,
                  },
                ]}
              >
                {pure}
              </Text>

              {extra + ' '}
            </Text>
            {endsSentence && ruSentence && showSentenceTranslation ? (
              <Text
                style={{
                  fontSize: 16,
                  color: 'gray',
                  marginTop: 4,
                  width: '100%',
                }}
              >
                {ruSentence}
              </Text>
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  textWordHistory: {
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 1.1,
    borderRadius: 4,
  },
});
