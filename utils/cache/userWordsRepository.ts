import { getUserWords } from '../../api/userWords';
import { UserWord } from '../../types/storiesTypes';
import { cacheUserWords, getCachedUserWords } from './userWordsCache';
import NetInfo from '@react-native-community/netinfo';

export const getUserWordsRepository = async (userId: string) => {
  // 1. Отдаем кэш сразу
  const cached = await getCachedUserWords(userId);

  // 2. Проверяем онлайн
  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    return cached?.data ?? [];
  }

  try {
    const serverWords: UserWord[] = await getUserWords(userId);

    // простая версия актуальности
    const serverVersion = serverWords.length
      ? Math.max(
          ...serverWords.map((w: UserWord) => new Date(w.createdAt).getTime()),
        )
      : Date.now();

    if (!cached || serverVersion !== cached.version) {
      await cacheUserWords(userId, serverWords, serverVersion);
    }

    return serverWords;
  } catch {
    return cached?.data ?? [];
  }
};
