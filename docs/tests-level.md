# Tests Unitarios para Level

Este directorio contiene los tests unitarios completos para toda la funcionalidad relacionada con niveles (levels) en la aplicación Ainglish.

## Archivos de Test

### 1. `__tests__/hooks/useLevels.test.ts`

Tests para el hook personalizado que maneja el estado y las operaciones de niveles.

**Cobertura:**

- ✅ Inicialización con valores por defecto
- ✅ Carga exitosa de niveles desde la API
- ✅ Mapeo correcto de datos de API a formato del hook
- ✅ Manejo de respuestas vacías
- ✅ Manejo de errores HTTP (4xx, 5xx)
- ✅ Manejo de errores de red
- ✅ Función refetch para recargar datos
- ✅ Conversión de IDs numéricos a string
- ✅ Logging de errores en consola

**Características destacadas:**

- Uso de funciones helper para evitar duplicación de código
- Mocking correcto de fetch API
- Uso de `act()` para actualizaciones de estado de React
- Tests de casos edge (sin campo levels, errores no-Error, etc.)

### 2. `__tests__/types/level.test.ts`

Tests para validar la estructura del tipo `Level`.

**Cobertura:**

- ✅ Estructura correcta del tipo Level
- ✅ Tipos de datos de todas las propiedades
- ✅ Diferentes valores de dificultad
- ✅ Manejo de strings vacíos
- ✅ Diferentes formatos de ID (numérico, UUID, alfanumérico)

### 3. `__tests__/api/level/route.test.ts`

Tests para el endpoint API `/api/level`.

**Cobertura:**

- ✅ Retorno exitoso de niveles
- ✅ Manejo de errores de Supabase
- ✅ Manejo de errores inesperados
- ✅ Respuesta con array vacío
- ✅ Ordenamiento correcto (por ID ascendente)
- ✅ Selección de todos los campos
- ✅ Consulta a la tabla correcta

## Estructura de Datos

### Formato API (Base de datos)

```typescript
{
  id: number,
  name: string,        // Se mapea a 'title'
  description: string,
  feature: string,
  difficult: string
}
```

### Formato Hook (Frontend)

```typescript
{
  id: string,          // Convertido de number a string
  title: string,       // Mapeado desde 'name'
  description: string,
  feature: string,
  difficult: string
}
```

## Funciones Helper

### `createApiLevelsData(data)`

Convierte datos base al formato de API (simula respuesta de base de datos).

### `createExpectedLevels(data)`

Convierte datos base al formato esperado por el hook.

## Ejecución de Tests

```bash
# Ejecutar todos los tests de level
npm test -- --testPathPattern="level"

# Ejecutar test específico del hook
npm test -- __tests__/hooks/useLevels.test.ts

# Ejecutar test específico de tipos
npm test -- __tests__/types/level.test.ts

# Ejecutar test específico de API
npm test -- __tests__/api/level/route.test.ts
```

## Cobertura

Los tests cubren:

- ✅ Casos de éxito (happy path)
- ✅ Casos de error (error handling)
- ✅ Casos edge (datos faltantes, formatos incorrectos)
- ✅ Integración con APIs externas (Supabase)
- ✅ Transformación de datos (API ↔ Frontend)
- ✅ Validación de tipos TypeScript

## Notas Técnicas

- Los tests usan `@testing-library/react` para hooks
- Se mockean todas las dependencias externas (fetch, Supabase)
- Se usa `waitFor` para operaciones asíncronas
- Se implementa `act()` para actualizaciones de estado de React
- Los consoleSpy se restauran correctamente para evitar interferencias
