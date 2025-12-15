import { apiFetch } from './apiFetch';

export async function deleteHistory(historyId: string) {
  const res = await apiFetch(
    `/history/${historyId}`,
    { method: 'DELETE' },
    true,
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
  return data;
}
