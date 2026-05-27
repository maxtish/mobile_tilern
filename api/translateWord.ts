import { apiFetch } from './apiFetch';

export type TranslateWordDirection = 'de-ru' | 'ru-de';

export type TranslateWordOption = {
  word: string;
  translation: string;
  note?: string;
};

export async function translateWord(
  text: string,
  direction: TranslateWordDirection,
): Promise<TranslateWordOption[]> {
  const res = await apiFetch(
    '/words/translate',
    {
      method: 'POST',
      body: JSON.stringify({
        text,
        direction,
      }),
    },
    true,
    30000,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка ${res.status}`);
  }

  const data = await res.json();

  return data.options || [];
}
