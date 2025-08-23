import { renderHook, waitFor, act } from '@testing-library/react'
import { useTopics } from '@/hooks/useTopics'
import { Topics } from '@/types/topics'

// Para los tests, definimos una interfaz más flexible que Topic
interface TestTopic {
  id: string;
  title: string; // string en lugar de Topics enum para flexibilidad en tests
  description: string;
  icon: string;
  colorSchema: string;
}

// Mock de fetch global
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('useTopics Hook', () => {
  // Datos base para los tests
  const baseTopicsData = [
    {
      id: 1,
      title: 'Sport',
      description: 'Deportes y actividades físicas',
      icon: 'sport-icon',
      colorSchema: 'blue'
    },
    {
      id: 2,
      title: 'Education',
      description: 'Educación y aprendizaje',
      icon: 'education-icon',
      colorSchema: 'green'
    },
    {
      id: 3,
      title: 'Technology',
      description: 'Tecnología e innovación',
      icon: 'tech-icon',
      colorSchema: 'purple'
    }
  ]

  // Función helper para crear datos de API (simula el formato de la base de datos)
  const createApiTopicsData = (data = baseTopicsData) => 
    data.map(topic => ({
      ...topic,
      name: topic.title, // API usa 'name' en lugar de 'title'
      title: undefined // Eliminar title para simular formato API
    })).map(({ title, ...rest }) => rest)

  // Función helper para crear datos esperados (formato del hook)
  const createExpectedTopics = (data = baseTopicsData): TestTopic[] => 
    data.map(topic => ({
      ...topic,
      id: String(topic.id) // Convertir id a string
    }))

  // Datos que usaremos en los tests
  const mockTopicsData = createApiTopicsData()
  const expectedMappedTopics = createExpectedTopics()

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
      json: async () => ({ topics: mockTopicsData })
    } as Response)

    const { result } = renderHook(() => useTopics())

    expect(result.current.topics).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.refetch).toBe('function')
  })

  test('debe cargar topics exitosamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: mockTopicsData })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual(expectedMappedTopics)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith('/api/topic')
  })

  test('debe mapear correctamente los datos de la API', async () => {
    const apiDataWithTitle = [
      {
        id: 1,
        title: 'Business con title', // usando title en lugar de name
        description: 'Descripción de negocio',
        // sin icon y colorSchema definidos
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: apiDataWithTitle })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics[0]).toEqual({
      id: '1',
      title: 'Business con title',
      description: 'Descripción de negocio',
      icon: '', // debe asignar string vacío si no existe
      colorSchema: '' // debe asignar string vacío si no existe
    })
  })

  test('debe manejar respuesta con array vacío', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: [] })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe(null)
  })

  test('debe manejar respuesta sin campo topics', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}) // sin campo topics
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe(null)
  })

  test('debe manejar errores de respuesta HTTP', async () => {
    const errorMessage = 'Error al obtener los temas'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe(errorMessage)
  })

  test('debe manejar errores de respuesta HTTP sin mensaje de error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe('Error al obtener los temas')
  })

  test('debe manejar errores de fetch (red)', async () => {
    const networkError = new Error('Error de red')
    mockFetch.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe('Error de red')
  })

  test('debe manejar errores no-Error', async () => {
    mockFetch.mockRejectedValueOnce('String error')

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual([])
    expect(result.current.error).toBe('Error desconocido')
  })

  test('debe poder refetch los datos', async () => {
    // Primera llamada exitosa
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: mockTopicsData })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual(expectedMappedTopics)

    // Preparar segunda llamada con datos diferentes
    const newBaseTopicData = [{
      id: 4,
      title: 'Health',
      description: 'Salud y bienestar',
      icon: 'health-icon',
      colorSchema: 'red'
    }]

    const newMockData = createApiTopicsData(newBaseTopicData)
    const newExpectedData = createExpectedTopics(newBaseTopicData)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: newMockData })
    } as Response)

    // Llamar refetch dentro de act
    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual(newExpectedData)

    // Verificar que fetch fue llamado dos veces
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  test('debe logear errores en la consola', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const networkError = new Error('Error de red')
    mockFetch.mockRejectedValueOnce(networkError)

    renderHook(() => useTopics())

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching topics:', networkError)
    })

    consoleSpy.mockRestore()
  })

  test('debe llamar a fetch con la URL correcta', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: [] })
    } as Response)

    renderHook(() => useTopics())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/topic')
    })
  })

  test('debe convertir IDs numéricos a string', async () => {
    const testData = [{
      id: 456,
      title: 'Test Topic',
      description: 'Test description',
      icon: 'test-icon',
      colorSchema: 'test-color'
    }]

    const apiDataWithNumericId = createApiTopicsData(testData)
    const expectedData = createExpectedTopics(testData)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: apiDataWithNumericId })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toEqual(expectedData)
    expect(result.current.topics[0].id).toBe('456')
    expect(typeof result.current.topics[0].id).toBe('string')
  })

  test('debe manejar diferentes valores del enum Topics', async () => {
    const topicsWithEnumValues = [
      {
        id: 1,
        name: Topics.SPORT,
        description: 'Deportes',
        icon: 'sport',
        colorSchema: 'blue'
      },
      {
        id: 2,
        name: Topics.FOOD,
        description: 'Comida y bebida',
        icon: 'food',
        colorSchema: 'orange'
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ topics: topicsWithEnumValues })
    } as Response)

    const { result } = renderHook(() => useTopics())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.topics).toHaveLength(2)
    expect(result.current.topics[0].title).toBe(Topics.SPORT)
    expect(result.current.topics[1].title).toBe(Topics.FOOD)
  })
})
