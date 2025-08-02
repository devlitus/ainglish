// Esquemas de validación

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // Mínimo 6 caracteres
  return password.length >= 6
}

export function validateName(name: string): boolean {
  // Mínimo 2 caracteres, solo letras y espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/
  return nameRegex.test(name.trim())
}

export function validateLoginForm(email: string, password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!email.trim()) {
    errors.push('El email es requerido')
  } else if (!validateEmail(email)) {
    errors.push('El email no es válido')
  }
  
  if (!password.trim()) {
    errors.push('La contraseña es requerida')
  } else if (!validatePassword(password)) {
    errors.push('La contraseña debe tener al menos 6 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateRegisterForm(name: string, email: string, password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!name.trim()) {
    errors.push('El nombre es requerido')
  } else if (!validateName(name)) {
    errors.push('El nombre debe tener al menos 2 caracteres y solo contener letras')
  }
  
  if (!email.trim()) {
    errors.push('El email es requerido')
  } else if (!validateEmail(email)) {
    errors.push('El email no es válido')
  }
  
  if (!password.trim()) {
    errors.push('La contraseña es requerida')
  } else if (!validatePassword(password)) {
    errors.push('La contraseña debe tener al menos 6 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}