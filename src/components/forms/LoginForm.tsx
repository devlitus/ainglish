'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { validateEmail } from '@/lib/validations'
import { InputField } from '@/components/ui/ValidationMessage'

export default function LoginForm() {
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<{ email: boolean }>({ email: false })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validar solo el email en el momento del submit
    const emailValidation = validateEmail(email)

    // Si hay errores de validación, mostrarlos y detener el submit
    if (!emailValidation.isValid) {
      setFieldErrors({
        email: emailValidation.isValid ? undefined : emailValidation.errors?.[0]
      })
      setTouched({ email: true })
      setLoading(false)
      return
    }

    // Limpiar errores si la validación es exitosa
    setFieldErrors({ email: undefined })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      login(data.user)

      // Mostrar mensaje de éxito
      setSuccess(true)
      setError('')

      // Redirect al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.trim() !== ''

  return (
    <div className="space-y-6">

      <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            id="email-input"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email && touched.email ? fieldErrors.email : undefined}
            placeholder="tu@email.com"
            required
            disabled={loading}
          />
        </div>

        {/* Mensaje de error general */}
        {error && (
          <div id="login-error-message" className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
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

        {/* Mensaje de éxito */}
        {success && (
          <div id="login-success-message" className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  ¡Éxito!
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            id="login-submit-button"
            type="submit"
            disabled={success}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md transition-all duration-200 ${loading || !isFormValid || success
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
            {success ? '¡Éxito! Redirigiendo...' : loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>


      </form>
    </div>
  )
}