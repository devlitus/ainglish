import {
  validateEmail,
  validateName,
  validateLoginData,
  validateRegisterData,
  sanitizeEmail,
  sanitizeName,
  sanitizeInput,
  type ValidationResult,
  type LoginData,
  type RegisterData
} from '../../src/lib/validations'

describe('Validaciones', () => {
  describe('validateEmail', () => {
    it('debería validar emails correctos', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org',
        'user123@test-domain.com',
        'a@b.co'
      ]

      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('debería rechazar emails inválidos', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@domain.com',
        'user@',
        'user@@domain.com',
        'user@domain',
        'user..name@domain.com',
        'user@domain..com',
        'user name@domain.com',
        'user@domain.c',
        'a'.repeat(250) + '@domain.com' // Email demasiado largo
      ]

      invalidEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('debería manejar email vacío', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es requerido')
    })

    it('debería rechazar email demasiado largo', () => {
      const longEmail = 'a'.repeat(250) + '@domain.com'
      const result = validateEmail(longEmail)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es demasiado largo')
    })

    it('debería rechazar emails con dobles puntos consecutivos', () => {
      const result = validateEmail('user..name@domain.com')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El formato del email no es válido')
    })

    it('debería rechazar emails que empiecen o terminen con @', () => {
      const startsWith = validateEmail('@domain.com')
      const endsWith = validateEmail('user@')
      
      expect(startsWith.isValid).toBe(false)
      expect(startsWith.errors).toContain('El formato del email no es válido')
      
      expect(endsWith.isValid).toBe(false)
      expect(endsWith.errors).toContain('El formato del email no es válido')
    })
  })

  describe('validateName', () => {
    it('debería validar nombres correctos', () => {
      const validNames = [
        'Juan',
        'María Elena',
        'José Luis',
        'Ana',
        'Carlos Alberto',
        'Sofía Alejandra',
        'José María de la Cruz'
      ]

      validNames.forEach(name => {
        const result = validateName(name)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('debería rechazar nombres inválidos', () => {
      const invalidNames = [
        '',
        'A', // Muy corto
        'A'.repeat(51), // Muy largo
        'Juan123', // Contiene números
        'María@test', // Contiene símbolos
        'José_Luis', // Contiene guión bajo
        'Ana-María' // Contiene guión
      ]

      invalidNames.forEach(name => {
        const result = validateName(name)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('debería manejar nombre vacío', () => {
      const result = validateName('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre es requerido')
    })

    it('debería rechazar nombres demasiado cortos', () => {
      const result = validateName('A')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre debe tener al menos 2 caracteres')
    })

    it('debería rechazar nombres demasiado largos', () => {
      const longName = 'A'.repeat(51)
      const result = validateName(longName)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre no puede tener más de 50 caracteres')
    })

    it('debería rechazar nombres con caracteres no permitidos', () => {
      const result = validateName('Juan123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre solo puede contener letras y espacios')
    })

    it('debería aceptar nombres con acentos y ñ', () => {
      const namesWithAccents = [
        'José',
        'María',
        'Ángel',
        'Sofía',
        'Iñaki',
        'Montaña'
      ]

      namesWithAccents.forEach(name => {
        const result = validateName(name)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })
  })

  describe('validateLoginData', () => {
    it('debería validar datos de login correctos', () => {
      const loginData: LoginData = {
        email: 'test@example.com'
      }

      const result = validateLoginData(loginData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('debería rechazar datos de login con email inválido', () => {
      const loginData: LoginData = {
        email: 'invalid-email'
      }

      const result = validateLoginData(loginData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El formato del email no es válido')
    })

    it('debería rechazar datos de login con email vacío', () => {
      const loginData: LoginData = {
        email: ''
      }

      const result = validateLoginData(loginData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es requerido')
    })
  })

  describe('validateRegisterData', () => {
    it('debería validar datos de registro correctos', () => {
      const registerData: RegisterData = {
        name: 'Juan Pérez',
        email: 'juan@example.com'
      }

      const result = validateRegisterData(registerData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('debería rechazar datos de registro con nombre inválido', () => {
      const registerData: RegisterData = {
        name: 'A',
        email: 'juan@example.com'
      }

      const result = validateRegisterData(registerData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre debe tener al menos 2 caracteres')
    })

    it('debería rechazar datos de registro con email inválido', () => {
      const registerData: RegisterData = {
        name: 'Juan Pérez',
        email: 'invalid-email'
      }

      const result = validateRegisterData(registerData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El formato del email no es válido')
    })

    it('debería rechazar datos de registro con múltiples errores', () => {
      const registerData: RegisterData = {
        name: '',
        email: 'invalid-email'
      }

      const result = validateRegisterData(registerData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre es requerido')
      expect(result.errors).toContain('El formato del email no es válido')
      expect(result.errors.length).toBeGreaterThanOrEqual(2)
    })

    it('debería acumular todos los errores de validación', () => {
      const registerData: RegisterData = {
        name: 'A', // Muy corto
        email: '' // Vacío
      }

      const result = validateRegisterData(registerData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre debe tener al menos 2 caracteres')
      expect(result.errors).toContain('El email es requerido')
    })
  })

  describe('Funciones de sanitización', () => {
    describe('sanitizeEmail', () => {
      it('debería limpiar y convertir email a minúsculas', () => {
        expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
        expect(sanitizeEmail('User@Domain.Com')).toBe('user@domain.com')
        expect(sanitizeEmail(' user@example.org ')).toBe('user@example.org')
      })

      it('debería manejar strings vacíos', () => {
        expect(sanitizeEmail('')).toBe('')
        expect(sanitizeEmail('   ')).toBe('')
      })
    })

    describe('sanitizeName', () => {
      it('debería limpiar espacios extra en nombres', () => {
        expect(sanitizeName('  Juan   Pérez  ')).toBe('Juan Pérez')
        expect(sanitizeName('María    Elena')).toBe('María Elena')
        expect(sanitizeName(' José ')).toBe('José')
      })

      it('debería normalizar múltiples espacios consecutivos', () => {
        expect(sanitizeName('Ana     María     José')).toBe('Ana María José')
      })

      it('debería manejar strings vacíos', () => {
        expect(sanitizeName('')).toBe('')
        expect(sanitizeName('   ')).toBe('')
      })
    })

    describe('sanitizeInput', () => {
      it('debería remover caracteres peligrosos', () => {
        expect(sanitizeInput('  Hello<script>alert("xss")</script>  ')).toBe('Helloscriptalert(xss)/script')
        expect(sanitizeInput('Test & "quotes" \'single\'')).toBe('Test  quotes single')
        expect(sanitizeInput('<div>Content</div>')).toBe('divContent/div')
      })

      it('debería preservar caracteres seguros', () => {
        expect(sanitizeInput('  Normal text with números 123  ')).toBe('Normal text with números 123')
        expect(sanitizeInput('Text with spaces')).toBe('Text with spaces')
      })

      it('debería manejar strings vacíos', () => {
        expect(sanitizeInput('')).toBe('')
        expect(sanitizeInput('   ')).toBe('')
      })
    })
  })

  describe('Tipos de retorno', () => {
    it('debería retornar ValidationResult con estructura correcta', () => {
      const result = validateEmail('test@example.com')
      
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('errors')
      expect(typeof result.isValid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
    })

    it('debería retornar errores como array de strings', () => {
      const result = validateEmail('')
      
      expect(Array.isArray(result.errors)).toBe(true)
      result.errors.forEach(error => {
        expect(typeof error).toBe('string')
      })
    })
  })
})