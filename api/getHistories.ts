import { History } from '../types/storiesTypes';
import { User } from '../types/userTypes';
import { apiFetch } from './apiFetch';

export async function getHistories(user: User | null): Promise<History[]> {
  const query = user ? `?userId=${user.id}` : '';
  const res = await apiFetch(`/history${query}`, { method: 'GET' }, !!user);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Ошибка ${res.status}`);
  }

  const data = await res.json();
  return data as History[];
}
