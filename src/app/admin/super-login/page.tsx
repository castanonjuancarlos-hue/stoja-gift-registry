'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Lock, User } from 'lucide-react'

export default function SuperAdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Credenciales de super admin - case insensitive para el usuario
    const SUPER_ADMIN_EMAIL = 'storm@stoja.mx'
    const SUPER_ADMIN_PASSWORD = 'Storm@2024Admin'

    // Comparar usuario (case insensitive) y contraseña (case sensitive)
    const userMatch = username.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase()
    const passMatch = password === SUPER_ADMIN_PASSWORD

    console.log('Login attempt:', { user: username, userMatch, passMatch })

    // Debug: mostrar qué se está comparando
    console.log('Comparing:', {
      inputUser: username.toLowerCase().trim(),
      expectedUser: SUPER_ADMIN_EMAIL.toLowerCase(),
      inputPass: password,
      expectedPass: SUPER_ADMIN_PASSWORD
    })

    if (userMatch && passMatch) {
      // Guardar sesión de super admin
      localStorage.setItem('super_admin_session', JSON.stringify({
        email: SUPER_ADMIN_EMAIL,
        role: 'super_admin',
        loginTime: new Date().toISOString()
      }))

      // Usar window.location para redirección más confiable
      window.location.href = '/admin/super-dashboard'
    } else {
      setError(`Credenciales incorrectas. Usuario: ${userMatch ? '✓' : '✗'}, Contraseña: ${passMatch ? '✓' : '✗'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Super Administrador
          </h1>
          <p className="text-gray-400">
            Acceso restringido - Solo personal autorizado
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="storm@stoja.mx"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Verificando...' : 'Acceder al Panel'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              🔒 Conexión segura y encriptada<br />
              Todas las acciones son registradas
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  )
}
