// api/auth/login.ts
import { SERVER_URL } from '../constants/constants';
import { LoginResponse } from '../types/userTypes';

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${SERVER_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}
