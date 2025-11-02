import { SERVER_URL } from '../constants/constants';
import { LoginResponse } from '../types/userTypes';

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<LoginResponse> {
  const res = await fetch(`${SERVER_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}
