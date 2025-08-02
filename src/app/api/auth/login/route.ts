import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const user = await loginUser(email, password)
    
    return NextResponse.json({ user })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    )
  }
}