import { SERVER_URL } from '../../constants/constants';
import { useUserStore } from '../../state/userStore';
import { getRefreshToken, saveTokens } from '../../utils/tokenStorage';

const REFRESH_TIMEOUT = 7000;

type RefreshErrorCode =
  | 'NO_REFRESH_TOKEN'
  | 'NO_USER'
  | 'OFFLINE_MODE'
  | 'REQUEST_TIMEOUT'
  | 'SERVER_ERROR'
  | 'SESSION_EXPIRED'
  | 'REFRESH_FAILED';

export async function refreshToken(): Promise<string> {
  const refresh = await getRefreshToken();
  const user = useUserStore.getState().user;

  if (!refresh) {
    throw new Error('NO_REFRESH_TOKEN' satisfies RefreshErrorCode);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT);

  try {
    const res = await fetch(`${SERVER_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      useUserStore.getState().setSessionStatus('expired');
      throw new Error('SESSION_EXPIRED' satisfies RefreshErrorCode);
    }

    if (res.status >= 500) {
      useUserStore.getState().setSessionStatus('needs_refresh');
      throw new Error('SERVER_ERROR' satisfies RefreshErrorCode);
    }

    if (!res.ok) {
      throw new Error(
        (data.error || 'REFRESH_FAILED') satisfies RefreshErrorCode,
      );
    }

    if (!user) {
      throw new Error('NO_USER' satisfies RefreshErrorCode);
    }

    await saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    useUserStore.getState().setSessionStatus('valid');

    return data.accessToken;
  } catch (e: any) {
    if (e.name === 'AbortError') {
      useUserStore.getState().setSessionStatus('needs_refresh');
      throw new Error('REQUEST_TIMEOUT' satisfies RefreshErrorCode);
    }

    if (e.message === 'Network request failed') {
      useUserStore.getState().setSessionStatus('needs_refresh');
      throw new Error('OFFLINE_MODE' satisfies RefreshErrorCode);
    }

    if (
      e.message === 'SESSION_EXPIRED' ||
      e.message === 'SERVER_ERROR' ||
      e.message === 'REQUEST_TIMEOUT' ||
      e.message === 'OFFLINE_MODE'
    ) {
      throw e;
    }

    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}
