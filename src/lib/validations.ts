// Esquemas de validación

// Tipos para validaciones
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface LoginData {
  email: string
}

export interface RegisterData {
  name: string
  email: string
}

// Constantes de validación
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 50

// Funciones de validación individuales
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email) {
    errors.push('El email es requerido')
  } else {
    if (email.length > 254) {
      errors.push('El email es demasiado largo')
    }
    
    // Validaciones específicas para casos problemáticos
    if (email.includes('..')) {
      errors.push('El formato del email no es válido')
    } else if (email.startsWith('@') || email.endsWith('@')) {
      errors.push('El formato del email no es válido')
    } else if (!email.includes('@') || email.split('@').length !== 2) {
      errors.push('El formato del email no es válido')
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push('El formato del email no es válido')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}



export function validateName(name: string): ValidationResult {
  const errors: string[] = []
  
  if (!name) {
    errors.push('El nombre es requerido')
  } else {
    if (name.length < NAME_MIN_LENGTH) {
      errors.push(`El nombre debe tener al menos ${NAME_MIN_LENGTH} caracteres`)
    }
    if (name.length > NAME_MAX_LENGTH) {
      errors.push(`El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`)
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      errors.push('El nombre solo puede contener letras y espacios')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validaciones completas para formularios
export function validateLoginData(data: LoginData): ValidationResult {
  const emailValidation = validateEmail(data.email)
  
  return {
    isValid: emailValidation.isValid,
    errors: emailValidation.errors
  }
}

export function validateRegisterData(data: RegisterData): ValidationResult {
  const nameValidation = validateName(data.name)
  const emailValidation = validateEmail(data.email)
  
  const allErrors = [
    ...nameValidation.errors,
    ...emailValidation.errors
  ]
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

// Funciones de sanitización
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '')
}