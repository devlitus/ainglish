import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Nombre y email son requeridos' },
      { status: 400 }
    )
  }

  const user = await createUser(name, email)
    
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