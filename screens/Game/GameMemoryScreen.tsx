import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useUserStore } from '../../state/userStore';
import { createDeckFromUserWords } from '../../utils/createDeckFromUserWords';
import { getUserWordsRepository } from '../../utils/cache/userWordsRepository';

const NUM_COLUMNS = 3;
const GAP = 5;
// ===== TYPES =====
export type Card = {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
};

// ===== MAIN COMPONENT =====
export default function GameMemoryScreen() {
  const user = useUserStore(state => state.user);
  const [deck, setDeck] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const loadWords = async () => {
    try {
      if (!user) return;
      const userWords = await getUserWordsRepository(user.id);
      const deck = createDeckFromUserWords(userWords);
      setDeck(deck);
    } catch (error) {
      console.error('Ошибка загрузки слов:', error);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const onCardPress = (card: Card) => {
    if (card.isFlipped || card.isMatched || selected.length === 2) return;

    const updatedDeck = deck.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c,
    );

    const newSelected = [...selected, { ...card, isFlipped: true }];

    setDeck(updatedDeck);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newSelected, updatedDeck);
    }
  };

  const checkMatch = (cards: Card[], currentDeck: Card[]) => {
    const [first, second] = cards;

    if (first.pairId === second.pairId) {
      setTimeout(() => {
        setDeck(prev =>
          prev.map(c =>
            c.pairId === first.pairId ? { ...c, isMatched: true } : c,
          ),
        );
        setSelected([]);
      }, 500);
    } else {
      setTimeout(() => {
        setDeck(prev =>
          prev.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, isFlipped: false }
              : c,
          ),
        );
        setSelected([]);
      }, 800);
    }
  };

  const resetGame = () => {
    loadWords();
    setSelected([]);
    setMoves(0);
  };

  const allMatched = deck.length > 0 && deck.every(c => c.isMatched);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>
      <Text style={styles.subtitle}>Найди пару</Text>
      <View
        style={styles.containerWrapper}
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
          setContainerHeight(event.nativeEvent.layout.height);
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {deck.map(card => {
            const numRows = Math.ceil(deck.length / NUM_COLUMNS);
            const cardWidth =
              (containerWidth - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
            const cardHeight = Math.min(
              cardWidth,
              containerHeight / numRows, // 150 пикселей отдаем под заголовки/текст
            );

            return (
              <View
                key={card.id}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  marginBottom: GAP,
                }}
              >
                <CardView
                  card={card}
                  onPress={onCardPress}
                  cardWidth={cardWidth}
                />
              </View>
            );
          })}
        </View>
      </View>
      <Text style={styles.moves}>Ходы: {moves}</Text>

      {allMatched && (
        <View style={styles.winBox}>
          <Text style={styles.winText}>🎉 Победа!</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Играть снова</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ===== CARD COMPONENT =====
type CardProps = {
  card: Card;
  onPress: (card: Card) => void;
  cardWidth: number;
};

const CardView: React.FC<CardProps> = ({ card, onPress, cardWidth }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: card.isFlipped ? 180 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [card.isFlipped]);

  if (card.isMatched) {
    return <View style={[styles.card, styles.cardMatched]} />;
  }

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  //////////////////////////////////////////////
  const CardText: React.FC<{ text: string; style?: any }> = ({
    text,
    style,
  }) => {
    const baseFontSize = 18;
    const minFontSize = 8;

    // Разбиваем текст по пробелам и вставляем переносы
    let displayText = text.includes(' ') ? text.replace(/ /g, '\n') : text;

    // Для каждой строки проверяем длину, если >14 добавляем перенос после 14-го символа
    displayText = displayText
      .split('\n')
      .map(line =>
        line.length > 14 ? line.slice(0, 14) + '-\n' + line.slice(14) : line,
      )
      .join('\n');

    return (
      <Text
        style={[style, { fontSize: baseFontSize, textAlign: 'center' }]}
        numberOfLines={displayText.split('\n').length} // число строк = число переносов
        ellipsizeMode="clip"
        adjustsFontSizeToFit={true} // авто-уменьшение шрифта
        minimumFontScale={minFontSize / baseFontSize} // минимальный размер
      >
        {displayText}
      </Text>
    );
  };
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.9}
      onPress={() => onPress(card)}
    >
      <View style={styles.cardInner}>
        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              backfaceVisibility: 'hidden',
              position: 'absolute',
            },
          ]}
        />

        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              transform: [{ rotateY: frontInterpolate }],
              backfaceVisibility: 'hidden',
            },
          ]}
        >
          <CardText text={card.value} style={styles.cardText} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// ===== STYLES =====
const { width } = Dimensions.get('window');
const cellWidth = (width - GAP * NUM_COLUMNS + 1) / NUM_COLUMNS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
  },
  containerWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  grid: {},
  cell: {
    width: cellWidth,
    aspectRatio: 1,
    paddingVertical: GAP,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  cardInner: {
    flex: 1,
    width: '100%',
    maxWidth: 100,
    height: '100%',
    maxHeight: 100,
  },
  cardBack: {
    backgroundColor: '#1e293b',
  },
  cardFront: {
    backgroundColor: '#38bdf8',
  },
  cardMatched: {
    backgroundColor: 'transparent',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#020617',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexShrink: 1, // позволяет тексту уменьшаться
    flexWrap: 'wrap', // перенос по словам
    lineHeight: 20, // оптимальная высота строки
  },
  moves: {
    marginTop: 12,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  winBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  winText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22c55e',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '700',
  },
});
