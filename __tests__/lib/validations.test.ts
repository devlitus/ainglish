import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateRegisterForm
} from '@/lib/validations'

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test123@gmail.com',
        'user+tag@example.org'
      ]

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    it('should return false for invalid emails', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test @example.com',
        'test@example'
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false)
      })
    })
  })

  describe('validatePassword', () => {
    it('should return true for passwords with 6 or more characters', () => {
      const validPasswords = [
        '123456',
        'password',
        'mySecurePassword123',
        'abcdef'
      ]

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true)
      })
    })

    it('should return false for passwords with less than 6 characters', () => {
      const invalidPasswords = [
        '',
        '1',
        '12',
        '123',
        '1234',
        '12345'
      ]

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false)
      })
    })
  })

  describe('validateName', () => {
    it('should return true for valid names', () => {
      const validNames = [
        'Juan',
        'María García',
        'José Luis',
        'Ana María Rodríguez',
        'Ñoño',
        'José Ángel'
      ]

      validNames.forEach(name => {
        expect(validateName(name)).toBe(true)
      })
    })

    it('should return false for invalid names', () => {
      const invalidNames = [
        '',
        'A',
        '123',
        'Juan123',
        'José@',
        'María-José',
        '   '
      ]

      invalidNames.forEach(name => {
        expect(validateName(name)).toBe(false)
      })
    })
  })

  describe('validateLoginForm', () => {
    it('should return valid for correct email and password', () => {
      const result = validateLoginForm('test@example.com', 'password123')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return errors for empty email', () => {
      const result = validateLoginForm('', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es requerido')
    })

    it('should return errors for invalid email', () => {
      const result = validateLoginForm('invalid-email', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email no es válido')
    })

    it('should return errors for empty password', () => {
      const result = validateLoginForm('test@example.com', '')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña es requerida')
    })

    it('should return errors for short password', () => {
      const result = validateLoginForm('test@example.com', '123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres')
    })

    it('should return multiple errors for invalid email and password', () => {
      const result = validateLoginForm('invalid-email', '123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors).toContain('El email no es válido')
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres')
    })
  })

  describe('validateRegisterForm', () => {
    it('should return valid for correct name, email and password', () => {
      const result = validateRegisterForm('Juan Pérez', 'test@example.com', 'password123')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return errors for empty name', () => {
      const result = validateRegisterForm('', 'test@example.com', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre es requerido')
    })

    it('should return errors for invalid name', () => {
      const result = validateRegisterForm('A', 'test@example.com', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El nombre debe tener al menos 2 caracteres y solo contener letras')
    })

    it('should return errors for empty email', () => {
      const result = validateRegisterForm('Juan Pérez', '', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es requerido')
    })

    it('should return errors for invalid email', () => {
      const result = validateRegisterForm('Juan Pérez', 'invalid-email', 'password123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email no es válido')
    })

    it('should return errors for empty password', () => {
      const result = validateRegisterForm('Juan Pérez', 'test@example.com', '')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña es requerida')
    })

    it('should return errors for short password', () => {
      const result = validateRegisterForm('Juan Pérez', 'test@example.com', '123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres')
    })

    it('should return multiple errors for all invalid fields', () => {
      const result = validateRegisterForm('', 'invalid-email', '123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors).toContain('El nombre es requerido')
      expect(result.errors).toContain('El email no es válido')
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres')
    })
  })
})