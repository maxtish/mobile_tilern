import { useUserStore } from '../state/userStore';
import { refreshToken } from './auth/refresh';
import { SERVER_URL } from '../constants/constants';

export async function apiFetch(
  endpoint: string, // путь к API, например "/history"
  options: RequestInit = {}, // дополнительные параметры fetch: method, body, headers и т.д.
  requireAuth = false, // если true — запрос требует авторизации
) {
  // Берём состояние пользователя из zustand
  const store = useUserStore.getState();
  const token = store.token;

  // Если запрос требует авторизации, но токена нет — выбрасываем ошибку
  if (requireAuth && !token) throw new Error('Пользователь не авторизован');

  // Базовые заголовки для fetch — JSON по умолчанию
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Преобразуем incoming headers из options в Record<string,string>
  // Потому что TypeScript не знает, что headers точно Record<string,string>
  let incomingHeaders: Record<string, string> = {};
  if (options.headers instanceof Headers) {
    // Если это объект Headers
    options.headers.forEach((value, key) => {
      incomingHeaders[key] = value;
    });
  } else if (Array.isArray(options.headers)) {
    // Если это массив кортежей [key, value]
    options.headers.forEach(([key, value]) => {
      incomingHeaders[key] = value;
    });
  } else if (options.headers) {
    // Если это уже Record<string,string>, приводим к нужному типу
    incomingHeaders = options.headers as Record<string, string>;
  }

  // Собираем финальные заголовки: базовые + пользовательские + токен, если есть
  const headers: Record<string, string> = {
    ...baseHeaders,
    ...incomingHeaders,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Делаем первый запрос на сервер
  let res = await fetch(`${SERVER_URL}${endpoint}`, { ...options, headers });

  // Если сервер вернул 401 (Unauthorized) и есть refreshToken — пробуем обновить токен
  if (res.status === 401 && store.refreshToken) {
    try {
      // Получаем новый accessToken через refreshToken
      const newToken = await refreshToken();
      // Обновляем заголовки и повторяем запрос
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(`${SERVER_URL}${endpoint}`, { ...options, headers });
    } catch {
      // Если обновить токен не удалось — разлогиниваем пользователя
      store.logout();
      throw new Error('Сессия истекла, пожалуйста, войдите снова');
    }
  }

  // Возвращаем объект Response, чтобы вызывающий код мог дальше вызвать res.json() или res.text()
  return res;
}
