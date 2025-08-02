# Plan de Testing Unitario - Ainglish

## Instalación

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## Scripts package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Configuración Jest

```javascript
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: { '^@/(.*)$': '<rootDir>/src/$1' }
}

module.exports = createJestConfig(customJestConfig)
```

## Estructura de Tests

```
__tests__/
├── components/
│   ├── ui/           # Button, Input
│   ├── forms/        # LoginForm, RegisterForm
│   └── layout/       # Header, Footer
├── lib/              # auth, validations
├── hooks/            # useLocalStorage
├── store/            # authStore
└── setup.ts
```

## Plan por Fases

### 📍 Fase 1: Configuración Base (Día 1-2)
- ✅ Configurar Jest y React Testing Library
- ✅ Crear setup.ts con configuración global
- ✅ Configurar mocks básicos (fetch, localStorage)

### 🔴 Fase 2: Tests Críticos (Día 3-5)
**Prioridad Alta - Funcionalidad Core**
- `authStore.test.ts`: login, logout, register, estado
- `auth.test.ts`: hashPassword, verifyPassword, createUser, loginUser
- `validations.test.ts`: validación email, password

### 🟡 Fase 3: Tests de Formularios (Día 6-8)
**Prioridad Media - UI Crítica**
- `LoginForm.test.tsx`: validación, envío, errores
- `RegisterForm.test.tsx`: validación, envío, errores
- `ProtectedRoute.test.tsx`: redirección, autenticación

### 🟢 Fase 4: Tests de Componentes (Día 9-10)
**Prioridad Baja - UI Base**
- `Button.test.tsx`: props, eventos, variantes
- `Input.test.tsx`: props, eventos, validación
- `useLocalStorage.test.ts`: get/set, error handling

## Mocking Simplificado

```typescript
// Mock fetch para formularios
global.fetch = jest.fn()

// Mock exitoso
(fetch as jest.Mock).mockResolvedValue({
  ok: true,
  json: async () => ({ user: { id: '1', email: 'test@test.com' } })
})

// Mock error
(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
```

## Comandos Esenciales

```bash
# Ejecutar todos los tests
npm test

# Watch mode para desarrollo
npm run test:watch

# Ver cobertura
npm run test:coverage

# Test específico
npm test LoginForm
```

## Objetivos de Cobertura

- **Fase 2**: 90% cobertura en funciones críticas
- **Fase 3**: 85% cobertura en formularios
- **Fase 4**: 80% cobertura general

---

**Meta**: Tests unitarios simples y efectivos con React Testing Library 🧪