import { SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';

export async function refreshToken(): Promise<string> {
  const refresh = useUserStore.getState().refreshToken;
  const user = useUserStore.getState().user;

  if (!refresh) throw new Error('NO_REFRESH_TOKEN');

  try {
    const res = await fetch(`${SERVER_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error('SESSION_EXPIRED');
    }

    if (res.status >= 500) {
      throw new Error('SERVER_ERROR');
    }

    if (!res.ok) {
      throw new Error(data.error || 'REFRESH_FAILED');
    }

    if (!user) {
      throw new Error('NO_USER');
    }

    useUserStore.getState().setUser(user, data.accessToken, data.refreshToken);

    return data.accessToken;
  } catch (e: any) {
    if (e.message === 'SESSION_EXPIRED') {
      throw e;
    }

    if (e.message === 'SERVER_ERROR') {
      throw e;
    }

    if (e.message === 'Network request failed') {
      throw new Error('OFFLINE_MODE');
    }

    throw e;
  }
}
