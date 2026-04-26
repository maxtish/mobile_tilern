import { getUserWords } from '../../api/userWords';
import { UserWord } from '../../types/storiesTypes';
import { cacheUserWords, getCachedUserWords } from './userWordsCache'; // Проверь импорт!
import { getSyncQueue } from '../../utils/syncQueue';
import NetInfo from '@react-native-community/netinfo';

export const getUserWordsRepository = async (
  userId: string,
): Promise<UserWord[]> => {
  // 1. Получаем слова из очереди (офлайн добавленные)
  const queue = await getSyncQueue();
  const offlineWords: UserWord[] = queue
    .filter(item => item.userId === userId)
    .map(item => ({
      id: item.id,
      userId: item.userId,
      word: item.word,
      createdAt: new Date().toISOString(),
    }));

  // 2. Получаем основной кэш слов
  // ВНИМАНИЕ: убедись, что вызываешь getCachedUserWords, а не getCachedStoryList
  const cached = await getCachedUserWords(userId);

  // ОШИБКА БЫЛА ТУТ: TypeScript теперь видит поля .data и .version
  let baseWords: UserWord[] = cached?.data ?? [];

  // 3. Пробуем обновить данные с сервера
  const net = await NetInfo.fetch();
  if (net.isConnected) {
    try {
      const serverWords: UserWord[] = await getUserWords(userId);

      // Вычисляем версию для сравнения
      const serverVersion = serverWords.length
        ? Math.max(
            ...serverWords.map((w: UserWord) =>
              new Date(w.createdAt).getTime(),
            ),
          )
        : Date.now();

      // Обновляем кэш, если данные изменились
      if (!cached || serverVersion !== cached.version) {
        await cacheUserWords(userId, serverWords, serverVersion);
      }

      baseWords = serverWords;
    } catch (error) {
      console.log('Server down, using cache + queue');
    }
  }

  // 4. Склеиваем и убираем дубликаты
  const combined = [...offlineWords, ...baseWords];
  const uniqueMap = new Map<string, UserWord>();

  combined.forEach(item => {
    const key = item.word.word.toLowerCase().trim();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values());
};
