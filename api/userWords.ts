import { Word } from '../types/storiesTypes';
import { apiFetch } from './apiFetch';

export const saveUserWord = async (
  userId: string,
  historyId: string | null,
  word: Word,
) => {
  const res = await apiFetch(
    '/user/word',
    {
      method: 'POST',
      body: JSON.stringify({ userId, historyId, word }),
    },
    true,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
};

export const getUserWords = async (userId: string) => {
  const res = await apiFetch(`/user/words/${userId}`, { method: 'GET' }, true);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.words) ? data.words : [];
};

export const deleteUserWord = async (id: string) => {
  const res = await apiFetch(`/user-words/${id}`, { method: 'DELETE' }, true);
  const data = await res.json();
  return data.success === true;
};
