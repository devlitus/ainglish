'use client'
import { ProtectedRoute } from '@/components/auth'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[#0f172a] relative">
        {/* Blue Radial Glow Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">
                ¡Bienvenido, {user?.name}!
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors backdrop-blur-sm"
              >
                Cerrar Sesión
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">
                  Perfil de Usuario
                </h2>
                <p className="text-blue-100">
                  <strong>Nombre:</strong> {user?.name}
                </p>
                <p className="text-blue-100">
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                <h2 className="text-xl font-semibold text-green-300 mb-2">
                  Lecciones
                </h2>
                <p className="text-green-100">
                  Accede a tus lecciones de inglés personalizadas.
                </p>
                <button className="mt-3 px-4 py-2 bg-green-500/80 text-white rounded hover:bg-green-600 transition-colors backdrop-blur-sm">
                  Ver Lecciones
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                <h2 className="text-xl font-semibold text-purple-300 mb-2">
                  Progreso
                </h2>
                <p className="text-purple-100">
                  Revisa tu progreso y estadísticas de aprendizaje.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-500/80 text-white rounded hover:bg-purple-600 transition-colors backdrop-blur-sm">
                  Ver Progreso
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}