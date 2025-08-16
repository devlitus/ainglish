import { POST } from '@/app/api/auth/register/route'
import { createUser } from '@/lib/auth'
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
  createUser: jest.fn()
}))

const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: Record<string, string | null>) => {
    return {
      json: async () => body
    } as NextRequest
  }

  it('should register user successfully with valid data', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockCreateUser.mockResolvedValueOnce(mockUser)

    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      }
    })
    expect(mockCreateUser).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123')
  })

  it('should return 400 when name is missing', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when email is missing', async () => {
    const request = createMockRequest({
      name: 'Test User',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when password is missing', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when all fields are missing', async () => {
    const request = createMockRequest({})

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when name is empty string', async () => {
    const request = createMockRequest({
      name: '',
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when email is empty string', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: '',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when password is empty string', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: ''
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when createUser throws an error', async () => {
    const errorMessage = 'El email ya está registrado'
    mockCreateUser.mockRejectedValueOnce(new Error(errorMessage))

    const request = createMockRequest({
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: errorMessage })
    expect(mockCreateUser).toHaveBeenCalledWith('Test User', 'existing@example.com', 'password123')
  })

  it('should handle unknown error types', async () => {
    mockCreateUser.mockRejectedValueOnce('String error')

    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Error al crear usuario' })
  })

  it('should handle malformed JSON request', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON')
      }
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid JSON' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should handle null values in request body', async () => {
    const request = createMockRequest({
      name: null,
      email: null,
      password: null
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it('should not include password in response', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mockCreateUser.mockResolvedValueOnce(mockUser)

    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.user).not.toHaveProperty('password')
    expect(data.user).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email
    })
  })

  it('should handle whitespace-only fields', async () => {
    const request = createMockRequest({
      name: '   ',
      email: '\t\n',
      password: '  '
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Todos los campos son requeridos' })
    expect(mockCreateUser).not.toHaveBeenCalled()
  })
})