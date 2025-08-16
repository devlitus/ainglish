'use client'
import React from 'react'

interface LoadingSpinnerProps {
  /** Texto a mostrar debajo del spinner */
  message?: string
  /** Tamaño del spinner */
  size?: 'sm' | 'md' | 'lg'
  /** Color del spinner */
  color?: 'blue' | 'white' | 'gray'
  /** Si debe ocupar toda la pantalla */
  fullScreen?: boolean
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Componente reutilizable para mostrar un spinner de carga
 * con diferentes configuraciones y estilos
 */
export function LoadingSpinner({
  message = 'Cargando...',
  size = 'md',
  color = 'blue',
  fullScreen = false,
  className = ''
}: LoadingSpinnerProps) {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  // Configuración de colores
  const colorClasses = {
    blue: 'border-blue-400',
    white: 'border-white',
    gray: 'border-gray-400'
  }

  // Configuración de colores de texto
  const textColorClasses = {
    blue: 'text-blue-200',
    white: 'text-white',
    gray: 'text-gray-200'
  }

  const spinnerElement = (
    <div className={`text-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 mx-auto mb-4 ${
          sizeClasses[size]
        } ${colorClasses[color]}`}
      ></div>
      {message && (
        <p className={`text-sm ${textColorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default LoadingSpinner