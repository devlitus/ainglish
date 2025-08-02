import RegisterForm from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">Registrarse</h1>
        <RegisterForm />
        <p className="text-center">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}