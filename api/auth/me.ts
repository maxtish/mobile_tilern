import { apiFetch } from '../apiFetch';
import { mapServerUserToClient, User } from '../../types/userTypes';

export async function getMe(): Promise<User> {
  const res = await apiFetch('/auth/me', { method: 'GET' }, true, 7000);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось обновить профиль');
  }

  return mapServerUserToClient(data.user);
}
