import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: levels, error } = await supabase
      .from('levels')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching levels:', error)
      return NextResponse.json(
        { error: 'Error al obtener los niveles' },
        { status: 500 }
      )
    }

    return NextResponse.json({ levels })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}