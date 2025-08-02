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
        set({ user, isLoading: false })
      },
      logout: () => {
        set({ user: null, isLoading: false })
      },
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// Hook personalizado para mantener compatibilidad
export const useAuth = () => {
  const { user, isLoading, login, logout, setLoading } = useAuthStore()
  return { user, isLoading, login, logout, setLoading }
}