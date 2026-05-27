import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../state/userStore';
import { deleteUserWord } from '../../api/userWords';
import { UserWord, Word } from '../../types/storiesTypes';
import { getUserWordsRepository } from '../../utils/cache/userWordsRepository';

// Подключаем наш новый хук
import { useAddWord } from '../../hooks/useAddWord';

export default function AllWordsScreen() {
  const { appTheme } = useAppTheme();
  const { user } = useUserStore();
  const { addWord } = useAddWord(); // Инициализируем хук

  const [words, setWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния для формы
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchWords = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getUserWordsRepository(user.id);
      setWords(res);
    } catch (err) {
      console.error('Ошибка загрузки слов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // ===== Логика добавления слова через хук =====
  const handleAddWord = async () => {
    if (!newWord.trim() || !newTranslation.trim() || !user) return;

    setIsAdding(true);

    const wordPayload: Word = {
      type: 'manual',
      word: newWord.trim(),
      translation: newTranslation.trim(),
      plural: '',
      baseForm: '',
    };

    try {
      // Вызываем универсальный метод из хука
      // Он сам обновит AsyncStorage и добавит в очередь если надо
      const savedOptimistic = await addWord(wordPayload);

      if (savedOptimistic) {
        // Если хук вернул объект, добавляем его в локальный стейт экрана
        setWords(prev => [savedOptimistic, ...prev]);

        // Очищаем форму
        setNewWord('');
        setNewTranslation('');
        Keyboard.dismiss();
      }
    } catch (err) {
      console.error('Ошибка при добавлении:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const success = await deleteUserWord(user.id, id);
    if (success) {
      setWords(prev => prev.filter(w => w.id !== id));
    }
  };

  if (loading && words.length === 0) {
    return (
      <View
        style={[styles.center, { backgroundColor: appTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: appTheme.colors.text }]}>
        📚 Мой словарь
      </Text>

      {/* Блок добавления */}
      <View style={[styles.addCard, { backgroundColor: appTheme.colors.card }]}>
        <TextInput
          style={[
            styles.input,
            {
              color: appTheme.colors.text,
              borderColor: appTheme.colors.border,
              backgroundColor: appTheme.colors.background,
            },
          ]}
          placeholder="Немецкое слово"
          placeholderTextColor="#888"
          value={newWord}
          onChangeText={setNewWord}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: appTheme.colors.text,
              borderColor: appTheme.colors.border,
              backgroundColor: appTheme.colors.background,
            },
          ]}
          placeholder="Перевод"
          placeholderTextColor="#888"
          value={newTranslation}
          onChangeText={setNewTranslation}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: isAdding ? '#ccc' : appTheme.colors.primary },
          ]}
          onPress={handleAddWord}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Добавить слово</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Список слов */}
      {words.map(item => (
        <View
          key={item.id}
          style={[styles.wordRow, { backgroundColor: appTheme.colors.card }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.wordText, { color: appTheme.colors.text }]}>
              {item.word.word}
            </Text>
            <Text style={{ color: '#242121', fontSize: 14 }}>
              {item.word.translation}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  addCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  addButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  wordRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  wordText: { fontSize: 18, fontWeight: '600' },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: 20,
  },
  deleteButtonText: { color: '#dc3545', fontWeight: 'bold' },
});
