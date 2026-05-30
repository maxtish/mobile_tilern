export type SessionStatus = 'valid' | 'needs_refresh' | 'expired';

export interface UserState {
  user: User | null;
  sessionStatus: SessionStatus;

  setUser: (user: User) => void;
  setSessionStatus: (status: SessionStatus) => void;
  logout: () => void;
}

export type UserRole = 'USER' | 'PREMIUM' | 'EDITOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
}

export interface DBUser {
  id: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  email_verified: boolean;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const mapServerUserToClient = (serverUser: {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url?: string | null;
  email_verified?: boolean;
}): User => ({
  id: serverUser.id,
  email: serverUser.email,
  name: serverUser.name ?? null,
  role: serverUser.role,
  avatarUrl: serverUser.avatar_url ?? null,
  emailVerified: Boolean(serverUser.email_verified),
});

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    avatar_url?: string | null;
    email_verified?: boolean;
  };
  accessToken: string;
  refreshToken: string;
}
