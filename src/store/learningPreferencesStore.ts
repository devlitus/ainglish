import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LearningPreferences = {
  level: string | null
  topic: Topics | null
}

type LearningPreferencesState = {
  preferences: LearningPreferences
  setLevel: (level: string) => void
  setTopic: (topic: string) => void
  clearPreferences: () => void
}

export const useLearningPreferencesStore = create<LearningPreferencesState>()(
  persist(
    (set) => ({
      preferences: {
        level: null,
        topic: null
      },
      setLevel: (level: string) => {
        set((state) => ({
          preferences: { ...state.preferences, level }
        }))
      },
      setTopic: (topic: string) => {
        set((state) => ({
          preferences: { ...state.preferences, topic: topic as Topics }
        }))
      },
      clearPreferences: () => {
        set({
          preferences: { level: null, topic: null }
        })
      },
    }),
    {
      name: 'learning-preferences-storage',
    }
  )
)
