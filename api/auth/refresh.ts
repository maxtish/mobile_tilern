import { SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';

export async function refreshToken(): Promise<string> {
  const refresh = useUserStore.getState().refreshToken;
  if (!refresh) throw new Error('No refresh token stored');

  const res = await fetch(`${SERVER_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to refresh token');

  // обновляем токены в store
  useUserStore
    .getState()
    .setUser(
      useUserStore.getState().user!,
      data.accessToken,
      data.refreshToken,
    );

  return data.accessToken;
}
