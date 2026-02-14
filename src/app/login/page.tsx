'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login, isDemoMode } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push('/planes')
    } else {
      setError(isDemoMode
        ? 'Email o contraseña incorrectos. Regístrate primero si no tienes cuenta.'
        : 'Email o contraseña incorrectos'
      )
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-cyan-300 to-blue-400 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-2">Stoja</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
          {isDemoMode && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium mb-1">🎭 Modo Demo Activado</p>
              <p className="text-yellow-700 text-xs">
                Puedes registrarte y usar la app sin configurar Supabase.
                Los datos se guardan en tu navegador.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-teal-600 hover:text-teal-700 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {isDemoMode && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm font-medium mb-2">💡 Consejo:</p>
            <p className="text-blue-800 text-xs mb-2">
              Como aún no has configurado Supabase, regístrate con cualquier email y contraseña para probar la app.
            </p>
            <p className="text-blue-700 text-xs">
              Para usar autenticación real, sigue la guía en <code className="bg-blue-100 px-1 rounded">SUPABASE_SETUP.md</code>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
