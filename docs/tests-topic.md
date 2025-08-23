# Tests Unitarios - Topic

Este documento describe la implementación de tests unitarios para la funcionalidad de topics en la aplicación Ainglish.

## Archivos de Prueba

### 1. `__tests__/hooks/useTopics.test.ts`

Tests para el custom hook `useTopics` que maneja la funcionalidad de obtener y gestionar temas de aprendizaje.

#### Cobertura de Tests:

- **Inicialización**: Verifica que el estado inicial del hook sea correcto
- **Obtención de datos**: Prueba la funcionalidad de fetch de topics desde la API
- **Mapeo de datos**: Verifica que los datos de la API se transformen correctamente
- **Manejo de errores**: Tests para diferentes tipos de errores (red, HTTP, tipo string)
- **Estados de carga**: Verifica el comportamiento del loading state
- **Gestión de estado**: Prueba la actualización correcta del estado del hook

#### Estructura de Tests:

```javascript
describe("useTopics", () => {
  describe("Inicialización", () => {
    // Test de estado inicial
  });

  describe("Obtención de topics", () => {
    // Tests de éxito en fetch
    // Tests de transformación de datos
  });

  describe("Manejo de errores", () => {
    // Tests de diferentes tipos de errores
  });

  describe("Estados de carga", () => {
    // Tests de loading states
  });
});
```

#### Helpers utilizados:

- **createApiTopicsData()**: Genera datos de prueba que simulan la respuesta de la API
- **createExpectedTopics()**: Genera los datos esperados después de la transformación
- **TestTopic interface**: Interfaz flexible para testing que permite usar tanto strings como enum values

### 2. `__tests__/types/topics.test.ts`

Tests para validar la estructura de tipos de TypeScript relacionados con topics.

#### Cobertura de Tests:

- **Topics enum**: Verifica que todos los valores del enum estén presentes
- **Topic interface**: Valida la estructura y tipos de la interfaz Topic
- **Validación de datos**: Tests para verificar que los objetos cumplen con la interfaz

#### Tests implementados:

```javascript
describe("Topics Types", () => {
  describe("Topics enum", () => {
    // Verifica existencia de valores específicos
    // Cuenta total de valores en el enum
    // Validación de strings específicos
  });

  describe("Topic interface", () => {
    // Validación de estructura de objeto válido
    // Tests de propiedades requeridas
    // Validación de tipos
  });
});
```

### 3. `__tests__/api/topic/route.test.ts`

Tests para el endpoint de API `/api/topic` que maneja las operaciones CRUD de topics.

#### Cobertura de Tests:

- **GET requests**: Prueba la obtención de todos los topics
- **Respuestas de API**: Verifica formato y estructura de respuestas
- **Manejo de errores**: Tests para errores de base de datos
- **Validación de datos**: Verifica que los datos devueltos tengan el formato correcto

## Mejoras Implementadas

### 1. Importación de Enum

Se implementó la importación directa del enum `Topics` desde `@/types/topics` en lugar de duplicar los valores en los tests:

```typescript
// Antes (duplicación)
const expectedTopics = [
  "Business",
  "Technology",
  "Travel",
  // ...
];

// Después (importación)
import { Topics } from "@/types/topics";
const expectedTopicValues = Object.values(Topics);
```

### 2. Conversion de .d.ts a .ts

Se convirtió `src/types/topics.d.ts` a `src/types/topics.ts` para permitir la exportación e importación de tipos:

```typescript
// topics.ts
export enum Topics {
  BUSINESS = "Business",
  TECHNOLOGY = "Technology",
  // ...
}

export interface Topic {
  id: string;
  name: string;
  // ...
}
```

### 3. Flexibilidad en Testing

Se creó una interfaz `TestTopic` que permite usar tanto strings como valores de enum en los tests:

```typescript
interface TestTopic {
  id: string;
  name: string | Topics; // Permite ambos tipos
  description: string;
  level: string;
  color: string;
}
```

## Estadísticas de Tests

### Topics Hook Tests: 14 tests

- ✅ Inicialización: 2 tests
- ✅ Obtención exitosa: 4 tests
- ✅ Manejo de errores: 4 tests
- ✅ Estados de carga: 4 tests

### Topics Types Tests: 10 tests

- ✅ Enum validation: 6 tests
- ✅ Interface validation: 4 tests

### Topics API Tests: 9 tests

- ✅ Respuestas exitosas: 4 tests
- ✅ Manejo de errores: 3 tests
- ✅ Validación de estructura: 2 tests

**Total: 33 tests para funcionalidad de Topics**

## Tecnologías Utilizadas

- **Jest**: Framework de testing
- **@testing-library/react**: Utilidades para testing de React hooks
- **TypeScript**: Validación de tipos en tiempo de compilación
- **MSW (Mock Service Worker)**: Para mocking de APIs (implícito en fetch mocks)

## Comandos de Ejecución

```bash
# Ejecutar todos los tests de topics
npm test -- --testPathPattern="topic"

# Ejecutar solo el hook
npm test -- __tests__/hooks/useTopics.test.ts

# Ejecutar solo los tipos
npm test -- __tests__/types/topics.test.ts

# Ejecutar solo la API
npm test -- __tests__/api/topic/route.test.ts

# Ejecutar con coverage
npm test -- --coverage --testPathPattern="topic"
```

## Mejores Prácticas Aplicadas

1. **DRY (Don't Repeat Yourself)**: Uso de helpers para evitar duplicación de código
2. **Type Safety**: Importación directa de enums en lugar de duplicar valores
3. **Organización**: Tests agrupados por funcionalidad y responsabilidad
4. **Cobertura Completa**: Tests para casos de éxito, error y edge cases
5. **Flexibilidad**: Interfaces que permiten diferentes formatos de datos en testing

## Mantenimiento

Los tests están diseñados para ser mantenibles y escalables:

- Los helpers pueden reutilizarse en futuros tests
- La importación de tipos asegura consistencia automática
- La estructura modular facilita agregar nuevos casos de prueba
- Los mocks están aislados y son predecibles
