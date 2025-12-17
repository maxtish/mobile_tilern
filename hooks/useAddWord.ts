import { useUserStore } from '../state/userStore';
import { saveUserWord } from '../api/userWords';
import { History, Word } from '../types/storiesTypes';
import Toast from 'react-native-toast-message';

export const useAddWord = (story: History, indexW: number | null) => {
  const user = useUserStore(state => state.user);

  const showToast = (type: 'success' | 'info' | 'error', text: string) => {
    Toast.show({
      type,
      text1: text,
      position: 'top',
      topOffset: 0,
      visibilityTime: 3000,
    });
  };

  const addWord = async (wordText: string) => {
    if (!user) {
      showToast('info', 'Войдите, чтобы сохранять слова');
      return;
    }

    let foundWord: Word | undefined;

    if (indexW !== null && story.words.length === story.tokenTiming.length) {
      foundWord = story.words[indexW];
    }

    if (!foundWord) {
      showToast('error', 'Слово не найдено в истории');
      return;
    }

    try {
      const response = await saveUserWord(user.id, story.id, foundWord);

      if (response?.success) {
        showToast('success', '✅ Слово добавлено!');
      } else if (response?.message === 'Слово уже сохранено') {
        showToast('info', 'ℹ️ Это слово уже в вашем списке');
      } else {
        showToast('error', 'Ошибка при сохранении слова');
      }
    } catch (error) {
      showToast('error', 'Ошибка при сохранении слова');
    }
  };

  return { addWord };
};
