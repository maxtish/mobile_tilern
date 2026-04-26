import { getHistories } from '../../api/getHistories';
import { cacheStoryList, getCachedStoryList } from './storyListCache';

export const getStoriesRepository = async (user: any, page = 1, limit = 10) => {
  // 1. Для первой страницы сначала пытаемся достать данные из кэша
  if (page === 1) {
    try {
      const cached = await getCachedStoryList();

      // Если кэш есть, запускаем обновление в фоне и сразу возвращаем кэш
      if (cached && cached.length > 0) {
        refreshStoriesInBackground(user).catch(() => {});
        return cached;
      }
    } catch (e) {
      console.log('Ошибка при чтении кэша:', e);
    }
  }

  // 2. Если кэша нет (или это страница > 1), идем на сервер
  try {
    const fresh = await getHistories(user, page, limit);

    // Если это первая страница, обновляем кэш свежими данными
    if (page === 1 && fresh && fresh.length > 0) {
      await cacheStoryList(fresh);
    }

    return fresh;
  } catch (error: any) {
    // 3. ОБРАБОТКА ПАДЕНИЯ СЕРВЕРА
    console.log(`Ошибка при запросе страницы ${page}:`, error.message);

    // Если сервер лег (таймаут или 500) на первой странице,
    // пробуем ЕЩЕ РАЗ достать кэш (на случай, если мы пропустили шаг 1)
    if (page === 1) {
      const fallbackCache = await getCachedStoryList();
      return fallbackCache || []; // Если и кэша нет, возвращаем пусто
    }

    // Если сервер лег на странице 2+, просто возвращаем пустой список (пагинация прерывается)
    return [];
  }
};

/**
 * Фоновое обновление кэша первой страницы
 */
const refreshStoriesInBackground = async (user: any) => {
  try {
    // Здесь используется наш apiFetch с таймаутом 7с
    const fresh = await getHistories(user, 1, 10);
    if (fresh && fresh.length > 0) {
      await cacheStoryList(fresh);
    }
  } catch (err) {
    console.log('Фоновое обновление не удалось (сервер оффлайн)');
  }
};
