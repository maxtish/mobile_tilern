import { useUserStore } from '../state/userStore';
import { refreshToken } from './auth/refresh';
import { SERVER_URL } from '../constants/constants';

const DEFAULT_TIMEOUT = 7000;

type ApiErrorCode =
  | 'NO_AUTH'
  | 'OFFLINE_MODE'
  | 'REQUEST_TIMEOUT'
  | 'SERVER_ERROR'
  | 'SESSION_EXPIRED';

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false,
  customTimeout?: number,
) {
  const token = useUserStore.getState().token;
  const refresh = useUserStore.getState().refreshToken;

  if (requireAuth && !token) {
    throw new Error('NO_AUTH' satisfies ApiErrorCode);
  }

  const makeRequest = async (authToken?: string) => {
    const timeout = customTimeout || DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const incomingHeaders =
      options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : (options.headers as Record<string, string>) || {};

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...incomingHeaders,
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    try {
      return await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name === 'AbortError') {
        throw new Error('REQUEST_TIMEOUT' satisfies ApiErrorCode);
      }

      if (e.message === 'Network request failed') {
        throw new Error('OFFLINE_MODE' satisfies ApiErrorCode);
      }

      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  let res = await makeRequest(token || undefined);

  if (res.status >= 500) {
    throw new Error('SERVER_ERROR' satisfies ApiErrorCode);
  }

  if (res.status === 401 && refresh) {
    try {
      const newToken = await refreshToken();

      useUserStore.getState().setSessionStatus('valid');

      res = await makeRequest(newToken);

      if (res.status >= 500) {
        throw new Error('SERVER_ERROR' satisfies ApiErrorCode);
      }

      if (res.status === 401) {
        useUserStore.getState().logout();
        throw new Error('SESSION_EXPIRED' satisfies ApiErrorCode);
      }

      return res;
    } catch (e: any) {
      if (
        e.message === 'OFFLINE_MODE' ||
        e.message === 'REQUEST_TIMEOUT' ||
        e.message === 'SERVER_ERROR'
      ) {
        useUserStore.getState().setSessionStatus('needs_refresh');
        throw e;
      }

      useUserStore.getState().logout();
      throw new Error('SESSION_EXPIRED' satisfies ApiErrorCode);
    }
  }

  if (res.status === 401 && !refresh) {
    useUserStore.getState().logout();
    throw new Error('SESSION_EXPIRED' satisfies ApiErrorCode);
  }

  return res;
}

/*
401 → пробуем refresh

refresh OK
→ sessionStatus = valid
→ повторяем запрос

refresh упал из-за offline / timeout / server error
→ НЕ logout
→ sessionStatus = needs_refresh
→ показываем кэш

refresh вернул 401/403
→ logout
→ sessionStatus = expired
*/
