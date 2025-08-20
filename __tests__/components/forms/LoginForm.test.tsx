import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/forms/LoginForm'

// Mock del hook useAuth
const mockLogin = jest.fn()
const mockPush = jest.fn()

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock de fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('LoginForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  test('debe renderizar el formulario correctamente', () => {
    render(<LoginForm />)

    expect(document.getElementById('login-form')).toBeInTheDocument()
    expect(document.getElementById('email-input')).toBeInTheDocument()
    expect(document.getElementById('login-submit-button')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  test('debe validar formato de email inválido', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = document.getElementById('email-input') || screen.getByPlaceholderText('tu@email.com')
    const submitButton = document.getElementById('login-submit-button') || screen.getByRole('button', { name: /iniciar sesión/i })

    // Escribir email inválido y enviar
    await user.type(emailInput, 'email-invalido')
    await user.click(submitButton)

    // Verificar que no se hizo la llamada fetch (validación falló)
    expect(mockFetch).not.toHaveBeenCalled()
    
    // Verificar que el botón vuelve a estar habilitado después del error
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  test('debe validar email vacío al enviar formulario', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = document.getElementById('login-submit-button') || screen.getByRole('button', { name: /iniciar sesión/i })
    
    // Verificar que el botón esté habilitado inicialmente (email vacío pero no validado)
    expect(submitButton).not.toBeDisabled()
    
    // Enviar formulario vacío
    await user.click(submitButton)

    // Verificar que no se hizo la llamada fetch (validación falló)
    expect(mockFetch).not.toHaveBeenCalled()
    
    // Verificar que el botón vuelve a estar habilitado después del error
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  test('debe enviar formulario con email válido', async () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    })

    render(<LoginForm />)

    const emailInput = document.getElementById('email-input') || screen.getByPlaceholderText('tu@email.com')
    const submitButton = document.getElementById('login-submit-button') || screen.getByRole('button', { name: /iniciar sesión/i })

    await user.type(emailInput, 'juan@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'juan@example.com' })
      })
    })

    expect(mockLogin).toHaveBeenCalledWith(mockUser)
  })
})