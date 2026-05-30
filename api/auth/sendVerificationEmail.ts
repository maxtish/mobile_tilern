import { apiFetch } from '../apiFetch';

export async function sendVerificationEmail(): Promise<{
  success: boolean;
  alreadyVerified?: boolean;
}> {
  const res = await apiFetch(
    '/auth/send-verification-email',
    { method: 'POST' },
    true,
    10000,
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось отправить письмо');
  }

  return data;
}
