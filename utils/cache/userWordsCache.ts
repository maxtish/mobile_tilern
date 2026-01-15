import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserWord } from '../../types/storiesTypes';

const PREFIX = 'userWords:';
const TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней

interface CachedUserWords {
  data: UserWord[];
  version: number;
  cachedAt: number;
}

const getKey = (userId: string) => `${PREFIX}${userId}`;

export const cacheUserWords = async (
  userId: string,
  words: UserWord[],
  version = Date.now(),
) => {
  const payload: CachedUserWords = {
    data: words,
    version,
    cachedAt: Date.now(),
  };
  await AsyncStorage.setItem(getKey(userId), JSON.stringify(payload));
};

export const getCachedUserWords = async (
  userId: string,
): Promise<CachedUserWords | null> => {
  const raw = await AsyncStorage.getItem(getKey(userId));
  if (!raw) return null;

  try {
    const parsed: CachedUserWords = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > TTL) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const updateCacheAfterAdd = async (
  userId: string,
  newWord: UserWord,
) => {
  const cached = await getCachedUserWords(userId);
  const words = cached?.data ?? [];
  await cacheUserWords(userId, [newWord, ...words]);
};

export const updateCacheAfterDelete = async (
  userId: string,
  wordId: string,
) => {
  const cached = await getCachedUserWords(userId);
  if (!cached) return;
  await cacheUserWords(
    userId,
    cached.data.filter(w => w.id !== wordId),
    cached.version,
  );
};
