import { SERVER_URL } from '../../constants/constants';

export async function forgotPassword(email: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const res = await fetch(`${SERVER_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось отправить письмо');
  }

  return data;
}
