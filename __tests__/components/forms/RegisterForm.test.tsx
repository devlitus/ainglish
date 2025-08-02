import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '@/components/forms/RegisterForm'
import { useAuth } from '@/store/authStore'
import { useRouter } from 'next/navigation'

// Mock the auth store
jest.mock('@/store/authStore', () => ({
  useAuth: jest.fn()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

const mockLogin = jest.fn()
const mockPush = jest.fn()

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      login: mockLogin
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
    ;(fetch as jest.Mock).mockClear()
  })

  it('should render register form with all fields', () => {
    render(<RegisterForm />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('should update name field when user types', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    await user.type(nameInput, 'Test User')
    
    expect(nameInput).toHaveValue('Test User')
  })

  it('should update email field when user types', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should update password field when user types', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/contraseña/i)
    await user.type(passwordInput, 'password123')
    
    expect(passwordInput).toHaveValue('password123')
  })

  it('should submit form with correct data on successful registration', async () => {
    const user = userEvent.setup()
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    })
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'password123' 
      })
    })
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUser)
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response
    ;(fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ user: { id: '1', name: 'Test', email: 'test@example.com' } })
        }), 100)
      )
    )
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByRole('button', { name: /registrando/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
    })
  })

  it('should display error message on failed registration', async () => {
    const user = userEvent.setup()
    const errorMessage = 'El email ya está registrado'
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage })
    })
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
    
    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should clear error message when form is resubmitted', async () => {
    const user = userEvent.setup()
    
    // First submission fails
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error inicial' })
    })
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error inicial')).toBeInTheDocument()
    })
    
    // Second submission succeeds
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1', name: 'Test User', email: 'test@example.com' } })
    })
    
    await user.clear(emailInput)
    await user.type(emailInput, 'newemail@example.com')
    await user.click(submitButton)
    
    // Error should be cleared during submission
    await waitFor(() => {
      expect(screen.queryByText('Error inicial')).not.toBeInTheDocument()
    })
  })

  it('should prevent form submission when fields are empty', () => {
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    
    expect(nameInput).toBeRequired()
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('should handle form submission via Enter key', async () => {
    const user = userEvent.setup()
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    })
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.keyboard('{Enter}')
    
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'password123' 
      })
    })
  })

  it('should handle unknown error types', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockRejectedValueOnce('String error')
    
    render(<RegisterForm />)
    
    const nameInput = screen.getByLabelText(/nombre/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error desconocido')).toBeInTheDocument()
    })
  })
})