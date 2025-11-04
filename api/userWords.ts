// api/userWords.ts
import { SERVER_URL } from '../constants/constants';
import { Word } from '../types/storiesTypes';

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
