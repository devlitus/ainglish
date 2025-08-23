import { GET } from '@/app/api/level/route'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn()
  }
}))

// Mock de NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn()
  }
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('/api/level route', () => {
  const mockLevelsData = [
    {
      id: 1,
      name: 'Principiante',
      description: 'Nivel básico',
      feature: 'Vocabulario básico',
      difficult: 'Fácil'
    },
    {
      id: 2,
      name: 'Intermedio',
      description: 'Nivel medio',
      feature: 'Gramática',
      difficult: 'Medio'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('debe retornar niveles exitosamente', async () => {
    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: mockLevelsData,
        error: null
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    await GET()

    expect(mockSupabase.from).toHaveBeenCalledWith('levels')
    expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*')
    expect(mockSupabaseQuery.order).toHaveBeenCalledWith('id', { ascending: true })
    expect(mockNextResponse.json).toHaveBeenCalledWith({ levels: mockLevelsData })
  })

  test('debe manejar errores de Supabase', async () => {
    const mockError = {
      message: 'Database connection failed',
      details: 'Connection timeout'
    }

    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: null,
        error: mockError
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await GET()

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching levels:', mockError)
    expect(mockNextResponse.json).toHaveBeenCalledWith(
      { error: 'Error al obtener los niveles' },
      { status: 500 }
    )

    consoleSpy.mockRestore()
  })

  test('debe manejar errores inesperados', async () => {
    const unexpectedError = new Error('Unexpected error')
    
    mockSupabase.from.mockImplementation(() => {
      throw unexpectedError
    })

    mockNextResponse.json.mockReturnValue({} as any)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await GET()

    expect(consoleSpy).toHaveBeenCalledWith('Unexpected error:', unexpectedError)
    expect(mockNextResponse.json).toHaveBeenCalledWith(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )

    consoleSpy.mockRestore()
  })

  test('debe retornar array vacío cuando no hay niveles', async () => {
    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: [],
        error: null
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    await GET()

    expect(mockNextResponse.json).toHaveBeenCalledWith({ levels: [] })
  })

  test('debe ordenar por id ascendente', async () => {
    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: mockLevelsData,
        error: null
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    await GET()

    expect(mockSupabaseQuery.order).toHaveBeenCalledWith('id', { ascending: true })
  })

  test('debe seleccionar todos los campos', async () => {
    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: mockLevelsData,
        error: null
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    await GET()

    expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*')
  })

  test('debe consultar la tabla correcta', async () => {
    const mockSupabaseQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: mockLevelsData,
        error: null
      })
    }

    mockSupabase.from.mockReturnValue(mockSupabaseQuery as any)
    mockNextResponse.json.mockReturnValue({} as any)

    await GET()

    expect(mockSupabase.from).toHaveBeenCalledWith('levels')
  })
})
