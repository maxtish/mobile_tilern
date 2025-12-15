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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addHistory } from '../../api/addHistory';
import { submitGPTHistory } from '../../api/submitGPTHistory';

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
  const [generating, setGenerating] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = await addHistory(title);
      setSuccess(true);
      setTitle('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при добавлении истории');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) return;

    setGenerating(true);
    setError('');
    try {
      const data = await submitGPTHistory(title);
      setTitle(data.generatedHistory);
    } catch (err: any) {
      setError(err.message || 'Ошибка при генерации истории');
    } finally {
      setGenerating(false);
    }
  };

  const isAddDisabled = title.trim().length === 0 || loading;
  const isGenerateDisabled = title.trim().length === 0 || generating;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Добавить историю</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Введите текст истории..."
          value={title}
          onChangeText={text => {
            if (text.length <= 2000) {
              setTitle(text);
            } else {
              setTitle(text.slice(0, 2000));
            }
          }}
          multiline
          textAlignVertical="top"
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.generateIcon}
          onPress={handleGenerate}
          disabled={isGenerateDisabled}
        >
          {generating ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Ionicons
              name="flash-outline"
              size={28}
              color={isGenerateDisabled ? '#ccc' : '#000'}
            />
          )}
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: 'right', marginBottom: 8 }}>
        {title.length}/2000
      </Text>

      <TouchableOpacity
        style={[
          styles.addButton,
          isAddDisabled && { backgroundColor: '#a5d6a7' },
        ]}
        onPress={handleAdd}
        disabled={isAddDisabled}
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
  inputWrapper: {
    position: 'relative',
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
  generateIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 6,
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
