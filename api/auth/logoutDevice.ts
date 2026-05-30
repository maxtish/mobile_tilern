import { apiFetch } from '../apiFetch';

export async function logoutDevice(sessionId: string): Promise<void> {
  const res = await apiFetch(
    `/auth/logout-device/${sessionId}`,
    { method: 'POST' },
    true,
    7000,
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось удалить устройство');
  }
}
