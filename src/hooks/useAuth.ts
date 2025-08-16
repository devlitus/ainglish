import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isLoading, login, logout, setLoading } = useAuthStore()
  
  return { user, isLoading, login, logout, setLoading }
}