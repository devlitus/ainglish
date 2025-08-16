import React from 'react'

interface ValidationMessageProps {
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
  show: boolean
  className?: string
}

export function ValidationMessage({ message, type, show, className = '' }: ValidationMessageProps) {
  if (!show || !message) return null

  const baseClasses = 'text-sm mt-1 transition-all duration-200 ease-in-out'
  const typeClasses = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }

  const iconClasses = {
    error: '⚠️',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className} flex items-center gap-1`}>
      <span className="text-xs">{iconClasses[type]}</span>
      <span>{message}</span>
    </div>
  )
}







interface InputFieldProps {
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  success?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean

  className?: string
}

export function InputField({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  required = false,
  disabled = false,

  className = ''
}: InputFieldProps) {
  const hasError = Boolean(error)
  const hasSuccess = Boolean(success) && !hasError
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : hasSuccess 
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
    dark:bg-gray-800 dark:border-gray-600 dark:text-white
    dark:focus:border-blue-400 dark:focus:ring-blue-400
  `

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
        />
        
        {/* Indicador visual de estado */}
        {(hasError || hasSuccess) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasError && (
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {hasSuccess && (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>
      
      {/* Mensajes de validación */}
      <ValidationMessage message={error || ''} type="error" show={hasError} />
      <ValidationMessage message={success || ''} type="success" show={hasSuccess} />
      

    </div>
  )
}