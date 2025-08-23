'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Ruta a la que redirigir si no está autenticado */
  redirectTo?: string
  /** Mensaje personalizado de carga */
  loadingMessage?: string
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Redirige a login si el usuario no está autenticado
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  loadingMessage = 'Verificando autenticación...'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    }
  }, [user, isLoading, router, redirectTo])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <LoadingSpinner 
        message={loadingMessage}
        fullScreen={true}
        color="blue"
      />
    )
  }

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null
  }

  // Si hay usuario, renderizar el contenido protegido
  return <>{children}</>
}