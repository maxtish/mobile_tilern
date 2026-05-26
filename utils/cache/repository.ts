import { getHistories } from '../../api/getHistories';
import { cacheStoryList, getCachedStoryList } from './storyListCache';

/**
 * Репозиторий историй
 *
 * Главная задача:
 * - сначала показать кэш (offline-first)
 * - потом тихо обновить данные с сервера
 * - не ломать приложение при отсутствии интернета
 * - НЕ делать logout при offline/server error
 */
export const getStoriesRepository = async (
  user: any,
  page = 1,
  limit = 10,
  isOnline: boolean,
) => {
  if (page === 1) {
    const cached = await getCachedStoryList();

    if (!isOnline) {
      return cached || [];
    }

    if (cached && cached.length > 0) {
      refreshStoriesInBackground(user).catch(() => {});
      return cached;
    }
  }

  if (!isOnline) {
    return [];
  }

  try {
    const fresh = await getHistories(user, page, limit);

    if (page === 1 && fresh.length > 0) {
      await cacheStoryList(fresh);
    }

    return fresh;
  } catch (error: any) {
    if (
      error.message === 'OFFLINE_MODE' ||
      error.message === 'REQUEST_TIMEOUT' ||
      error.message === 'SERVER_ERROR'
    ) {
      if (page === 1) {
        return (await getCachedStoryList()) || [];
      }

      return [];
    }

    if (error.message === 'SESSION_EXPIRED') {
      throw error;
    }

    throw error;
  }
};

/**
 * =========================================================
 * Фоновое обновление первой страницы
 * =========================================================
 *
 * Пользователь уже видит кэш,
 * а мы тихо обновляем свежие данные.
 */
const refreshStoriesInBackground = async (user: any) => {
  try {
    const fresh = await getHistories(user, 1, 10);

    /**
     * Обновляем кэш только если пришли реальные данные
     */
    if (fresh && fresh.length > 0) {
      await cacheStoryList(fresh);
    }
  } catch (err: any) {
    /**
     * В фоне ошибки не критичны.
     * Просто логируем.
     */
    console.log('Background refresh failed:', err.message);
  }
};
