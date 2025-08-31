import { RootLayout } from '@/components/layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ainglish - Aprende Inglés',
  description: 'Plataforma de aprendizaje de inglés personalizada',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  )
}