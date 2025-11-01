import { SERVER_URL } from '../constants/constants';
import { History } from '../types/storiesTypes';

export async function getHistories(): Promise<History[]> {
  try {
    const res = await fetch(`${SERVER_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Ошибка ${res.status}: ${res.statusText}`);
    }

    return data as History[];
  } catch (err: any) {
    throw new Error(err.message || 'Не удалось получить истории');
  }
}
