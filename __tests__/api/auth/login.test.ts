import { POST } from '@/app/api/auth/login/route'
import { loginUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200
    }))
  }
}))

// Mock the auth library
jest.mock('@/lib/auth', () => ({
  loginUser: jest.fn()
}))

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: Record<string, unknown>) => {
    return {
      json: async () => body
    } as NextRequest
  }

  it('should login user successfully with valid credentials', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }

    mockLoginUser.mockResolvedValueOnce(mockUser)

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ user: mockUser })
    expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('should return 400 when email is missing', async () => {
    const request = createMockRequest({
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should return 400 when password is missing', async () => {
    const request = createMockRequest({
      email: 'test@example.com'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should return 400 when both email and password are missing', async () => {
    const request = createMockRequest({})

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should return 400 when email is empty string', async () => {
    const request = createMockRequest({
      email: '',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should return 400 when password is empty string', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: ''
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should return 401 when loginUser throws an error', async () => {
    const errorMessage = 'Credenciales inválidas'
    mockLoginUser.mockRejectedValueOnce(new Error(errorMessage))

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: errorMessage })
    expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'wrongpassword')
  })

  it('should handle unknown error types', async () => {
    mockLoginUser.mockRejectedValueOnce('String error')

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Error al iniciar sesión' })
  })

  it('should handle malformed JSON request', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON')
      }
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Invalid JSON' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('should handle null values in request body', async () => {
    const request = createMockRequest({
      email: null,
      password: null
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Email y contraseña son requeridos' })
    expect(mockLoginUser).not.toHaveBeenCalled()
  })
})