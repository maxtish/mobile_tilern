import { HistoryJob } from '../state/historyJobsStore';
import { apiFetch } from './apiFetch';

export async function addHistory(story: string): Promise<HistoryJob> {
  const res = await apiFetch(
    '/history',
    {
      method: 'POST',
      body: JSON.stringify({ story }),
    },
    true,
    15000,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
}
