import { renderHook } from '@testing-library/react'
import { useLearningPreferences } from '@/hooks/useLearningPreferences'
import { useLearningPreferencesStore } from '@/store/learningPreferencesStore'
import { Topics } from '@/types/topics'

// Mock del store
jest.mock('@/store/learningPreferencesStore')

const mockUseLearningPreferencesStore = useLearningPreferencesStore as jest.MockedFunction<typeof useLearningPreferencesStore>

describe('useLearningPreferences Hook', () => {
  const mockStoreFunctions = {
    preferences: {
      level: null,
      topic: null
    },
    setLevel: jest.fn(),
    setTopic: jest.fn(),
    clearPreferences: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLearningPreferencesStore.mockReturnValue(mockStoreFunctions)
  })

  test('debe retornar las funciones y estado del store', () => {
    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.preferences).toEqual({
      level: null,
      topic: null
    })
    expect(result.current.setLevel).toBe(mockStoreFunctions.setLevel)
    expect(result.current.setTopic).toBe(mockStoreFunctions.setTopic)
    expect(result.current.clearPreferences).toBe(mockStoreFunctions.clearPreferences)
  })

  test('debe calcular correctamente isLevelSelected cuando level es null', () => {
    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isLevelSelected).toBe(false)
  })

  test('debe calcular correctamente isLevelSelected cuando level tiene valor', () => {
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: 'beginner',
        topic: null
      }
    })

    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isLevelSelected).toBe(true)
  })

  test('debe calcular correctamente isTopicSelected cuando topic es null', () => {
    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isTopicSelected).toBe(false)
  })

  test('debe calcular correctamente isTopicSelected cuando topic tiene valor', () => {
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: null,
        topic: Topics.TECHNOLOGY
      }
    })

    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isTopicSelected).toBe(true)
  })

  test('debe calcular correctamente isComplete cuando ambos valores son null', () => {
    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isComplete).toBe(false)
  })

  test('debe calcular correctamente isComplete cuando solo level tiene valor', () => {
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: 'intermediate',
        topic: null
      }
    })

    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isComplete).toBe(false)
  })

  test('debe calcular correctamente isComplete cuando solo topic tiene valor', () => {
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: null,
        topic: Topics.BUSINESS
      }
    })

    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isComplete).toBe(false)
  })

  test('debe calcular correctamente isComplete cuando ambos valores están definidos', () => {
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: 'advanced',
        topic: Topics.EDUCATION
      }
    })

    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current.isComplete).toBe(true)
  })

  test('debe retornar todas las propiedades esperadas', () => {
    const { result } = renderHook(() => useLearningPreferences())

    expect(result.current).toHaveProperty('preferences')
    expect(result.current).toHaveProperty('isLevelSelected')
    expect(result.current).toHaveProperty('isTopicSelected')
    expect(result.current).toHaveProperty('isComplete')
    expect(result.current).toHaveProperty('setLevel')
    expect(result.current).toHaveProperty('setTopic')
    expect(result.current).toHaveProperty('clearPreferences')
  })

  test('debe manejar cambios en el estado del store', () => {
    const { result, rerender } = renderHook(() => useLearningPreferences())

    // Estado inicial
    expect(result.current.isComplete).toBe(false)

    // Simular cambio en el store
    mockUseLearningPreferencesStore.mockReturnValue({
      ...mockStoreFunctions,
      preferences: {
        level: 'beginner',
        topic: Topics.SPORT
      }
    })

    rerender()

    expect(result.current.isComplete).toBe(true)
    expect(result.current.isLevelSelected).toBe(true)
    expect(result.current.isTopicSelected).toBe(true)
  })

  test('debe manejar diferentes combinaciones de nivel y topic', () => {
    const testCases = [
      { level: 'beginner', topic: Topics.TECHNOLOGY, expectedComplete: true },
      { level: 'intermediate', topic: null, expectedComplete: false },
      { level: null, topic: Topics.HEALTH, expectedComplete: false },
      { level: '', topic: Topics.TRAVEL, expectedComplete: true }, // String vacío no es null, por lo que isLevelSelected es true
      { level: 'advanced', topic: Topics.FOOD, expectedComplete: true }
    ]

    testCases.forEach(({ level, topic, expectedComplete }) => {
      mockUseLearningPreferencesStore.mockReturnValue({
        ...mockStoreFunctions,
        preferences: { level, topic }
      })

      const { result } = renderHook(() => useLearningPreferences())

      expect(result.current.isComplete).toBe(expectedComplete)
      expect(result.current.isLevelSelected).toBe(level !== null) // Solo verifica que no sea null
      expect(result.current.isTopicSelected).toBe(topic !== null)
    })
  })
})
