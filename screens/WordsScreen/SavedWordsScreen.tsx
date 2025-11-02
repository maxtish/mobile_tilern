import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getUserWords } from '../../api/userWords';
import { History, Word } from '../../types/storiesTypes';
import { useAppTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedWords'>;

export default function SavedWordsScreen({ route, navigation }: Props) {
  const { navTheme } = useAppTheme();
  const { userId } = route.params;
  const [words, setWords] = useState<{ word: Word }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const data = await getUserWords(userId);
      setWords(data); // data уже массив
      // проверяем, что пришёл массив

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: navTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: navTheme.colors.text }]}>
        Мои слова
      </Text>
      {words.length === 0 ? (
        <Text style={{ color: navTheme.colors.text }}>
          Нет сохранённых слов
        </Text>
      ) : (
        words.map((item, i) => (
          <View key={i} style={styles.wordItem}>
            <Text style={{ color: navTheme.colors.text, fontSize: 18 }}>
              {typeof item.word.word === 'string'
                ? item.word.word
                : item.word.word.singular || ''}
            </Text>
            <Text style={{ color: '#aaa' }}>{item.word.translation}</Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  wordItem: {
    backgroundColor: '#4e4e4e3a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
});
