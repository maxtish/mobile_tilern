import { UserWord, Word } from '../types/storiesTypes';
import {
  updateCacheAfterAdd,
  updateCacheAfterDelete,
} from '../utils/cache/userWordsCache';
import { apiFetch } from './apiFetch';

export const saveUserWord = async (
  userId: string,
  historyId: string | null,
  word: Word,
) => {
  // apiFetch сам выбросит ошибку, если будет таймаут или 500
  const res = await apiFetch(
    '/user/word',
    {
      method: 'POST',
      body: JSON.stringify({ userId, historyId, word }),
    },
    true,
  );

  // Обработка обычных ошибок API (400, 404 и т.д.)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Если слово уже сохранено, не считаем это ошибкой для офлайна
    if (data.message === 'Слово уже сохранено') {
      return { success: false, message: 'Слово уже сохранено' };
    }
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  const saved = await res.json();
  // Обновляем кэш только если запрос реально дошел до сервера
  await updateCacheAfterAdd(userId, saved);

  return { success: true, data: saved };
};

export const getUserWords = async (userId: string): Promise<UserWord[]> => {
  const res = await apiFetch(`/user/words/${userId}`, { method: 'GET' }, true);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.words) ? data.words : [];
};

export const deleteUserWord = async (userId: string, id: string) => {
  const res = await apiFetch(`/user-words/${id}`, { method: 'DELETE' }, true);
  const data = await res.json();
  if (data.success) {
    await updateCacheAfterDelete(userId, id);
  }

  return data.success === true;
};
