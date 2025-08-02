import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error || !user) throw new Error('Usuario no encontrado')
  
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) throw new Error('Contraseña incorrecta')
  
  return { id: user.id, name: user.name, email: user.email }
}