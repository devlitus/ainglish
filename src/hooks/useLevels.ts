'use client'
import { useState, useEffect } from 'react'

interface Level {
  id: number
  name: string
  description: string
  difficult: string
  icon: string
}

interface UseLevelsReturn {
  levels: Level[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useLevels(): UseLevelsReturn {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLevels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/level')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los niveles')
      }
      
      setLevels(data.levels || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching levels:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLevels()
  }, [])

  return {
    levels,
    loading,
    error,
    refetch: fetchLevels
  }
}