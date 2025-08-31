import { RegisterForm } from '@/components/forms'
import { AuthRedirect } from '@/components/auth'

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-blue-200">Únete a Ainglish y comienza a aprender</p>
          </div>

          <RegisterForm />

          <p className="text-center text-blue-200">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </AuthRedirect>
  )
}