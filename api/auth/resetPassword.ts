import { SERVER_URL } from '../../constants/constants';

export async function resetPassword(params: {
  token: string;
  newPassword: string;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${SERVER_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: params.token,
      newPassword: params.newPassword,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось изменить пароль');
  }

  return data;
}
