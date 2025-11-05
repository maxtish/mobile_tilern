// api/userWords.ts
import { SERVER_URL } from '../constants/constants';
import { Word } from '../types/storiesTypes';
import { apiFetch } from './apiFetch';

export const saveUserWord = async (
  userId: string,
  historyId: string | null,
  word: Word,
) => {
  try {
    /* // Сериализуем только необходимые поля Word
    const wordPayload: any = {
      type: word.type,
      word: word,
      translation: word.translation,
    };
*/
    const res = await fetch(`${SERVER_URL}/user/word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, historyId, word: word }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `Ошибка ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error('Ошибка сохранения слова в userWords.ts апп:', e);
    return null;
  }
};

export const getUserWords = async (userId: string) => {
  try {
    const res = await fetch(`${SERVER_URL}/user/words/${userId}`);
    if (!res.ok) throw new Error(`Ошибка ${res.status}`);
    const data = await res.json();
    // возвращаем только массив слов
    return Array.isArray(data.words) ? data.words : [];
  } catch (e) {
    console.error('Ошибка получения слов:', e);
    return [];
  }
};

// Удаляем слово по ID

export const deleteUserWord = async (id: string): Promise<boolean> => {
  try {
    const res = await apiFetch(`/user-words/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('🚨 Ошибка при удалении слова:', err);
    return false;
  }
};
