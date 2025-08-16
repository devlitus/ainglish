import { supabase } from './supabase'
import { logSecurityEvent, sanitizeAndValidateInput, VALIDATION_CONFIG } from './security'

export async function createUser(name: string, email: string, clientInfo?: { ip: string; userAgent?: string }) {
  try {
    // Validar y sanitizar entrada
    const nameValidation = sanitizeAndValidateInput(name, VALIDATION_CONFIG.NAME_MAX_LENGTH)
    const emailValidation = sanitizeAndValidateInput(email, VALIDATION_CONFIG.EMAIL_MAX_LENGTH)
    
    if (!nameValidation.isValid || !emailValidation.isValid) {
      if (clientInfo) {
        logSecurityEvent({
          type: 'SUSPICIOUS_INPUT',
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          details: {
            input: `name: ${name.substring(0, 20)}..., email: ${email.substring(0, 20)}...`,
            patterns: 'validation_failure',
            field: 'registration_data'
          }
        })
      }
      throw new Error('Datos de entrada inválidos')
    }
    
    const sanitizedName = nameValidation.sanitized
    const sanitizedEmail = emailValidation.sanitized
    
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', sanitizedEmail)
      .single()
    
    if (existingUser) {
      throw new Error('El usuario ya existe')
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: sanitizedName,
          email: sanitizedEmail,
          created_at: new Date().toISOString(),
          login_count: 0
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error('Error al crear usuario: ' + error.message)
    }

    return data
  } catch (error) {
    // Re-lanzar el error para que sea manejado por la API
    throw error
  }
}

export async function loginUser(email: string, clientInfo?: { ip: string; userAgent?: string }) {
  try {
    // Validar y sanitizar entrada del email únicamente
    const emailValidation = sanitizeAndValidateInput(email, VALIDATION_CONFIG.EMAIL_MAX_LENGTH)
    
    if (!emailValidation.isValid) {
      if (clientInfo) {
        logSecurityEvent({
          type: 'SUSPICIOUS_INPUT',
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          details: {
            input: email.substring(0, 20) + '...',
            patterns: 'invalid_email_format',
            field: 'email'
          }
        })
      }
      throw new Error('Datos de entrada inválidos')
    }
    
    const sanitizedEmail = emailValidation.sanitized
    
    // Buscar usuario en la base de datos (solo verificar que el email exista)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', sanitizedEmail)
      .single()

    if (error || !user) {
      if (clientInfo) {
        logSecurityEvent({
          type: 'AUTH_FAILURE',
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          details: {
            reason: 'user_not_found',
            email: sanitizedEmail,
            attempts: 1
          }
        })
      }
      throw new Error('Usuario no encontrado')
    }

    // Login exitoso - actualizar último acceso
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        login_count: (user.login_count || 0) + 1
      })
      .eq('id', user.id)

    return user
  } catch (error) {
    // Re-lanzar el error para que sea manejado por la API
    throw error
  }
}