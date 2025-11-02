export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

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
export const mapDBUserToUser = (dbUser: DBUser): User => ({
  id: dbUser.id,
  email: dbUser.email,
  name: dbUser.name,
  avatarUrl: dbUser.avatar_url,
  role: dbUser.role,
});

export interface LoginResponse {
  user: User;
  token: string;
}
