import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

// Mock del store
jest.mock('@/store/authStore')

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

describe('useAuth Hook', () => {
  const mockUser = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com'
  }

  const mockStoreFunctions = {
    user: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    setLoading: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockReturnValue(mockStoreFunctions)
  })

  test('debe retornar las funciones y estado del store', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      user: null,
      isLoading: false,
      login: expect.any(Function),
      logout: expect.any(Function),
      setLoading: expect.any(Function)
    })
  })

  test('debe retornar el usuario cuando está logueado', () => {
    mockUseAuthStore.mockReturnValue({
      ...mockStoreFunctions,
      user: mockUser,
      isLoading: false
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoading).toBe(false)
  })

  test('debe retornar isLoading true cuando está cargando', () => {
    mockUseAuthStore.mockReturnValue({
      ...mockStoreFunctions,
      user: null,
      isLoading: true
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(true)
  })

  test('debe llamar login del store', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login(mockUser)
    })

    expect(mockStoreFunctions.login).toHaveBeenCalledWith(mockUser)
  })

  test('debe llamar logout del store', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(mockStoreFunctions.logout).toHaveBeenCalled()
  })

  test('debe llamar setLoading del store', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.setLoading(true)
    })

    expect(mockStoreFunctions.setLoading).toHaveBeenCalledWith(true)
  })
})