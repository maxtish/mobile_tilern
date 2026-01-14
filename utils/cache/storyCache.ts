import AsyncStorage from '@react-native-async-storage/async-storage';
import { History } from '../../types/storiesTypes';

const STORY_PREFIX = 'story:';
const STORY_TTL = 1000 * 60 * 60 * 24 * 7; // 7 дней

interface CachedStory {
  story: History;
  cachedAt: number;
}

export const cacheStory = async (story: History) => {
  const payload: CachedStory = {
    story,
    cachedAt: Date.now(),
  };

  await AsyncStorage.setItem(
    `${STORY_PREFIX}${story.id}`,
    JSON.stringify(payload),
  );
};

export const getCachedStory = async (
  storyId: string,
): Promise<History | null> => {
  const raw = await AsyncStorage.getItem(`${STORY_PREFIX}${storyId}`);
  if (!raw) return null;

  try {
    const parsed: CachedStory = JSON.parse(raw);

    if (Date.now() - parsed.cachedAt > STORY_TTL) {
      await AsyncStorage.removeItem(`${STORY_PREFIX}${storyId}`);
      return null;
    }

    return parsed.story;
  } catch {
    await AsyncStorage.removeItem(`${STORY_PREFIX}${storyId}`);
    return null;
  }
};
