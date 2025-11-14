import { useUserStore } from '../state/userStore';
import { Alert } from 'react-native';
import { saveUserWord } from '../api/userWords';
import { History, Word } from '../types/storiesTypes';

export const useAddWord = (story: History) => {
  const user = useUserStore(state => state.user);

  const addWord = async (wordText: string) => {
    if (!user) {
      Alert.alert('Войдите, чтобы сохранять слова');
      return;
    }

    const cleanedWordText = wordText.toLowerCase().trim();

    const foundWord: Word | undefined = story.words.find(w => {
      if (!w.word) return false;
      if (typeof w.word === 'string') {
        const normalized = w.word
          .toLowerCase()
          .replace(/^(der|die|das|ein|eine)\s+/, '');
        return cleanedWordText === normalized;
      }
      return false;
    });

    if (!foundWord) {
      Alert.alert('Слово не найдено в списке слов истории');
      return;
    }

    try {
      const response = await saveUserWord(user.id, story.id, foundWord);

      if (response?.success) {
        Alert.alert('✅ Слово добавлено!');
      } else if (response?.message === 'Слово уже сохранено') {
        Alert.alert('ℹ️ Это слово уже в вашем списке');
      } else {
        console.log('Ошибка API:', response);
        Alert.alert('Ошибка при сохранении слова');
      }
    } catch (error) {
      console.error('Ошибка при вызове saveUserWord:', error);
      Alert.alert('Ошибка при сохранении слова');
    }
  };

  return { addWord };
};
