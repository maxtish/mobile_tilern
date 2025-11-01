export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
}

export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}
