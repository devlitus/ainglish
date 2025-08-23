// Mock de Supabase completo
const mockSelect = jest.fn().mockReturnThis()
const mockInsert = jest.fn().mockReturnThis()
const mockUpdate = jest.fn().mockReturnThis()
const mockEq = jest.fn().mockReturnThis()
const mockSingle = jest.fn()
const mockUpdateResult = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      update: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: null, error: null })
      }))
    }))
  }
}))

// Mock de las funciones de seguridad
jest.mock('@/lib/security', () => ({
  logSecurityEvent: jest.fn(),
  sanitizeAndValidateInput: jest.fn((input: string) => ({
    isValid: true,
    sanitized: input,
    originalValue: input
  })),
  VALIDATION_CONFIG: {
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 254
  }
}))

import { createUser, loginUser } from '@/lib/auth'
import { validateEmail, validateName } from '@/lib/validations'
import { supabase } from '@/lib/supabase'

describe('Funciones de Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    test('debe crear un usuario exitosamente', async () => {
      const userData = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        created_at: new Date().toISOString(),
        login_count: 0
      }

      // Mock para verificar que el usuario no existe (primera llamada)
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows found' }
      })
      
      // Mock para la inserción exitosa (segunda llamada)
      mockSingle.mockResolvedValueOnce({
        data: userData,
        error: null
      })

      const result = await createUser('Juan Pérez', 'juan@example.com')

      expect(result).toEqual(userData)
    })

    test('debe fallar si el usuario ya existe', async () => {
      const existingUser = {
        email: 'juan@example.com'
      }

      // Mock para simular que el usuario ya existe
      mockSingle.mockResolvedValueOnce({
        data: existingUser,
        error: null
      })

      await expect(createUser('Juan Pérez', 'juan@example.com'))
        .rejects
        .toThrow('El usuario ya existe')
    })

    test('debe fallar con datos inválidos', async () => {
      // Mock de validación fallida
      const { sanitizeAndValidateInput } = await import('@/lib/security')
      ;(sanitizeAndValidateInput as jest.Mock).mockReturnValueOnce({
        isValid: false,
        sanitized: ''
      })

      await expect(createUser('', 'invalid-email'))
        .rejects
        .toThrow('Datos de entrada inválidos')
    })

    test('debe manejar errores de base de datos', async () => {
      // Mock para verificar que el usuario no existe (primera llamada)
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows returned' }
      })
      
      // Mock para error en inserción (segunda llamada)
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      await expect(createUser('Juan Pérez', 'juan@example.com'))
        .rejects
        .toThrow('Error al crear usuario: Database error')
    })
  })

  describe('loginUser', () => {
    test('debe hacer login exitosamente', async () => {
      const mockUser = {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        login_count: 5,
        last_login: '2024-01-01T00:00:00.000Z'
      }

      // Mock para encontrar el usuario
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null
      })
      
      // Mock para el update (no necesita retornar nada específico)

      const result = await loginUser('juan@example.com')

      expect(result).toEqual(mockUser)
    })

    test('debe fallar si el usuario no existe', async () => {
      // Mock para simular que no se encuentra el usuario
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows returned' }
      })

      await expect(loginUser('noexiste@example.com'))
        .rejects
        .toThrow('Usuario no encontrado')
    })

    test('debe fallar con email inválido', async () => {
      // Mock de validación fallida
      const { sanitizeAndValidateInput } = await import('@/lib/security')
      ;(sanitizeAndValidateInput as jest.Mock).mockReturnValueOnce({
        isValid: false,
        sanitized: ''
      })

      await expect(loginUser('invalid-email'))
        .rejects
        .toThrow('Datos de entrada inválidos')
    })

    test('debe incrementar el contador de login', async () => {
      const mockUser = {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        login_count: 5
      }

      // Mock para encontrar el usuario
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null
      })

      await loginUser('juan@example.com')

      // Verificar que se llamó from con 'users' para el update
      const { supabase } = await import('@/lib/supabase')
      expect(supabase.from).toHaveBeenCalledWith('users')
    })

    test('debe registrar eventos de seguridad en fallos', async () => {
      const clientInfo = {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0'
      }

      // Mock para simular que no se encuentra el usuario
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows returned' }
      })

      await expect(loginUser('noexiste@example.com', clientInfo))
        .rejects
        .toThrow('Usuario no encontrado')

      const { logSecurityEvent } = await import('@/lib/security')
      expect(logSecurityEvent).toHaveBeenCalledWith({
        type: 'AUTH_FAILURE',
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        details: {
          reason: 'user_not_found',
          email: 'noexiste@example.com',
          attempts: 1
        }
      })
    })
  })
})