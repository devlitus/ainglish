# Implementación Simple de Autenticación

## 1. Cliente Supabase

**Archivo:** `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 2. Funciones de Autenticación

**Archivo:** `src/lib/auth.ts`
```typescript
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
```

## 3. Hook de Autenticación

**Archivo:** `src/hooks/useAuth.ts`
```typescript
'use client'
import { useState, useEffect, createContext, useContext } from 'react'

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
```

## 4. API Routes

**Archivo:** `src/app/api/auth/register/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const user = await createUser(name, email, password)
    
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 400 }
    )
  }
}
```

**Archivo:** `src/app/api/auth/login/route.ts`
```typescript
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al iniciar sesión' },
      { status: 401 }
    )
  }
}
```

## 5. Formularios

**Archivo:** `src/components/LoginForm.tsx`
```typescript
'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      login(data.user)
      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
```

**Archivo:** `src/components/RegisterForm.tsx`
```typescript
'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      login(data.user)
      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Nombre:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
```

## 6. Páginas

**Archivo:** `src/app/login/page.tsx`
```typescript
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        <LoginForm />
        <p className="text-center">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  )
}
```

**Archivo:** `src/app/register/page.tsx`
```typescript
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-2xl font-bold text-center">Registrarse</h1>
        <RegisterForm />
        <p className="text-center">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
```

## 7. Layout Principal

**Archivo:** `src/app/layout.tsx` (agregar AuthProvider)
```typescript
import { AuthProvider } from '@/hooks/useAuth'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## 8. Proteger Rutas

**Archivo:** `src/components/ProtectedRoute.tsx`
```typescript
'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

## 9. Uso en Páginas Protegidas

```typescript
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div>
        <h1>Bienvenido, {user?.name}!</h1>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    </ProtectedRoute>
  )
}
```

---

**¡Listo!** Con estos archivos tienes autenticación completa usando la tabla `public.users`.

**Pasos:**
1. Instalar dependencias: `npm install @supabase/supabase-js bcryptjs`
2. Configurar variables de entorno
3. Crear todos los archivos mostrados
4. Usar `<ProtectedRoute>` en páginas privadas
5. Usar `useAuth()` para acceder al usuario actual