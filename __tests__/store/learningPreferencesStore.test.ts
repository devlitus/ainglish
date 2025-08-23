import { useLearningPreferencesStore } from '@/store/learningPreferencesStore'
import { Topics } from '@/types/topics'
import { act, renderHook } from '@testing-library/react'

// Mock de zustand persist
jest.mock('zustand/middleware', () => ({
  persist: <T>(fn: T) => fn
}))

describe('LearningPreferencesStore', () => {
  beforeEach(() => {
    // Reset del store antes de cada test
    const { result } = renderHook(() => useLearningPreferencesStore())
    act(() => {
      result.current.clearPreferences()
    })
  })

  test('debe tener estado inicial correcto', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())

    expect(result.current.preferences.level).toBeNull()
    expect(result.current.preferences.topic).toBeNull()
    expect(typeof result.current.setLevel).toBe('function')
    expect(typeof result.current.setTopic).toBe('function')
    expect(typeof result.current.clearPreferences).toBe('function')
  })

  test('debe establecer nivel correctamente', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const testLevel = 'Beginner'

    act(() => {
      result.current.setLevel(testLevel)
    })

    expect(result.current.preferences.level).toBe(testLevel)
    expect(result.current.preferences.topic).toBeNull()
  })

  test('debe establecer topic correctamente', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const testTopic = Topics.TECHNOLOGY

    act(() => {
      result.current.setTopic(testTopic)
    })

    expect(result.current.preferences.topic).toBe(testTopic)
    expect(result.current.preferences.level).toBeNull()
  })

  test('debe establecer tanto nivel como topic', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const testLevel = 'Intermediate'
    const testTopic = Topics.BUSINESS

    act(() => {
      result.current.setLevel(testLevel)
      result.current.setTopic(testTopic)
    })

    expect(result.current.preferences.level).toBe(testLevel)
    expect(result.current.preferences.topic).toBe(testTopic)
  })

  test('debe actualizar nivel sin afectar topic existente', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const initialLevel = 'Beginner'
    const newLevel = 'Advanced'
    const testTopic = Topics.EDUCATION

    act(() => {
      result.current.setLevel(initialLevel)
      result.current.setTopic(testTopic)
    })

    expect(result.current.preferences.level).toBe(initialLevel)
    expect(result.current.preferences.topic).toBe(testTopic)

    act(() => {
      result.current.setLevel(newLevel)
    })

    expect(result.current.preferences.level).toBe(newLevel)
    expect(result.current.preferences.topic).toBe(testTopic)
  })

  test('debe actualizar topic sin afectar nivel existente', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const testLevel = 'Intermediate'
    const initialTopic = Topics.SPORT
    const newTopic = Topics.ENTERTAINMENT

    act(() => {
      result.current.setLevel(testLevel)
      result.current.setTopic(initialTopic)
    })

    expect(result.current.preferences.level).toBe(testLevel)
    expect(result.current.preferences.topic).toBe(initialTopic)

    act(() => {
      result.current.setTopic(newTopic)
    })

    expect(result.current.preferences.level).toBe(testLevel)
    expect(result.current.preferences.topic).toBe(newTopic)
  })

  test('debe limpiar todas las preferencias', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())
    const testLevel = 'Advanced'
    const testTopic = Topics.TRAVEL

    // Establecer valores
    act(() => {
      result.current.setLevel(testLevel)
      result.current.setTopic(testTopic)
    })

    expect(result.current.preferences.level).toBe(testLevel)
    expect(result.current.preferences.topic).toBe(testTopic)

    // Limpiar preferencias
    act(() => {
      result.current.clearPreferences()
    })

    expect(result.current.preferences.level).toBeNull()
    expect(result.current.preferences.topic).toBeNull()
  })

  test('debe manejar múltiples tipos de topics', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())

    const topicsToTest = [
      Topics.SPORT,
      Topics.EDUCATION,
      Topics.ENTERTAINMENT,
      Topics.BUSINESS,
      Topics.FOOD,
      Topics.TECHNOLOGY,
      Topics.TRAVEL,
      Topics.HEALTH
    ]

    topicsToTest.forEach(topic => {
      act(() => {
        result.current.setTopic(topic)
      })

      expect(result.current.preferences.topic).toBe(topic)
    })
  })

  test('debe convertir string a Topics enum en setTopic', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())

    act(() => {
      result.current.setTopic('Technology')
    })

    expect(result.current.preferences.topic).toBe('Technology')
  })

  test('debe mantener estado persistente después de múltiples cambios', () => {
    const { result } = renderHook(() => useLearningPreferencesStore())

    // Secuencia de cambios
    act(() => {
      result.current.setLevel('Beginner')
    })
    
    expect(result.current.preferences.level).toBe('Beginner')

    act(() => {
      result.current.setTopic(Topics.SPORT)
    })

    expect(result.current.preferences.level).toBe('Beginner')
    expect(result.current.preferences.topic).toBe(Topics.SPORT)

    act(() => {
      result.current.setLevel('Intermediate')
    })

    expect(result.current.preferences.level).toBe('Intermediate')
    expect(result.current.preferences.topic).toBe(Topics.SPORT)

    act(() => {
      result.current.setTopic(Topics.TECHNOLOGY)
    })

    expect(result.current.preferences.level).toBe('Intermediate')
    expect(result.current.preferences.topic).toBe(Topics.TECHNOLOGY)
  })
})
