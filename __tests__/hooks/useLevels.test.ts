import { renderHook, waitFor, act } from '@testing-library/react'
import { useLevels } from '@/hooks/useLevels'
import type { Level } from '@/types/level'

// Mock de fetch global
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('useLevels Hook', () => {
  // Datos base para los tests
  const baseLevelsData = [
    {
      id: 1,
      title: 'Principiante',
      description: 'Nivel básico para empezar',
      feature: 'Vocabulario básico',
      difficult: 'Fácil'
    },
    {
      id: 2,
      title: 'Intermedio',
      description: 'Nivel medio con más desafíos',
      feature: 'Gramática avanzada',
      difficult: 'Medio'
    },
    {
      id: 3,
      title: 'Avanzado',
      description: 'Nivel avanzado para expertos',
      feature: 'Conversación fluida',
      difficult: 'Difícil'
    }
  ]

  // Función helper para crear datos de API (simula el formato de la base de datos)
  const createApiLevelsData = (data = baseLevelsData) => 
    data.map(level => ({
      ...level,
      name: level.title, // API usa 'name' en lugar de 'title'
      title: undefined // Eliminar title para simular formato API
    })).map(({ title, ...rest }) => rest)

  // Función helper para crear datos esperados (formato del hook)
  const createExpectedLevels = (data = baseLevelsData): Level[] => 
    data.map(level => ({
      ...level,
      id: String(level.id) // Convertir id a string
    }))

  // Datos que usaremos en los tests
  const mockLevelsData = createApiLevelsData()
  const expectedMappedLevels = createExpectedLevels()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('debe inicializar con valores por defecto', () => {
    // Mock de respuesta exitosa
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: mockLevelsData })
    } as Response)

    const { result } = renderHook(() => useLevels())

    expect(result.current.levels).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.refetch).toBe('function')
  })

  test('debe cargar niveles exitosamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: mockLevelsData })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual(expectedMappedLevels)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith('/api/level')
  })

  test('debe mapear correctamente los datos de la API', async () => {
    const apiDataWithTitle = [
      {
        id: 1,
        title: 'Principiante con title', // usando title en lugar de name
        description: 'Descripción',
        difficult: 'Fácil'
        // sin feature definido
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: apiDataWithTitle })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels[0]).toEqual({
      id: '1',
      title: 'Principiante con title',
      description: 'Descripción',
      feature: '', // debe asignar string vacío si no existe
      difficult: 'Fácil'
    })
  })

  test('debe manejar respuesta con array vacío', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: [] })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe(null)
  })

  test('debe manejar respuesta sin campo levels', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}) // sin campo levels
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe(null)
  })

  test('debe manejar errores de respuesta HTTP', async () => {
    const errorMessage = 'Error al obtener los niveles'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe(errorMessage)
  })

  test('debe manejar errores de respuesta HTTP sin mensaje de error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe('Error al obtener los niveles')
  })

  test('debe manejar errores de fetch (red)', async () => {
    const networkError = new Error('Error de red')
    mockFetch.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe('Error de red')
  })

  test('debe manejar errores no-Error', async () => {
    mockFetch.mockRejectedValueOnce('String error')

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual([])
    expect(result.current.error).toBe('Error desconocido')
  })

  test('debe poder refetch los datos', async () => {
    // Primera llamada exitosa
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: mockLevelsData })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual(expectedMappedLevels)

    // Preparar segunda llamada con datos diferentes
    const newBaseLevelData = [{
      id: 4,
      title: 'Experto',
      description: 'Nivel experto',
      feature: 'Dominio completo',
      difficult: 'Muy difícil'
    }]

    const newMockData = createApiLevelsData(newBaseLevelData)
    const newExpectedData = createExpectedLevels(newBaseLevelData)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: newMockData })
    } as Response)

    // Llamar refetch dentro de act
    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual(newExpectedData)

    // Verificar que fetch fue llamado dos veces
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  test('debe logear errores en la consola', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const networkError = new Error('Error de red')
    mockFetch.mockRejectedValueOnce(networkError)

    renderHook(() => useLevels())

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching levels:', networkError)
    })

    consoleSpy.mockRestore()
  })

  test('debe llamar a fetch con la URL correcta', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: [] })
    } as Response)

    renderHook(() => useLevels())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/level')
    })
  })

  test('debe convertir IDs numéricos a string', async () => {
    const testData = [{
      id: 123,
      title: 'Test Level',
      description: 'Test description',
      feature: 'Test feature',
      difficult: 'Test'
    }]

    const apiDataWithNumericId = createApiLevelsData(testData)
    const expectedData = createExpectedLevels(testData)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ levels: apiDataWithNumericId })
    } as Response)

    const { result } = renderHook(() => useLevels())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.levels).toEqual(expectedData)
    expect(result.current.levels[0].id).toBe('123')
    expect(typeof result.current.levels[0].id).toBe('string')
  })
})
