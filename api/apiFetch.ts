import { useUserStore } from '../state/userStore';
import { refreshToken } from './auth/refresh';
import { SERVER_URL } from '../constants/constants';

const DEFAULT_TIMEOUT = 7000;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false,
  customTimeout?: number,
) {
  const store = useUserStore.getState();
  const token = store.token;

  /**
   * Если запрос требует авторизацию,
   * но access token отсутствует — это не offline,
   * это значит пользователь не авторизован.
   */
  if (requireAuth && !token) {
    throw new Error('NO_AUTH');
  }

  /**
   * Внутренняя функция одного HTTP-запроса.
   * Она ничего не знает про refresh token.
   * Ее задача — просто сделать fetch и правильно классифицировать сетевые ошибки.
   */
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
      const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      return res;
    } catch (e: any) {
      /**
       * AbortError — это не обязательно "нет интернета".
       * Чаще это значит:
       * интернет может быть, но сервер не ответил за timeout.
       */
      if (e.name === 'AbortError') {
        throw new Error('REQUEST_TIMEOUT');
      }

      /**
       * В React Native при полном отсутствии сети
       * fetch часто падает с Network request failed.
       */
      if (e.message === 'Network request failed') {
        throw new Error('OFFLINE_MODE');
      }

      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  /**
   * 1. Первый запрос с текущим access token
   */
  let res = await makeRequest(token || undefined);

  /**
   * 2. Сервер жив, но ответил ошибкой 500+
   * Это не logout.
   */
  if (res.status >= 500) {
    throw new Error('SERVER_ERROR');
  }

  /**
   * 3. Access token устарел.
   * Пробуем обновить через refresh token.
   */
  if (res.status === 401 && store.refreshToken) {
    try {
      const newToken = await refreshToken();

      /**
       * Повторяем оригинальный запрос уже с новым access token.
       */
      res = await makeRequest(newToken);

      if (res.status >= 500) {
        throw new Error('SERVER_ERROR');
      }

      return res;
    } catch (e: any) {
      /**
       * Эти ошибки НЕ означают, что refresh token умер.
       * Поэтому logout делать нельзя.
       */
      if (
        e.message === 'OFFLINE_MODE' ||
        e.message === 'REQUEST_TIMEOUT' ||
        e.message === 'SERVER_ERROR'
      ) {
        throw e;
      }

      /**
       * Только если refreshToken() явно сказал,
       * что сессия истекла — чистим auth.
       */
      if (e.message === 'SESSION_EXPIRED') {
        store.logout();
        throw e;
      }

      /**
       * Остальные ошибки refresh считаем проблемой сессии.
       */
      store.logout();
      throw new Error('SESSION_EXPIRED');
    }
  }

  /**
   * 4. Если 401, но refresh token нет —
   * пользователь не может восстановить сессию.
   */
  if (res.status === 401 && !store.refreshToken) {
    store.logout();
    throw new Error('SESSION_EXPIRED');
  }

  return res;
}
