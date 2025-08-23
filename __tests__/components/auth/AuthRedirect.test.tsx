import { render, screen } from '@testing-library/react'
import AuthRedirect from '@/components/auth/AuthRedirect'
import { useAuth } from '@/hooks/useAuth'

// Mock del hook useAuth
const mockPush = jest.fn()

jest.mock('@/hooks/useAuth')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('@/components/common/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => (
    <div role="status" className="animate-spin">
      <span>{message}</span>
    </div>
  )
}))


const mockUseAuth = jest.mocked(useAuth)

describe('AuthRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe mostrar spinner cuando está cargando', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // spinner
  })

  test('debe redirigir cuando hay usuario autenticado', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
    expect(screen.getByText(/redirigiendo al dashboard/i)).toBeInTheDocument()
  })

  test('debe renderizar children cuando no hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByText(/verificando sesión/i)).not.toBeInTheDocument()
  })

  test('debe mostrar spinner con la clase correcta', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('animate-spin')
  })

  test('debe usar useEffect para redirigir', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  test('no debe mostrar children cuando hay usuario autenticado', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    expect(screen.getByText(/redirigiendo al dashboard/i)).toBeInTheDocument()
  })

  test('debe llamar useRouter solo una vez por renderizado', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setLoading: jest.fn()
    })

    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)
    render(<AuthRedirect><div>Test Content</div></AuthRedirect>)

    // Debería llamarse una vez por cada renderizado
    expect(mockPush).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})