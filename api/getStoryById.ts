import { SERVER_URL } from '../constants/constants';
import { History } from '../types/storiesTypes';
import { apiFetch } from './apiFetch';

export const getStoryById = async (id: string): Promise<History> => {
  const res = await apiFetch(`/history/${id}`, { method: 'GET' }, false);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
};
