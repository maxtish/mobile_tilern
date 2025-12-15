import { apiFetch } from './apiFetch';

export const likeHistory = async (historyId: string, userId: string) => {
  const res = await apiFetch(
    `/history/like/${historyId}`,
    {
      method: 'POST',
      body: JSON.stringify({ userId }),
    },
    true,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
};

export const unlikeHistory = async (historyId: string, userId: string) => {
  const res = await apiFetch(
    `/history/unlike/${historyId}`,
    {
      method: 'POST',
      body: JSON.stringify({ userId }),
    },
    true,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
};
