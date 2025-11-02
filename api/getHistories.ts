import { SERVER_URL } from '../constants/constants';
import { History } from '../types/storiesTypes';
import { User } from '../types/userTypes';

export async function getHistories(user: User | null): Promise<History[]> {
  try {
    const query = user ? `?userId=${user.id}` : '';
    const res = await fetch(`${SERVER_URL}/history${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || `Ошибка ${res.status}: ${res.statusText}`,
      );
    }

    const data = await res.json();
    return data as History[];
  } catch (err: any) {
    console.error('Ошибка при получении историй:', err);
    throw new Error(err.message || 'Не удалось получить истории');
  }
}
