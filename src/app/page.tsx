'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de login
    router.push('/login')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a Ainglish</h1>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </main>
  )
}
