// api/apiFetch.ts
import { SERVER_URL } from '../constants/constants';
import { useUserStore } from '../state/userStore';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = useUserStore.getState().token; // ← достаём токен из zustand

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    console.error(`❌ API Error [${res.status}]: ${endpoint}`);
  }

  return res;
};
