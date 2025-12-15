import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { addHistory } from '../../api/addHistory';

type AddStoryScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'AddStory'
>;

const { height } = Dimensions.get('window');

export default function AddStoryScreen() {
  const navigation = useNavigation<AddStoryScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = await addHistory(title);
      console.log('Сгенерированная история:', data.generatedStory);
      setSuccess(true);
      setTitle('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при добавлении истории');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = title.trim().length === 0 || loading;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Добавить историю</Text>

      <TextInput
        placeholder="Введите текст истории..."
        value={title}
        onChangeText={text => {
          if (text.length <= 2000) {
            setTitle(text);
          } else {
            setTitle(text.slice(0, 2000)); // обрезаем лишние символы
          }
        }}
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
      <Text style={{ textAlign: 'right', marginBottom: 8 }}>
        {title.length}/2000
      </Text>
      <TouchableOpacity
        style={[styles.addButton, isDisabled && { backgroundColor: '#a5d6a7' }]}
        onPress={handleAdd}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : success ? (
          <Text style={styles.addButtonText}>✓</Text>
        ) : (
          <Text style={styles.addButtonText}>Добавить</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-start',
    minHeight: height,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    height: height / 2,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
