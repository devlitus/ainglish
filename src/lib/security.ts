// Configuración de seguridad para la aplicación

// Configuración de rate limiting
export const RATE_LIMIT_CONFIG = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos
    WINDOW_TIME: 60 * 1000 // 1 minuto
  },
  REGISTER: {
    MAX_ATTEMPTS: 3,
    LOCKOUT_TIME: 30 * 60 * 1000, // 30 minutos
    WINDOW_TIME: 60 * 1000 // 1 minuto
  }
}

// Configuración de validación
export const VALIDATION_CONFIG = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  REQUEST_BODY_MAX_SIZE: 1024 * 10 // 10KB
}

// Headers de seguridad
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

// Función para sanitizar headers de respuesta
export function addSecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Función para validar el tamaño del request
export function validateRequestSize(contentLength: string | null): boolean {
  if (!contentLength) return true
  const size = parseInt(contentLength, 10)
  return size <= VALIDATION_CONFIG.REQUEST_BODY_MAX_SIZE
}

// Función para detectar patrones sospechosos
export function detectSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi, // Scripts
    /javascript:/gi, // JavaScript URLs
    /on\w+\s*=/gi, // Event handlers
    /\beval\s*\(/gi, // eval calls
    /\bexec\s*\(/gi, // exec calls
    /<iframe[^>]*>/gi, // iframes
    /<object[^>]*>/gi, // objects
    /<embed[^>]*>/gi, // embeds
    /\bvbscript:/gi, // VBScript
    /\bdata:text\/html/gi // Data URLs with HTML
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(input))
}

// Función para limpiar y validar entrada de usuario
export function sanitizeAndValidateInput(input: string, maxLength: number): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  // Verificar longitud
  if (input.length > maxLength) {
    return {
      isValid: false,
      sanitized: '',
      error: `Entrada demasiado larga. Máximo ${maxLength} caracteres.`
    }
  }
  
  // Detectar patrones sospechosos
  if (detectSuspiciousPatterns(input)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Entrada contiene contenido no permitido.'
    }
  }
  
  // Sanitizar entrada básica
  const sanitized = input
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remover caracteres de control
    .replace(/\s+/g, ' ') // Normalizar espacios
  
  return {
    isValid: true,
    sanitized
  }
}

// Función para generar un token CSRF simple (en producción usar una librería dedicada)
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Función para validar origen de la request
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  return allowedOrigins.includes(origin)
}

// Tipos específicos para detalles de eventos de seguridad
type SecurityEventDetails = {
  RATE_LIMIT: {
    attempts: number
    maxAttempts: number
    remainingTime?: number
    endpoint?: string
  }
  SUSPICIOUS_INPUT: {
    input: string
    patterns: string
    field?: string
  }
  INVALID_ORIGIN: {
    origin: string
    allowedOrigins: string
    endpoint?: string
  }
  AUTH_FAILURE: {
    email?: string
    reason: 'invalid_credentials' | 'user_not_found' | 'validation_error' | 'invalid_password'
    attempts?: number
  }
}

// Función para log de eventos de seguridad
export function logSecurityEvent<T extends keyof SecurityEventDetails>(event: {
  type: T
  ip: string
  userAgent?: string
  details?: SecurityEventDetails[T]
}) {
  // En producción, esto debería ir a un sistema de logging apropiado
  console.warn(`[SECURITY] ${event.type}:`, {
    timestamp: new Date().toISOString(),
    ip: event.ip,
    userAgent: event.userAgent,
    details: event.details
  })
}

// Rate limiter mejorado con ventana deslizante
export class RateLimiter {
  private attempts = new Map<string, number[]>()
  
  constructor(
    private maxAttempts: number,
    private windowMs: number,
    private lockoutMs: number
  ) {}
  
  isAllowed(identifier: string): { allowed: boolean; remainingTime?: number } {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []
    
    // Limpiar intentos antiguos
    const recentAttempts = userAttempts.filter(time => now - time < this.windowMs)
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts)
      const remainingTime = this.lockoutMs - (now - oldestAttempt)
      return { allowed: false, remainingTime: Math.max(0, remainingTime) }
    }
    
    // Registrar nuevo intento
    recentAttempts.push(now)
    this.attempts.set(identifier, recentAttempts)
    
    return { allowed: true }
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
  
  // Limpiar intentos antiguos periódicamente
  cleanup(): void {
    const now = Date.now()
    for (const [identifier, attempts] of this.attempts.entries()) {
      const recentAttempts = attempts.filter(time => now - time < this.windowMs)
      if (recentAttempts.length === 0) {
        this.attempts.delete(identifier)
      } else {
        this.attempts.set(identifier, recentAttempts)
      }
    }
  }
}