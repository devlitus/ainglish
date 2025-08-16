import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { validateLoginData, sanitizeEmail, sanitizeInput } from '@/lib/validations'
import { 
  RateLimiter, 
  RATE_LIMIT_CONFIG, 
  VALIDATION_CONFIG, 
  addSecurityHeaders, 
  validateRequestSize,
  logSecurityEvent 
} from '@/lib/security'

// Rate limiter para login
const loginRateLimiter = new RateLimiter(
  RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
  RATE_LIMIT_CONFIG.LOGIN.WINDOW_TIME,
  RATE_LIMIT_CONFIG.LOGIN.LOCKOUT_TIME
)

// Limpiar rate limiter cada 5 minutos
setInterval(() => {
  loginRateLimiter.cleanup()
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  let response: NextResponse
  
  try {
    // Obtener información del cliente
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const contentLength = request.headers.get('content-length')
    
    // Validar tamaño de la request
    if (!validateRequestSize(contentLength)) {
      logSecurityEvent({
        type: 'SUSPICIOUS_INPUT',
        ip,
        userAgent,
        details: {
          input: `Content-Length: ${contentLength}`,
          patterns: 'request_too_large',
          field: 'content-length'
        }
      })
      
      response = NextResponse.json(
        { error: 'Request demasiado grande' },
        { status: 413 }
      )
      return addSecurityHeaders(response)
    }
    
    // Verificar rate limiting
    const rateLimit = loginRateLimiter.isAllowed(ip)
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.remainingTime || 0) / 60000)
      
      logSecurityEvent({
        type: 'RATE_LIMIT',
        ip,
        userAgent,
        details: {
          attempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
          maxAttempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
          remainingTime: rateLimit.remainingTime,
          endpoint: '/api/auth/login'
        }
      })
      
      response = NextResponse.json(
        { error: `Demasiados intentos de inicio de sesión. Intenta de nuevo en ${minutes} minutos.` },
        { status: 429 }
      )
      return addSecurityHeaders(response)
    }
    
    // Validar que el body sea JSON válido
    let body
    try {
      body = await request.json()
    } catch {
      response = NextResponse.json(
        { error: 'Formato de datos inválido' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }
    
    const { email, password } = body
    
    // Validación básica de presencia
    if (!email || !password) {
      response = NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }
    
    // Sanitizar datos de entrada
    const sanitizedEmail = sanitizeEmail(email)
    const sanitizedPassword = sanitizeInput(password)
    
    // Validar formato y seguridad
    const validation = validateLoginData({
      email: sanitizedEmail,
      password: sanitizedPassword
    })
    
    if (!validation.isValid) {
      response = NextResponse.json(
        { error: 'Datos de entrada inválidos', details: validation.errors },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }
    
    // Verificar longitud máxima para prevenir ataques DoS
    if (sanitizedEmail.length > VALIDATION_CONFIG.EMAIL_MAX_LENGTH || 
        sanitizedPassword.length > VALIDATION_CONFIG.PASSWORD_MAX_LENGTH) {
      response = NextResponse.json(
        { error: 'Datos demasiado largos' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // Intentar login con información del cliente para logging
    const user = await loginUser(sanitizedEmail, sanitizedPassword, { ip, userAgent })
    
    // Limpiar intentos fallidos en login exitoso
    loginRateLimiter.reset(ip)
    
    response = NextResponse.json({ user })
    return addSecurityHeaders(response)
    
  } catch (error: unknown) {
    // Log del error para monitoreo
    console.error('Login error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
    
    // No exponer detalles internos del error
    const publicError = errorMessage.includes('Usuario no encontrado') || 
                       errorMessage.includes('Contraseña incorrecta') ||
                       errorMessage.includes('Datos de entrada inválidos')
                       ? errorMessage 
                       : 'Error interno del servidor'
    
    const statusCode = errorMessage.includes('Usuario no encontrado') || 
                      errorMessage.includes('Contraseña incorrecta') ? 401 : 
                      errorMessage.includes('Datos de entrada inválidos') ? 400 : 500
    
    response = NextResponse.json(
      { error: publicError },
      { status: statusCode }
    )
    return addSecurityHeaders(response)
  }
}