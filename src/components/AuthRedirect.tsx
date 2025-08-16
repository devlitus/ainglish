'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Component that redirects authenticated users away from auth pages (login/register)
 * to the main application dashboard
 */
export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated and not loading, redirect to dashboard
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, don't render the auth page content
  // The redirect will happen via useEffect
  if (user) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, render the auth page content
  return <>{children}</>
}