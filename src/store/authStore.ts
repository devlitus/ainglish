import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      login: (user: User) => {
        set({ user, isLoading: false });
      },
      logout: () => {
        set({ user: null, isLoading: false });
      },
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: "auth",
      partialize: (state) => (state.user ? { user: state.user } : {}),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setLoading(false);
          }
        };
      },
    }
  )
);