import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { WordTiming } from '../types/storiesTypes';
import { useAppTheme } from '../theme/ThemeProvider';
import { normalizeWord } from '../utils/normalizeWord';

interface TextWithTouchProps {
  wordTiming: WordTiming[];
  activeIndex: number | null;
  selectedWord: string | null;
  selectedIndex: number | null;
  onWordPress: (word: string, index: number) => void;
  onLayout?: (index: number, layout: { y: number; height: number }) => void;
}

export const TextWithTouch: React.FC<TextWithTouchProps> = ({
  wordTiming,
  activeIndex,
  selectedWord,
  selectedIndex,
  onWordPress,
  onLayout,
}) => {
  const { navTheme } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {wordTiming.map((w, index) => {
        const isActive = activeIndex === index;
        const isSelected =
          selectedWord && normalizeWord(selectedWord) === normalizeWord(w.word);

        return (
          <View
            key={index}
            onLayout={event => {
              onLayout?.(index, event.nativeEvent.layout);
            }}
          >
            <Text
              onPress={() => onWordPress(w.word, index)}
              style={{
                backgroundColor: isActive
                  ? '#8cb98cff'
                  : selectedIndex === index
                  ? '#FFD700'
                  : 'transparent',
                fontSize: 18,
                lineHeight: 28,
                color: navTheme.colors.text,
              }}
            >
              {w.word + ' '}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
