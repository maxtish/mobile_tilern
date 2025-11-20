import { useUserStore } from '../state/userStore';
import { Alert } from 'react-native';
import { saveUserWord } from '../api/userWords';
import { History, Word } from '../types/storiesTypes';
import Toast from 'react-native-root-toast';

export const useAddWord = (story: History) => {
  const user = useUserStore(state => state.user);

  const addWord = async (wordText: string) => {
    if (!user) {
      Toast.show('Войдите, чтобы сохранять слова', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
      });
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
      Toast.show('Слово не найдено в списке слов истории', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
      });
      return;
    }

    try {
      const response = await saveUserWord(user.id, story.id, foundWord);

      if (response?.success) {
        Toast.show('✅ Слово добавлено!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
        });
      } else if (response?.message === 'Слово уже сохранено') {
        Toast.show('ℹ️ Это слово уже в вашем списке', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
        });
      } else {
        console.log('Ошибка API:', response);
        Toast.show('Ошибка при сохранении слова', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
        });
      }
    } catch (error) {
      console.error('Ошибка при вызове saveUserWord:', error);
      Toast.show('Ошибка при сохранении слова', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
      });
    }
  };

  return { addWord };
};
