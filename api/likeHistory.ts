// api/likeHistory.ts
import { SERVER_URL } from '../constants/constants';

export const likeHistory = async (historyId: string, userId: string) => {
  try {
    const res = await fetch(`${SERVER_URL}/history/like/${historyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `Ошибка ${res.status}`);
    }

    return res.json(); // сразу возвращаем JSON
  } catch (e) {
    console.error('Ошибка лайка:', e);
    return null;
  }
};

export const unlikeHistory = async (historyId: string, userId: string) => {
  try {
    const res = await fetch(`${SERVER_URL}/history/unlike/${historyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `Ошибка ${res.status}`);
    }

    return res.json();
  } catch (e) {
    console.error('Ошибка снятия лайка:', e);
    return null;
  }
};
