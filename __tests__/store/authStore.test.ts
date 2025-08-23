import { useAuthStore } from '@/store/authStore'
import { act, renderHook } from '@testing-library/react'

// Mock de zustand persist
jest.mock('zustand/middleware', () => ({
  persist: <T>(fn: T) => fn
}))

describe('AuthStore', () => {
  const mockUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com'
  }

  beforeEach(() => {
    // Reset del store antes de cada test
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
      result.current.setLoading(false)
    })
  })

  test('debe tener estado inicial correcto', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.setLoading).toBe('function')
  })

  test('debe hacer login correctamente', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.login(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(false)
  })

  test('debe hacer logout correctamente', () => {
    const { result } = renderHook(() => useAuthStore())

    // Primero hacer login
    act(() => {
      result.current.login(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)

    // Luego hacer logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  test('debe cambiar estado de loading', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })

  test('debe mantener usuario después de login y cambiar loading independientemente', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.login(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(true)
  })

  test('debe limpiar usuario en logout sin afectar loading', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.login(mockUser)
      result.current.setLoading(true)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })
})