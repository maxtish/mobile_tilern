import { useUserStore } from '../state/userStore';
import { refreshToken } from './auth/refresh';
import { SERVER_URL } from '../constants/constants';

// По умолчанию ждем 7 секунд для обычных запросов
const DEFAULT_TIMEOUT = 7000;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false,
  customTimeout?: number, // Параметр для долгих запросов (например, создание истории)
) {
  const store = useUserStore.getState();
  const token = store.token;

  // Настройка таймаута
  const timeout = customTimeout || DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  if (requireAuth && !token) {
    clearTimeout(timeoutId);
    throw new Error('Пользователь не авторизован');
  }

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let incomingHeaders: Record<string, string> = {};
  if (options.headers instanceof Headers) {
    options.headers.forEach((value, key) => {
      incomingHeaders[key] = value;
    });
  } else if (options.headers) {
    incomingHeaders = options.headers as Record<string, string>;
  }

  const headers: Record<string, string> = {
    ...baseHeaders,
    ...incomingHeaders,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    let res = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal, // Подключаем контроллер таймаута
    });

    clearTimeout(timeoutId); // Запрос успел — отменяем таймер

    // 1. Если сервер вернул ошибку 500+ (сервер "упал")
    if (res.status >= 500) {
      throw new Error('SERVER_ERROR');
    }

    // 2. Обработка 401 и обновление токена
    if (res.status === 401 && store.refreshToken) {
      try {
        const newToken = await refreshToken();
        headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(`${SERVER_URL}${endpoint}`, { ...options, headers });
      } catch {
        store.logout();
        throw new Error('Сессия истекла');
      }
    }

    return res;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Если запрос был прерван по таймауту (AbortError)
    if (error.name === 'AbortError') {
      console.warn(`Запрос к ${endpoint} прерван по таймауту (${timeout}ms)`);
      throw new Error('OFFLINE_MODE');
    }

    // Если нет интернета или Network Error
    if (error.message === 'Network request failed') {
      throw new Error('OFFLINE_MODE');
    }

    throw error;
  }
}
