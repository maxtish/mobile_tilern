import { History } from '../types/storiesTypes';
import { User } from '../types/userTypes';
import { apiFetch } from './apiFetch';

export async function getHistories(
  user: User | null,
  page = 1,
  limit = 10,
): Promise<History[]> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (user) params.append('userId', user.id);

  const res = await apiFetch(
    `/history?${params.toString()}`,
    { method: 'GET' },
    !!user,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Ошибка ${res.status}`);
  }

  return (await res.json()) as History[];
}
