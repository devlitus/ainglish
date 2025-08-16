import RegisterForm from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative">
      {/* Blue Radial Glow Background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`, 
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-blue-200">Únete a la comunidad de Ainglish</p>
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
    </div>
  )
}