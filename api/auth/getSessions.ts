import { apiFetch } from '../apiFetch';

export interface UserSession {
  id: string;
  device_info: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_used_at: string | null;
  expires_at: string;
}

export async function getSessions(): Promise<UserSession[]> {
  const res = await apiFetch('/auth/sessions', { method: 'GET' }, true, 7000);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Не удалось загрузить устройства');
  }

  return data.sessions || [];
}
