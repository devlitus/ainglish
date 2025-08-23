'use client'
import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'white' | 'gray'
  fullScreen?: boolean
  className?: string
}

export function LoadingSpinner({
  message = 'Cargando...',
  size = 'md',
  color = 'blue',
  fullScreen = false,
  className = ''
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  
  const colorClasses = {
    blue: 'border-blue-400',
    white: 'border-white',
    gray: 'border-gray-400'
  }

  
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