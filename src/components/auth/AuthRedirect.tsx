'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

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
      <LoadingSpinner 
        message="Verificando sesión..." 
        fullScreen={true}
        color="blue"
      />
    )
  }

  // If user is authenticated, don't render the auth page content
  // The redirect will happen via useEffect
  if (user) {
    return (
      <LoadingSpinner 
        message="Redirigiendo al dashboard..." 
        fullScreen={true}
        color="blue"
      />
    )
  }

  // If user is not authenticated, render the auth page content
  return <>{children}</>
}