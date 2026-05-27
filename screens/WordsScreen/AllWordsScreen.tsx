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
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

import { useAppTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../state/userStore';
import { deleteUserWord } from '../../api/userWords';
import { UserWord, Word } from '../../types/storiesTypes';
import { getUserWordsRepository } from '../../utils/cache/userWordsRepository';
import { useAddWord } from '../../hooks/useAddWord';
import { translateWord, TranslateWordOption } from '../../api/translateWord';

export default function AllWordsScreen() {
  const { appTheme } = useAppTheme();
  const { user } = useUserStore();
  const { addWord } = useAddWord();

  const [words, setWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translationOptions, setTranslationOptions] = useState<
    TranslateWordOption[]
  >([]);
  const [translationTarget, setTranslationTarget] = useState<
    'word' | 'translation' | null
  >(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable));
    });

    return () => unsubscribe();
  }, []);

  const clearTranslationSuggestions = () => {
    setTranslationOptions([]);
    setTranslationTarget(null);
  };

  const handleTranslate = async ({
    text,
    direction,
    target,
  }: {
    text: string;
    direction: 'de-ru' | 'ru-de';
    target: 'word' | 'translation';
  }) => {
    const sourceText = text.trim();

    if (!sourceText || !isOnline) {
      return;
    }

    setTranslating(true);
    setTranslationOptions([]);
    setTranslationTarget(target);

    try {
      const options = await translateWord(sourceText, direction);

      if (options.length === 0) {
        throw new Error('GPT не вернул варианты перевода');
      }

      setTranslationOptions(options);
    } catch (err: any) {
      setTranslationOptions([]);
      setTranslationTarget(null);

      Toast.show({
        type: 'error',
        text1: 'Ошибка перевода',
        text2: err.message || 'Произошла ошибка перевода',
      });
    } finally {
      setTranslating(false);
    }
  };

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
      const savedOptimistic = await addWord(wordPayload);

      if (savedOptimistic) {
        setWords(prev => [savedOptimistic, ...prev]);

        setNewWord('');
        setNewTranslation('');
        clearTranslationSuggestions();

        Keyboard.dismiss();
      }
    } catch (err: any) {
      console.error('Ошибка при добавлении:', err);

      Toast.show({
        type: 'error',
        text1: 'Ошибка добавления',
        text2: err.message || 'Не удалось добавить слово',
      });
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
          onChangeText={text => {
            setNewWord(text);
            clearTranslationSuggestions();
          }}
        />

        {/* Кнопка 1: Перевод с немецкого на русский */}
        {isOnline && newWord.trim() && !newTranslation.trim() && (
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() =>
              handleTranslate({
                text: newWord,
                direction: 'de-ru',
                target: 'translation',
              })
            }
            disabled={translating}
          >
            <Text style={styles.translateButtonText}>
              {translating ? 'Перевожу...' : '🌐 Перевести на русский'}
            </Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: appTheme.colors.text,
              borderColor: appTheme.colors.border,
              backgroundColor: appTheme.colors.background,
            },
          ]}
          placeholder="Русское слово"
          placeholderTextColor="#888"
          value={newTranslation}
          onChangeText={text => {
            setNewTranslation(text);
            clearTranslationSuggestions();
          }}
        />

        {/* Кнопка 2: Перевод с русского на немецкий */}
        {isOnline && newTranslation.trim() && !newWord.trim() && (
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() =>
              handleTranslate({
                text: newTranslation,
                direction: 'ru-de',
                target: 'word', // Ищем перевод для инпута немецкого слова
              })
            }
            disabled={translating}
          >
            <Text style={styles.translateButtonText}>
              {translating ? 'Перевожу...' : '🌐 Перевести на немецкий'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Список подсказок */}
        {translationOptions.length > 0 && translationTarget && (
          <View style={styles.optionsBox}>
            {translationOptions.map((option, index) => {
              const isTargetTranslation = translationTarget === 'translation';

              // Для de-ru (цель translation) берем русский перевод из option.translation
              // Для ru-de (цель word) берем немецкий перевод из option.translation (согласно новому бэкенду)
              const displayText = option.translation;

              return (
                <TouchableOpacity
                  key={`${option.word}-${index}`}
                  style={styles.optionItem}
                  onPress={() => {
                    if (isTargetTranslation) {
                      setNewTranslation(option.translation); // Заполняем нижний инпут (русский)
                    } else {
                      setNewWord(option.translation); // Заполняем верхний инпут (немецкий)
                    }
                    clearTranslationSuggestions();
                  }}
                >
                  <Text style={styles.optionMain}>
                    {displayText}{' '}
                    {/* Текст подсказки теперь выводится корректно */}
                  </Text>

                  {option.note ? (
                    <Text style={styles.optionNote}>{option.note}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  translateButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#444',
    marginBottom: 12,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionsBox: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    padding: 12,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  optionMain: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionNote: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
});
