import { apiFetch } from './apiFetch';

interface SubmitGPTHistoryResponse {
  generatedHistory: string;
}

export async function submitGPTHistory(
  story: string,
): Promise<SubmitGPTHistoryResponse> {
  const res = await apiFetch(
    '/history/generate',
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
