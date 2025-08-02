'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/store/authStore'
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido, {user?.name}!
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                  Perfil de Usuario
                </h2>
                <p className="text-blue-700">
                  <strong>Nombre:</strong> {user?.name}
                </p>
                <p className="text-blue-700">
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-900 mb-2">
                  Lecciones
                </h2>
                <p className="text-green-700">
                  Accede a tus lecciones de inglés personalizadas.
                </p>
                <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  Ver Lecciones
                </button>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-purple-900 mb-2">
                  Progreso
                </h2>
                <p className="text-purple-700">
                  Revisa tu progreso y estadísticas de aprendizaje.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                  Ver Progreso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}