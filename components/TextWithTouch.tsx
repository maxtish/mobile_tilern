import React, { useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Word, TokenTiming } from '../types/storiesTypes';
import { useAppTheme } from '../theme/ThemeProvider';
import { normalizeWord } from '../utils/normalizeWord';
import { colorsArticle } from '../constants/constants';

interface TextWithTouchProps {
  showSentenceTranslation: boolean;
  ruText: string;
  activeArticleColors: boolean;
  wordsHistory: Word[];
  tokenTiming: TokenTiming[];
  activeIndex: number | null;
  selectedWord: string | null;
  selectedIndex: number | null;
  onWordPress: (word: string, index: number) => void;
  onLayout?: (index: number, layout: { y: number; height: number }) => void;
}

export const splitWord = (
  text: string,
): { pure: string; extraBefore: string; extraAfter: string } => {
  let extraBefore = '';
  let extraAfter = '';

  let s = text;

  // 1. Пробелы в начале → extraBefore
  const leadingSpaces = s.match(/^\s+/);
  if (leadingSpaces) {
    extraBefore += leadingSpaces[0];
    s = s.slice(leadingSpaces[0].length);
  }

  // 2. Ведущая пунктуация (например „) → extraBefore
  const leadingPunct = s.match(/^[^°0-9A-Za-zÀ-ÿ\p{L}]/u);
  if (leadingPunct) {
    extraBefore += leadingPunct[0];
    s = s.slice(leadingPunct[0].length);
  }

  // 3. pure + tail
  const match = s.match(/^(.+?)([\s\p{P}]*?)$/u);

  if (!match) {
    return { pure: s, extraBefore, extraAfter };
  }

  const pure = match[1];
  const tail = match[2] || '';
  extraAfter = tail;

  return { pure, extraBefore, extraAfter };
};

///////////////////////
export const TextWithTouch: React.FC<TextWithTouchProps> = ({
  showSentenceTranslation,
  ruText,
  activeArticleColors,
  wordsHistory,
  tokenTiming,
  activeIndex,
  selectedWord,
  selectedIndex,
  onWordPress,
  onLayout,
}) => {
  const { appTheme, isDark } = useAppTheme();

  const backgroundTexture = isDark
    ? require('../assets/texture/black-plasterboard-texture.jpg')
    : require('../assets/texture/sepia-plasterboard-texture.jpg');

  //////////////////

  const ruSentencesArr = (ruText.match(/[^.!?]+[.!?]+/g) || [ruText])
    .map(s => s.trim())
    .filter(Boolean);
  let sentences = 0;
  ////////
  return (
    <ImageBackground
      imageStyle={{ resizeMode: 'repeat', borderRadius: 15 }}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {tokenTiming.map((w, index) => {
        const currentWord: Word = wordsHistory[index];
        if (!currentWord) return null;
        const { pure, extraBefore, extraAfter } = splitWord(w.word);

        const endsSentence = /[.!?]/.test(extraAfter.trim());

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

        return (
          <React.Fragment key={index}>
            <View
              onLayout={event => {
                onLayout?.(index, event.nativeEvent.layout);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* EXTRA BEFORE */}
              {extraBefore ? (
                <Text
                  style={[
                    styles.extraText,
                    {
                      color: appTheme.colors.textHistory,
                      marginLeft: 7, // marginLeft на ведущий знак
                    },
                  ]}
                >
                  {extraBefore}
                </Text>
              ) : null}

              {/* PURE WORD */}
              <Text
                onPress={() => onWordPress(w.word, index)}
                style={[
                  styles.pureWord,
                  {
                    backgroundColor:
                      isActive || selectedIndex === index
                        ? appTheme.colors.wordHistoryBackground
                        : 'transparent',
                    color: activeArticleColors
                      ? appTheme.colors.textHistory
                      : (article &&
                          colorsArticle[
                            article as keyof typeof colorsArticle
                          ]) ||
                        appTheme.colors.textHistory,
                    marginLeft: extraBefore ? 0 : 7, // marginLeft только если нет leading знака
                  },
                ]}
              >
                {pure}
              </Text>

              {/* EXTRA AFTER */}
              <Text
                style={[
                  styles.extraText,
                  { color: appTheme.colors.textHistory },
                ]}
              >
                {extraAfter}
              </Text>
            </View>

            {/* RU TRANSLATION */}
            {endsSentence && ruSentence && showSentenceTranslation ? (
              <Text style={styles.translation}>{ruSentence}</Text>
            ) : null}
          </React.Fragment>
        );
      })}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  pureWord: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: 1.1,
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: 7,
    paddingVertical: 1,
  },
  extraText: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 1.1,
  },
  translation: {
    fontSize: 16,
    color: '#646464ff',
    //backgroundColor: 'rgba(54, 54, 54, 0.6)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    width: '100%',
    lineHeight: 22,
  },
});
