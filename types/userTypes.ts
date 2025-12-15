export interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null; // <- добавляем
  setUser: (user: User, token: string, refreshToken: string) => void; // <- теперь 3 аргумента
  logout: () => void;
}

///'USER' | 'ADMIN' | 'PREMIUM' | 'EDITOR'
export type UserRole = 'USER' | 'PREMIUM' | 'EDITOR' | 'ADMIN';

// --- Клиентская модель (для API / фронта) ---
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

// --- Серверная модель (из БД) ---
export interface DBUser {
  id: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// --- Маппер: DB → API (server response) ---

export const mapServerUserToClient = (serverUser: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}) => ({
  id: serverUser.id,
  email: serverUser.email,
  name: serverUser.name ?? null,
  role: serverUser.role,
  avatarUrl: serverUser.avatar_url ?? null,
});

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string;
  };
  accessToken: string; // <-- добавляем
  refreshToken: string; // <-- добавляем
}
