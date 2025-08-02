import { hashPassword, verifyPassword, createUser, loginUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

import bcrypt from 'bcryptjs'
const mockHash = bcrypt.hash as jest.MockedFunction<(data: string | Buffer, saltOrRounds: string | number) => Promise<string>>
const mockCompare = bcrypt.compare as jest.MockedFunction<(data: string | Buffer, encrypted: string) => Promise<boolean>>

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  },
}))

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'testpassword'
      const hashedPassword = 'hashedpassword123'
      
      mockHash.mockResolvedValue(hashedPassword)
      
      const result = await hashPassword(password)
      
      expect(mockHash).toHaveBeenCalledWith(password, 10)
      expect(result).toBe(hashedPassword)
    })
  })

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testpassword'
      const hash = 'hashedpassword123'
      
      mockCompare.mockResolvedValue(true)
      
      const result = await verifyPassword(password, hash)
      
      expect(mockCompare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'wrongpassword'
      const hash = 'hashedpassword123'
      
      mockCompare.mockResolvedValue(false)
      
      const result = await verifyPassword(password, hash)
      
      expect(result).toBe(false)
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword'
      }
      const hashedPassword = 'hashedpassword123'
      const createdUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      }

      mockHash.mockResolvedValue(hashedPassword)
      
      const mockSingle = jest.fn().mockResolvedValue({
        data: createdUser,
        error: null
      })
      const mockSelect = jest.fn(() => ({ single: mockSingle }))
      const mockInsert = jest.fn(() => ({ select: mockSelect }))
      ;(supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert })

      const result = await createUser(userData.name, userData.email, userData.password)

      expect(mockHash).toHaveBeenCalledWith(userData.password, 10)
      expect(supabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(createdUser)
    })

    it('should throw error if user creation fails', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword'
      }
      const error = new Error('Email already exists')

      mockHash.mockResolvedValue('hashedpassword123')
      
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error
      })
      const mockSelect = jest.fn(() => ({ single: mockSingle }))
      const mockInsert = jest.fn(() => ({ select: mockSelect }))
      ;(supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert })

      await expect(createUser(userData.name, userData.email, userData.password))
        .rejects.toThrow('Email already exists')
    })
  })

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const email = 'test@example.com'
      const password = 'testpassword'
      const user = {
        id: '1',
        name: 'Test User',
        email,
        password: 'hashedpassword123'
      }

      const mockSingle = jest.fn().mockResolvedValue({
        data: user,
        error: null
      })
      const mockEq = jest.fn(() => ({ single: mockSingle }))
      const mockSelect = jest.fn(() => ({ eq: mockEq }))
      ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })
      
      mockCompare.mockResolvedValue(true)

      const result = await loginUser(email, password)

      expect(supabase.from).toHaveBeenCalledWith('users')
      expect(mockCompare).toHaveBeenCalledWith(password, user.password)
      expect(result).toEqual({ id: user.id, name: user.name, email: user.email })
    })

    it('should throw error if user not found', async () => {
      const email = 'nonexistent@example.com'
      const password = 'testpassword'

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null
      })
      const mockEq = jest.fn(() => ({ single: mockSingle }))
      const mockSelect = jest.fn(() => ({ eq: mockEq }))
      ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })

      await expect(loginUser(email, password))
        .rejects.toThrow('Usuario no encontrado')
    })

    it('should throw error if password is incorrect', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'
      const user = {
        id: '1',
        name: 'Test User',
        email,
        password: 'hashedpassword123'
      }

      const mockSingle = jest.fn().mockResolvedValue({
        data: user,
        error: null
      })
      const mockEq = jest.fn(() => ({ single: mockSingle }))
      const mockSelect = jest.fn(() => ({ eq: mockEq }))
      ;(supabase.from as jest.Mock).mockReturnValue({ select: mockSelect })
      
      mockCompare.mockResolvedValue(false)

      await expect(loginUser(email, password))
        .rejects.toThrow('Contraseña incorrecta')
    })
  })
})