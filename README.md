# Ainglish - English Learning Platform

Una plataforma moderna para aprender inglés construida con Next.js, React, TypeScript y Supabase.

## 🚀 Características

- **Autenticación segura** con Supabase Auth
- **Interfaz moderna** con Tailwind CSS
- **Gestión de estado** con Zustand
- **Testing completo** con Jest y Testing Library
- **CI/CD automatizado** con GitHub Actions
- **Deployment automático** a Vercel

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Testing**: Jest, Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd ainglish
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm test` - Ejecuta los tests
- `npm run test:watch` - Ejecuta los tests en modo watch
- `npm run test:coverage` - Ejecuta los tests con reporte de cobertura

## 🚀 CI/CD Pipeline

El proyecto incluye tres workflows de GitHub Actions:

### 1. CI Pipeline (`ci.yml`)
- Se ejecuta en cada push y pull request
- Ejecuta tests en Node.js 18.x y 20.x
- Ejecuta linting y build
- Sube reportes de cobertura
- Despliega automáticamente desde `main`

### 2. Quality Checks (`quality-checks.yml`)
- Se ejecuta en pull requests
- Verifica calidad del código con ESLint
- Ejecuta verificación de TypeScript
- Genera reportes de cobertura
- Ejecuta auditoría de seguridad

### 3. Production Deploy (`deploy.yml`)
- Se ejecuta solo en push a `main`
- Despliega a producción en Vercel
- Incluye notificaciones de éxito/fallo

## 🔐 Variables de Entorno Requeridas

Para el deployment, configura estos secrets en GitHub:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_TOKEN
ORG_ID
PROJECT_ID
```

## 📁 Estructura del Proyecto

```
ainglish/
├── .github/
│   ├── workflows/          # GitHub Actions workflows
│   ├── ISSUE_TEMPLATE/     # Templates para issues
│   ├── dependabot.yml      # Configuración de Dependabot
│   └── pull_request_template.md
├── __tests__/              # Tests
├── app/                    # Next.js App Router
├── components/             # Componentes React
├── lib/                    # Utilidades y configuración
├── public/                 # Archivos estáticos
└── types/                  # Definiciones de TypeScript
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Usa TypeScript para todo el código
- Sigue las reglas de ESLint configuradas
- Escribe tests para nuevas funcionalidades
- Usa nombres descriptivos para variables y funciones
- Mantén los componentes pequeños y enfocados

## 🐛 Reportar Bugs

Usa los [issue templates](.github/ISSUE_TEMPLATE/) para reportar bugs o solicitar nuevas funcionalidades.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
