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
  Keyboard,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// API
import { addHistory } from '../../api/addHistory';
import { submitGPTHistory } from '../../api/submitGPTHistory';
import { useAppTheme } from '../../theme/ThemeProvider';

type AddStoryScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'AddStory'
>;
const { height } = Dimensions.get('window');

export default function AddStoryScreen() {
  const navigation = useNavigation<AddStoryScreenNavigationProp>();
  const { appTheme } = useAppTheme();

  const [title, setTitle] = useState(''); // Это наш основной текст истории
  const [loading, setLoading] = useState(false); // Лоадер для финальной отправки
  const [generating, setGenerating] = useState(false); // Лоадер для GPT

  // ===== 1. Генерация текста (GPT) в инпут =====
  const handleGenerate = async () => {
    if (!title.trim()) return;

    setGenerating(true);
    Keyboard.dismiss();

    try {
      // Ждем только текст от GPT
      const data = await submitGPTHistory(title);
      // Вставляем полученный текст в инпут для редактирования
      setTitle(data.generatedHistory);

      Toast.show({
        type: 'success',
        text1: 'Текст сгенерирован ✨',
        text2: 'Теперь вы можете его отредактировать',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка генерации',
        text2: err.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  // ===== 2. Отправка готового текста на создание (Фон) =====
  const handleAdd = async () => {
    if (!title.trim()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      // Отправляем текст и НЕ используем await для ожидания результата,
      // либо сервер должен просто вернуть "OK", а остальное делать в фоне.
      addHistory(title).catch(err => {
        console.error('Background process failed:', err);
      });

      // Мгновенно уведомляем пользователя
      Toast.show({
        type: 'info',
        text1: 'История отправлена в обработку 🚀',
        text2: 'Она появится в списке через несколько минут',
        visibilityTime: 5000,
      });

      // Сразу уходим с экрана
      navigation.goBack();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Ошибка при отправке' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: appTheme.colors.text }]}>
        Создание истории
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Напишите тему или вставьте свой текст..."
          placeholderTextColor="#888"
          value={title}
          onChangeText={text => setTitle(text.slice(0, 4000))}
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            {
              color: appTheme.colors.text,
              borderColor: appTheme.colors.border,
              backgroundColor: appTheme.colors.card,
            },
          ]}
        />

        {/* Кнопка GPT - вписывает текст в инпут */}
        <TouchableOpacity
          style={[
            styles.generateIcon,
            { backgroundColor: appTheme.colors.primary },
          ]}
          onPress={handleGenerate}
          disabled={generating || !title.trim()}
        >
          {generating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="flash" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={{
          textAlign: 'right',
          marginBottom: 15,
          color: '#888',
          fontSize: 12,
        }}
      >
        {title.length} знаков
      </Text>

      {/* Кнопка финальной отправки - не ждем завершения */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: title.trim().length > 10 ? '#28a745' : '#555' },
        ]}
        onPress={handleAdd}
        disabled={loading || title.trim().length < 10}
      >
        <Text style={styles.addButtonText}>Запустить создание истории</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Отмена</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, minHeight: height },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    paddingTop: 15,
    height: height / 2.2,
    fontSize: 16,
    lineHeight: 22,
  },
  generateIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  backButton: { padding: 16, borderRadius: 16, alignItems: 'center' },
  backButtonText: { color: '#888', fontSize: 16 },
});
