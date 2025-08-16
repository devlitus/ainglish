'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

/**
 * Componente Header principal de la aplicación
 * Incluye navegación y opciones de usuario
 */
export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-[#0f172a] border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">
            Ainglish
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="/dashboard" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Dashboard
          </a>
          <a 
            href="/lessons" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Lecciones
          </a>
        </nav>

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">
              Hola, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}