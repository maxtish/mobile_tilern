// app/api/userApi.ts
import { api } from './client';

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });
