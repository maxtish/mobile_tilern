import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { History, BaseWord } from '../../types/storiesTypes';

const { width } = Dimensions.get('window');

interface StoryScreenProps {
  route: {
    params: {
      story: History;
    };
  };
  navigation: any;
}

export default function StoryScreen({ route, navigation }: StoryScreenProps) {
  const { navTheme } = useAppTheme();
  const { story } = route.params;

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  // обработка клика по слову
  const removeArticle = (word: string) => {
    return word.replace(/^(der|die|das|ein|eine)\s+/i, '').toLowerCase();
  };
  const SERVER_URL = 'http://192.168.178.37:3000';
  const handleWordPress = (word: string) => {
    const cleanedWord = word.toLowerCase();

    const found = story.words.find(w => {
      if (w.type === 'noun' && typeof w.word === 'object') {
        // Существительное: сравниваем только корень
        const singular = removeArticle(w.word.singular || '');
        const plural = removeArticle(w.word.plural || '');
        return cleanedWord === singular || cleanedWord === plural;
      } else if (typeof w.word === 'string') {
        // Прочие слова (в том числе артикли) — сравниваем полностью
        return cleanedWord === w.word.toLowerCase();
      }
      return false;
    });

    if (found) {
      setSelectedWord(word);

      if (found.type === 'noun' && typeof found.word === 'object') {
        const singular = removeArticle(found.word.singular || '');
        const plural = removeArticle(found.word.plural || '');
        const form =
          cleanedWord === singular
            ? '(singular)'
            : cleanedWord === plural
            ? '(plural)'
            : '';
        setTranslation(`${found.translation} ${form}`);
      } else {
        setTranslation(found.translation);
      }
    } else {
      setSelectedWord(word);
      setTranslation('Перевод не найден');
    }
  };

  /// --- интерактивные слова ---
  const renderTextWithTouch = (text: string) => {
    const parts = text.split(/(\s+|[.,!?;]+)/);

    return parts.map((part, index) => {
      const cleaned = part.trim();

      if (!cleaned) {
        return (
          <Text
            key={`space-${index}`}
            style={[styles.word, { color: navTheme.colors.text }]}
          >
            {part}
          </Text>
        );
      }

      const isSelected = selectedWord === cleaned;

      return (
        <TouchableOpacity
          key={`word-${index}`}
          onPress={() => handleWordPress(cleaned)}
        >
          <Text
            style={[
              styles.word,
              {
                color: isSelected ? '#000' : navTheme.colors.text,
                backgroundColor: isSelected ? '#FFD700' : 'transparent',
              },
            ]}
          >
            {part}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // делим текст на предложения
  const splitSentences = (text: string) =>
    text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [];

  const renderSentencesWithTranslation = () => {
    const deSentences = splitSentences(story.fullStory.de);
    const ruSentences = splitSentences(story.fullStory.ru);

    return deSentences.map((deSentence, index) => (
      <View key={index} style={styles.sentenceBlock}>
        <Text style={[styles.deSentence, { color: navTheme.colors.text }]}>
          {deSentence}
        </Text>
        {ruSentences[index] && (
          <Text style={[styles.ruSentence, { color: navTheme.colors.text }]}>
            {ruSentences[index]}
          </Text>
        )}
      </View>
    ));
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Картинка */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: `${SERVER_URL}${story.image}` }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Перевод поверх картинки (для отдельного слова) */}
          {translation && (
            <View style={styles.translationOverlay}>
              <Text style={styles.translationText}>{translation}</Text>
            </View>
          )}
        </View>

        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: navTheme.colors.text }]}>
            {story.title.de}
          </Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{story.languageLevel}</Text>
          </View>
        </View>

        {/* Кнопка показать перевод */}
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Text style={styles.showButtonText}>
            {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
          </Text>
        </TouchableOpacity>

        {/* Основной текст */}
        {!showTranslation ? (
          <Text style={styles.fullStory}>
            {renderTextWithTouch(story.fullStory.de)}
          </Text>
        ) : (
          renderSentencesWithTranslation()
        )}

        {/* Кнопка назад */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  imageWrapper: { position: 'relative', marginBottom: 16 },
  image: { width: width - 32, height: 200, borderRadius: 16 },
  translationOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  translationText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  levelBadge: {
    backgroundColor: '#FFD700',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  levelText: { color: '#000', fontWeight: 'bold' },
  fullStory: {
    fontSize: 18,
    lineHeight: 28,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  word: { fontSize: 18, lineHeight: 28, paddingHorizontal: 2, borderRadius: 6 },
  sentenceBlock: { marginBottom: 12 },
  deSentence: { fontSize: 18, fontWeight: '600' },
  ruSentence: { fontSize: 17, opacity: 0.8 },
  showButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  showButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  backButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
});
