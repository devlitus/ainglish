// Mock de Supabase para testing

const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

// Mock del módulo supabase
jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient
}))

export { mockSupabaseClient }

// Helpers para configurar respuestas mock
export const mockSupabaseSuccess = <T>(data: T) => {
  mockSupabaseClient.from().single.mockResolvedValueOnce({
    data,
    error: null
  })
}

export const mockSupabaseError = (error: string) => {
  mockSupabaseClient.from().single.mockResolvedValueOnce({
    data: null,
    error: { message: error }
  })
}

export const mockSupabaseInsertSuccess = <T>(data: T) => {
  mockSupabaseClient.from().insert().select().single.mockResolvedValueOnce({
    data,
    error: null
  })
}

export const mockSupabaseInsertError = (error: string) => {
  mockSupabaseClient.from().insert().select().single.mockResolvedValueOnce({
    data: null,
    error: { message: error }
  })
}

export const mockSupabaseUpdateSuccess = <T>(data: T) => {
  mockSupabaseClient.from().update().eq().mockResolvedValueOnce({
    data,
    error: null
  })
}

// Reset de todos los mocks
export const resetSupabaseMocks = () => {
  jest.clearAllMocks()
}