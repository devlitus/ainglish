# Reglas del Proyecto Ainglish

## 1. Framework y Dependencias

### Framework Principal
- **Next.js**: Versión 15.4.5
- **React**: Versión 19.1.0
- **React DOM**: Versión 19.1.0

### Dependencias de Desarrollo
- **TypeScript**: Versión ^5
- **Tailwind CSS**: Versión ^4 con PostCSS
- **ESLint**: Versión ^9 con configuración Next.js

### Comandos del Proyecto
- `npm run dev`: Desarrollo con Turbopack habilitado
- `npm run build`: Construcción para producción
- `npm run start`: Inicio del servidor de producción
- `npm run lint`: Verificación de código con ESLint

## 2. Framework de Testing

### Configuración Recomendada
- **Jest**: Para pruebas unitarias y de integración
- **React Testing Library**: Para pruebas de componentes React
- **Cypress** o **Playwright**: Para pruebas end-to-end
- **@testing-library/jest-dom**: Para matchers adicionales de DOM

### Estructura de Pruebas
```
__tests__/
├── components/
├── pages/
├── utils/
└── setup.ts
```

### Comandos de Testing (a implementar)
- `npm run test`: Ejecutar todas las pruebas
- `npm run test:watch`: Modo watch para desarrollo
- `npm run test:coverage`: Generar reporte de cobertura
- `npm run test:e2e`: Pruebas end-to-end

## 3. APIs y Patrones a Evitar

### APIs Deprecadas o No Recomendadas
- **No usar** `getInitialProps` - Usar `getServerSideProps` o `getStaticProps`
- **No usar** `next/head` directamente - Usar `next/head` con Metadata API de Next.js 13+
- **No usar** `React.FC` - Preferir declaraciones de función directas
- **Evitar** `any` en TypeScript - Usar tipos específicos

### Patrones de Código a Evitar
- **No usar** `console.log` en producción - Usar sistema de logging apropiado
- **Evitar** mutación directa de estado - Usar patrones inmutables
- **No usar** `dangerouslySetInnerHTML` sin sanitización
- **Evitar** imports absolutos sin configurar paths en tsconfig.json

### Buenas Prácticas de Seguridad
- **No exponer** claves API en el cliente
- **Validar** todas las entradas del usuario
- **Usar** variables de entorno para configuración sensible
- **Implementar** CSP (Content Security Policy)

## 4. Estructura de Archivos

### Organización Recomendada
```
src/
├── app/                 # App Router de Next.js 13+
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/          # Componentes reutilizables
├── lib/                 # Utilidades y configuraciones
├── types/               # Definiciones de tipos TypeScript
└── styles/              # Estilos adicionales
```

## 5. Convenciones de Código

### Naming Conventions
- **Componentes**: PascalCase (ej: `UserProfile.tsx`)
- **Archivos**: kebab-case para páginas, PascalCase para componentes
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### Estilo de Código
- Usar **ESLint** y **Prettier** para formateo consistente
- Máximo 80-100 caracteres por línea
- Usar **TypeScript strict mode**
- Documentar funciones complejas con JSDoc

## 6. Performance y Optimización

### Recomendaciones
- Usar **Image** component de Next.js para imágenes
- Implementar **lazy loading** para componentes pesados
- Usar **dynamic imports** para code splitting
- Optimizar **Core Web Vitals**

### Herramientas de Monitoreo
- **Next.js Bundle Analyzer** para análisis de bundle
- **Lighthouse** para auditorías de performance
- **Web Vitals** para métricas en tiempo real

---

*Última actualización: Diciembre 2024*
*Versión del proyecto: 0.1.0*