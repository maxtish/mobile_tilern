import { apiFetch } from '../apiFetch';

export async function logoutAllDevices(): Promise<void> {
  const res = await apiFetch(
    '/auth/logout-all',
    { method: 'POST' },
    true,
    7000,
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось выйти со всех устройств');
  }
}
