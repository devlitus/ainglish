import { useAuthStore, useAuth } from '@/store/authStore'
import { act, renderHook } from '@testing-library/react'

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: <T>(fn: T) => fn
}))

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ user: null, isLoading: true })
  })

  describe('Initial State', () => {
    it('should have initial state with no user and loading true', () => {
      const { result } = renderHook(() => useAuth())
      
      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('Login', () => {
    it('should set user and stop loading on login', () => {
      const { result } = renderHook(() => useAuth())
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }

      act(() => {
        result.current.login(mockUser)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should clear user and stop loading on logout', () => {
      const { result } = renderHook(() => useAuth())
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }

      // First login
      act(() => {
        result.current.login(mockUser)
      })

      // Then logout
      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('SetLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('useAuth hook', () => {
    it('should return all auth methods and state', () => {
      const { result } = renderHook(() => useAuth())
      
      expect(result.current).toHaveProperty('user')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('login')
      expect(result.current).toHaveProperty('logout')
      expect(result.current).toHaveProperty('setLoading')
      expect(typeof result.current.login).toBe('function')
      expect(typeof result.current.logout).toBe('function')
      expect(typeof result.current.setLoading).toBe('function')
    })
  })
})