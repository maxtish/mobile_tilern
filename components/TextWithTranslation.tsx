import React from 'react';
import { View, Text } from 'react-native';
import { WordTiming } from '../types/storiesTypes';
import { useAppTheme } from '../theme/ThemeProvider';
import { groupWordsIntoSentences } from '../utils/groupWordsIntoSentences';

interface TextWithTranslationProps {
  wordTiming: WordTiming[];
  ruText: string;
  activeIndex: number | null;
  selectedWord: string | null;
  selectedIndex: number | null;
  onWordPress: (word: string, index: number) => void;
  onLayout?: (index: number, layout: { y: number; height: number }) => void;
}

export const TextWithTranslation: React.FC<TextWithTranslationProps> = ({
  wordTiming,
  ruText,
  activeIndex,
  selectedWord,
  selectedIndex,
  onWordPress,
  onLayout,
}) => {
  const { navTheme } = useAppTheme();

  const deSentences = groupWordsIntoSentences(wordTiming);
  const ruSentencesArr = (ruText.match(/[^.!?]+[.!?]+/g) || [ruText])
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <View>
      {deSentences.map((sentenceWords, sentenceIdx) => {
        const ruSentence = ruSentencesArr[sentenceIdx] || '';

        return (
          <View key={sentenceIdx} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {sentenceWords.map(w => (
                <Text
                  key={w.globalIndex}
                  onLayout={event => {
                    onLayout?.(w.globalIndex, event.nativeEvent.layout);
                  }}
                  onPress={() => onWordPress(w.word, w.globalIndex)}
                  style={{
                    backgroundColor:
                      activeIndex === w.globalIndex
                        ? '#5e5d5cff'
                        : selectedIndex === w.globalIndex
                        ? '#5e5d5cff'
                        : 'transparent',
                    fontSize: 18,
                    lineHeight: 28,
                    color: navTheme.colors.text,
                    borderRadius: 4,
                  }}
                >
                  {w.word + ' '}
                </Text>
              ))}
            </View>
            {ruSentence ? (
              <Text style={{ marginTop: 4, fontSize: 16, color: 'gray' }}>
                {ruSentence}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};
