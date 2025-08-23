import { useLearningPreferencesStore } from "@/store/learningPreferencesStore"

export const useLearningPreferences = () => {
  const { preferences, setLevel, setTopic, clearPreferences } = useLearningPreferencesStore()
  // Aquí puedes agregar lógica adicional en el futuro:
  const isLevelSelected = preferences.level !== null
  const isTopicSelected = preferences.topic !== null
  const isComplete = isLevelSelected && isTopicSelected
  
  return { preferences, isLevelSelected, isTopicSelected, isComplete, setLevel, setTopic, clearPreferences }
}