import { User } from '../types/userTypes';
import { History } from '../types/storiesTypes';
import { apiFetch } from './apiFetch';

export const getStoryById = async (
  id: string,
  user: User | null,
): Promise<History> => {
  // apiFetch сам выбросит ошибку при таймауте или 500
  const res = await apiFetch(`/history/${id}`, { method: 'GET' }, !!user);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
};
