import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const user = await createUser(name, email, password)
    
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}