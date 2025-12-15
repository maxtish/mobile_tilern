import { apiFetch } from './apiFetch';

interface AddHistoryResponse {
  generatedStory: string;
}

export async function addHistory(story: string): Promise<AddHistoryResponse> {
  const res = await apiFetch(
    '/history',
    {
      method: 'POST',
      body: JSON.stringify({ story }),
    },
    true, // требует авторизации
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  return res.json();
}
