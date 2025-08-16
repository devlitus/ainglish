'use client'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  /** Si el sidebar está abierto (para móviles) */
  isOpen?: boolean
  /** Función para cerrar el sidebar */
  onClose?: () => void
}

/**
 * Componente Sidebar para navegación lateral
 * Responsive y colapsable en dispositivos móviles
 */
export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNavigation = (path: string, item: string) => {
    setActiveItem(item)
    router.push(path)
    if (onClose) onClose() // Cerrar sidebar en móviles
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: '📊'
    },
    {
      id: 'lessons',
      label: 'Lecciones',
      path: '/lessons',
      icon: '📚'
    },
    {
      id: 'progress',
      label: 'Progreso',
      path: '/progress',
      icon: '📈'
    },
    {
      id: 'profile',
      label: 'Perfil',
      path: '/profile',
      icon: '👤'
    }
  ]

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#0f172a] border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Ainglish</h2>
              <button 
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {user && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Bienvenido,</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path, item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      text-left transition-colors duration-200
                      ${
                        activeItem === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                       text-gray-300 hover:bg-red-600 hover:text-white
                       transition-colors duration-200"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}