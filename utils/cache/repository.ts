import { getHistories } from '../../api/getHistories';
import { cacheStoryList, getCachedStoryList } from './storyListCache';

export const getStoriesRepository = async (user: any, page = 1, limit = 10) => {
  if (page === 1) {
    const cached = await getCachedStoryList();
    if (cached) {
      refreshStoriesInBackground(user);
      return cached;
    }
  }

  const fresh = await getHistories(user, page, limit);
  if (page === 1) cacheStoryList(fresh);
  return fresh;
};

const refreshStoriesInBackground = async (user: any) => {
  try {
    const fresh = await getHistories(user, 1, 10);
    await cacheStoryList(fresh);
  } catch {}
};
