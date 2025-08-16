'use client'
import React from 'react'

/**
 * Componente Footer de la aplicación
 * Contiene información de copyright y enlaces útiles
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ainglish</h3>
            <p className="text-gray-400 text-sm">
              Plataforma de aprendizaje de inglés diseñada para 
              ayudarte a dominar el idioma de manera efectiva.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h4 className="text-white font-medium mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/dashboard" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/lessons" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Lecciones
                </a>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-white font-medium mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-gray-400 text-sm text-center">
            © {currentYear} Ainglish. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}