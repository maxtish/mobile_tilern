import { useUserStore } from '../state/userStore';
import { saveUserWord } from '../api/userWords';
import { History, Word, UserWord } from '../types/storiesTypes';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { updateCacheAfterAdd } from '../utils/cache/userWordsCache';
import { addToSyncQueue } from '../utils/syncQueue';

export const useAddWord = () => {
  const user = useUserStore(state => state.user);

  const showToast = (type: 'success' | 'info' | 'error', text: string) => {
    Toast.show({
      type,
      text1: text,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  const addWord = async (
    manualWord?: Word,
    story: History | null = null,
    indexW: number | null = null,
  ) => {
    if (!user) {
      showToast('info', 'Войдите, чтобы сохранять слова');
      return;
    }

    let wordToSave: Word | undefined;
    let storyId: string | null = null;

    if (manualWord) {
      wordToSave = manualWord;
    } else if (story && indexW !== null) {
      wordToSave = story.words[indexW];
      storyId = story.id;
    }

    if (!wordToSave) return;

    // 1. Создаем оптимистичный объект (для мгновенного UI)
    const optimisticWord: UserWord = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      userId: user.id,
      historyId: storyId,
      word: wordToSave,
      createdAt: new Date().toISOString(),
    };

    // 2. Мгновенно обновляем локальный кэш
    await updateCacheAfterAdd(user.id, optimisticWord);

    try {
      // 3. Пробуем отправить на сервер
      // Если интернет есть, но сервер лежит или тормозит ( > 7 сек),
      // apiFetch выбросит ошибку 'OFFLINE_MODE' или 'SERVER_ERROR'
      const response = await saveUserWord(user.id, storyId, wordToSave);

      if (response?.success) {
        showToast('success', '✅ Сохранено в облако');
      } else if (response?.message === 'Слово уже сохранено') {
        showToast('info', 'Это слово уже есть в списке');
      }

      return optimisticWord;
    } catch (error: any) {
      // 4. ОБРАБОТКА ОФЛАЙН ПЕРЕХОДА
      // Если это сетевая ошибка, таймаут или 500-ка на сервере
      const isOfflineStatus =
        error.message === 'OFFLINE_MODE' ||
        error.message === 'SERVER_ERROR' ||
        error.message === 'Network request failed';

      if (isOfflineStatus) {
        await addToSyncQueue(user.id, wordToSave);
        showToast('info', 'Сохранено локально (синхронизация позже) 📡');
      } else {
        // Другие ошибки (например, проблемы с авторизацией)
        showToast('error', error.message || 'Ошибка сохранения');
      }

      return optimisticWord; // Всё равно возвращаем, так как локально сохранили
    }
  };

  return { addWord };
};
