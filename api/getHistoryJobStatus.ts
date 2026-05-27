import { HistoryJob } from '../state/historyJobsStore';
import { apiFetch } from './apiFetch';

export async function getHistoryJobStatus(jobId: string): Promise<HistoryJob> {
  const res = await apiFetch(
    `/history/jobs/${jobId}`,
    { method: 'GET' },
    true,
    7000,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
}

export async function getMyHistoryJobs(): Promise<HistoryJob[]> {
  const res = await apiFetch('/history/jobs', { method: 'GET' }, true, 7000);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
}
