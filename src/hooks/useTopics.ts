'use client'
import { useState, useEffect } from 'react'
import type { Topic } from '@/types/topics'


interface UseTopicsReturn {
  topics: Topic[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTopics(): UseTopicsReturn {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/topic')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los temas')
      }

      const mappedTopics: Topic[] = (data.topics || []).map((topic: any) => ({
        id: String(topic.id), 
        title: topic.name || topic.title,
        description: topic.description,
        icon: topic.icon || '',
        colorSchema: topic.colorSchema || ''
      }))

      setTopics(mappedTopics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching topics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  return {
    topics,
    loading,
    error,
    refetch: fetchTopics
  }
}