'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { validateEmail, validatePassword, getPasswordStrength } from '@/lib/validations'
import { InputField } from '@/components/ui/ValidationMessage'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<{email: boolean, password: boolean}>({email: false, password: false})
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({})
  const [error, setError] = useState<string>('')
  const { login } = useAuth()
  const router = useRouter()

  // Validación en tiempo real
  useEffect(() => {
    if (touched.email) {
      const emailValidation = validateEmail(email)
      setFieldErrors(prev => ({
        ...prev,
        email: emailValidation.isValid ? undefined : emailValidation.errors?.[0]
      }))
    }
  }, [email, touched.email])

  useEffect(() => {
    if (touched.password) {
      const passwordValidation = validatePassword(password)
      setFieldErrors(prev => ({
        ...prev,
        password: passwordValidation.isValid ? undefined : passwordValidation.errors?.[0]
      }))
    }
  }, [password, touched.password])



  const setTouchedFields = setTouched

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Marcar todos los campos como tocados para mostrar errores
    setTouched({ email: true, password: true })

    // Verificar si hay errores de validación
    if (fieldErrors.email || fieldErrors.password) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      login(data.user)
      router.push('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = !fieldErrors.email && !fieldErrors.password && email && password

  return (
    <div className="space-y-6">
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
              error={fieldErrors.email && touched.email ? fieldErrors.email : undefined}
              success={!fieldErrors.email && touched.email && email ? 'Email válido' : undefined}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
            
            <InputField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
              error={fieldErrors.password && touched.password ? fieldErrors.password : undefined}
              success={!fieldErrors.password && touched.password && password ? 'Contraseña válida' : undefined}
              placeholder="Tu contraseña"
              required
              disabled={loading}
              showPasswordStrength={touched.password && password.length > 0}
               passwordStrength={getPasswordStrength(password)}
            />
          </div>

          {/* Mensaje de error general */}
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error al iniciar sesión
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}



          <div>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md transition-all duration-200 ${
                loading || !isFormValid
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
          

        </form>
    </div>
  )
}