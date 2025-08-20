import {
  validateEmail,
  validateName,
  validateLoginData,
  validateRegisterData,
  sanitizeEmail,
  sanitizeName,
  sanitizeInput
} from '@/lib/validations'

describe('Validaciones de Email', () => {
  test('debe validar emails correctos', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'test+tag@gmail.com',
      'user123@test-domain.com'
    ]

    validEmails.forEach(email => {
      const result = validateEmail(email)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  test('debe rechazar emails inválidos', () => {
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user@domain..com'
    ]

    invalidEmails.forEach(email => {
      const result = validateEmail(email)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  test('debe rechazar emails demasiado largos', () => {
    const longEmail = 'a'.repeat(250) + '@domain.com'
    const result = validateEmail(longEmail)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('El email es demasiado largo')
  })

  test('debe requerir email', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('El email es requerido')
  })
})

describe('Validaciones de Nombre', () => {
  test('debe validar nombres correctos', () => {
    const validNames = [
      'Juan',
      'María García',
      'José Luis',
      'Ana María Rodríguez',
      'Ñoño'
    ]

    validNames.forEach(name => {
      const result = validateName(name)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  test('debe rechazar nombres inválidos', () => {
    const invalidNames = [
      '',
      'A', // muy corto
      'Juan123', // contiene números
      'María@García', // contiene símbolos
      'José_Luis', // contiene guión bajo
      'A'.repeat(51) // muy largo
    ]

    invalidNames.forEach(name => {
      const result = validateName(name)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  test('debe requerir nombre', () => {
    const result = validateName('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('El nombre es requerido')
  })

  test('debe validar longitud mínima', () => {
    const result = validateName('A')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('El nombre debe tener al menos 2 caracteres')
  })

  test('debe validar longitud máxima', () => {
    const longName = 'A'.repeat(51)
    const result = validateName(longName)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('El nombre no puede tener más de 50 caracteres')
  })
})

describe('Validaciones de Formularios', () => {
  test('debe validar datos de login correctos', () => {
    const loginData = { email: 'test@example.com' }
    const result = validateLoginData(loginData)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('debe rechazar datos de login inválidos', () => {
    const loginData = { email: 'invalid-email' }
    const result = validateLoginData(loginData)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  test('debe validar datos de registro correctos', () => {
    const registerData = {
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }
    const result = validateRegisterData(registerData)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('debe rechazar datos de registro inválidos', () => {
    const registerData = {
      name: 'A', // muy corto
      email: 'invalid-email'
    }
    const result = validateRegisterData(registerData)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})

describe('Funciones de Sanitización', () => {
  test('debe sanitizar emails correctamente', () => {
    expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
    expect(sanitizeEmail('User@Domain.Com')).toBe('user@domain.com')
  })

  test('debe sanitizar nombres correctamente', () => {
    expect(sanitizeName('  Juan   Pérez  ')).toBe('Juan Pérez')
    expect(sanitizeName('María    García')).toBe('María García')
  })

  test('debe sanitizar input general', () => {
    expect(sanitizeInput('  test input  ')).toBe('test input')
    expect(sanitizeInput('test<script>alert("xss")</script>')).toBe('testscriptalert(xss)/script')
    expect(sanitizeInput('test"input\'with&quotes')).toBe('testinputwithquotes')
  })
})