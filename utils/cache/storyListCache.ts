import AsyncStorage from '@react-native-async-storage/async-storage';
import { History } from '../../types/storiesTypes';

const LIST_KEY = 'stories:list';
const TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней

export const cacheStoryList = async (stories: History[]) => {
  await AsyncStorage.setItem(
    LIST_KEY,
    JSON.stringify({
      data: stories,
      cachedAt: Date.now(),
    }),
  );
};

export const getCachedStoryList = async (): Promise<History[] | null> => {
  const raw = await AsyncStorage.getItem(LIST_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

// -----------------------------
// Получаем историю по id из кэша списка
// -----------------------------
export const getCachedStoryById = async (
  storyId: string | number,
): Promise<History | null> => {
  const stories = await getCachedStoryList();
  if (!stories) return null;

  const story = stories.find(s => String(s.id) === String(storyId));
  return story || null;
};
