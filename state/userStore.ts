// app/state/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: { id: string; name: string } | null;
  setUser: (user: UserState['user']) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
  logout: () => set({ user: null }),
}));
