import { apiFetch } from '../apiFetch';
import { User, mapServerUserToClient } from '../../types/userTypes';

export async function changeEmail(email: string): Promise<User> {
  const res = await apiFetch(
    '/auth/change-email',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
    true,
    7000,
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось изменить email');
  }

  return mapServerUserToClient(data.user);
}
