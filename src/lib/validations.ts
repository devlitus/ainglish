// Esquemas de validación

// Tipos para validaciones
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// Constantes de validación
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128
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
    if (!EMAIL_REGEX.test(email)) {
      errors.push('El formato del email no es válido')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password) {
    errors.push('La contraseña es requerida')
  } else {
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    }
    if (password.length > PASSWORD_MAX_LENGTH) {
      errors.push(`La contraseña no puede tener más de ${PASSWORD_MAX_LENGTH} caracteres`)
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula')
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula')
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('La contraseña debe contener al menos un número')
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial')
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
  const passwordValidation = validatePassword(data.password)
  
  const allErrors = [...emailValidation.errors, ...passwordValidation.errors]
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

export function validateRegisterData(data: RegisterData): ValidationResult {
  const nameValidation = validateName(data.name)
  const emailValidation = validateEmail(data.email)
  const passwordValidation = validatePassword(data.password)
  
  const allErrors = [
    ...nameValidation.errors,
    ...emailValidation.errors,
    ...passwordValidation.errors
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

// Validación de fuerza de contraseña
export function getPasswordStrength(password: string): {
  score: number
  feedback: string
  color: string
} {
  let score = 0
  let feedback = 'Muy débil'
  let color = 'red'
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/(?=.*[a-z])/.test(password)) score += 1
  if (/(?=.*[A-Z])/.test(password)) score += 1
  if (/(?=.*\d)/.test(password)) score += 1
  if (/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) score += 1
  
  switch (score) {
    case 0:
    case 1:
      feedback = 'Muy débil'
      color = 'red'
      break
    case 2:
    case 3:
      feedback = 'Débil'
      color = 'orange'
      break
    case 4:
      feedback = 'Moderada'
      color = 'yellow'
      break
    case 5:
      feedback = 'Fuerte'
      color = 'lightgreen'
      break
    case 6:
      feedback = 'Muy fuerte'
      color = 'green'
      break
  }
  
  return { score, feedback, color }
}