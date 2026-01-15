import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../state/userStore';
import { deleteUserWord } from '../../api/userWords';
import { UserWord } from '../../types/storiesTypes';
import { getUserWordsRepository } from '../../utils/cache/userWordsRepository';

export default function AllWordsScreen() {
  const { navTheme } = useAppTheme();
  const { user } = useUserStore();
  const [words, setWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    if (!user) return;
    setLoading(true);
    const res = await getUserWordsRepository(user.id);
    setWords(res);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const success = await deleteUserWord(user.id, id);
    if (success) {
      setWords(words.filter(w => w.id !== id));
    } else {
      console.error(`Не удалось удалить слово ${id}`);
    }
  };

  useEffect(() => {
    fetchWords();
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
      contentContainerStyle={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: navTheme.colors.text }]}>
        Все слова
      </Text>
      {words.map(word => {
        const [article, ...rest] = word.word.word.split(' ');
        const mainWord = rest.join(' ');
        return (
          <View key={word.id} style={styles.wordRow}>
            <Text style={[styles.wordText, { color: '#ffffffff' }]}>
              <Text style={{ fontWeight: 'bold', color: '#007bff' }}>
                {article}{' '}
              </Text>
              {word.word.baseForm ? word.word.baseForm : word.word.word} —{' '}
              {word.word.translation}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(word.id)}
            >
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#423e3eff',
    padding: 12,
    borderRadius: 10,
  },
  wordText: { fontSize: 18, maxWidth: '70%' },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});
