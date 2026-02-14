'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Type, FileText, Link as LinkIcon, Check, X, Loader2 } from 'lucide-react'

export default function CrearMesaPage() {
  const router = useRouter()
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    event_type: 'Boda',
    location: '',
    description: '',
    slug: ''
  })
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)

  // Generar slug automáticamente desde el nombre del evento
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .slice(0, 60) // Máximo 60 caracteres
  }

  // Verificar si el slug está disponible
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)

    if (isDemoMode) {
      const tables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
      const exists = tables.some((t: any) => t.slug === slug)
      setSlugAvailable(!exists)
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data } = await supabase
          .from('gift_tables')
          .select('id')
          .eq('slug', slug)
          .single()

        setSlugAvailable(!data)
      } catch (error) {
        setSlugAvailable(true) // Si hay error, asumimos que está disponible
      }
    }

    setCheckingSlug(false)
  }

  // Auto-generar slug cuando cambia el nombre del evento
  useEffect(() => {
    if (formData.event_name && !formData.slug) {
      const suggestedSlug = generateSlug(formData.event_name)
      setFormData(prev => ({ ...prev, slug: suggestedSlug }))
    }
  }, [formData.event_name])

  // Verificar disponibilidad cuando cambia el slug
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.slug) {
        checkSlugAvailability(formData.slug)
      }
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.event_name || !formData.event_date) {
      setError('Por favor completa todos los campos requeridos')
      setLoading(false)
      return
    }

    if (!formData.slug || formData.slug.length < 3) {
      setError('La URL personalizada debe tener al menos 3 caracteres')
      setLoading(false)
      return
    }

    if (slugAvailable === false) {
      setError('Esta URL ya está en uso. Por favor elige otra.')
      setLoading(false)
      return
    }

    try {
      if (isDemoMode) {
        const tables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
        const newTable = {
          id: `table-${Date.now()}`,
          user_id: user?.id,
          ...formData,
          created_at: new Date().toISOString()
        }
        tables.push(newTable)
        localStorage.setItem('demo_gift_tables', JSON.stringify(tables))

        alert('¡Mesa de regalos creada exitosamente!')
        router.push('/mis-mesas')
      } else {
        const { supabase } = await import('@/lib/supabase')
        const { data, error: supabaseError } = await supabase
          .from('gift_tables')
          .insert([{
            user_id: user?.id,
            ...formData
          }])
          .select()

        if (supabaseError) throw supabaseError

        alert('¡Mesa de regalos creada exitosamente!')
        router.push('/mis-mesas')
      }
    } catch (err) {
      console.error('Error creating gift table:', err)
      setError('Error al crear la mesa de regalos. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
            Stoja
          </Link>
          <Link href="/mis-mesas" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Mis Mesas
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
              Crear Mesa de Regalos
            </h1>
            <p className="text-gray-600">
              Completa los detalles de tu evento especial
            </p>
          </div>

          {isDemoMode && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Modo Demo:</strong> La mesa se guardará en tu navegador.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type className="w-4 h-4 inline mr-2" />
                  Nombre del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: Boda de María y Carlos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evento <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Boda">Boda</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Aniversario">Aniversario</option>
                  <option value="Graduación">Graduación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* URL Personalizada */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  URL Personalizada <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Esta será la dirección única de tu mesa de regalos. Elige algo fácil de recordar y compartir.
                </p>

                <div className="space-y-3">
                  {/* Preview de la URL */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Tu URL será:</p>
                    <p className="font-mono text-sm text-teal-600 break-all">
                      {typeof window !== 'undefined' && window.location.origin}/mesa/
                      <span className="font-bold">{formData.slug || 'tu-evento'}</span>
                    </p>
                  </div>

                  {/* Input del slug */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => {
                        const slug = generateSlug(e.target.value)
                        setFormData({ ...formData, slug })
                      }}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        slugAvailable === false
                          ? 'border-red-300 bg-red-50'
                          : slugAvailable === true
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="maria-y-carlos-boda-2025"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingSlug ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : slugAvailable === true ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : slugAvailable === false ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                  </div>

                  {/* Mensaje de disponibilidad */}
                  {slugAvailable === true && (
                    <p className="text-sm text-green-600 flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      ¡Esta URL está disponible!
                    </p>
                  )}
                  {slugAvailable === false && (
                    <p className="text-sm text-red-600 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      Esta URL ya está en uso. Intenta con otra.
                    </p>
                  )}

                  {/* Sugerencias */}
                  {formData.event_name && (
                    <div className="text-xs text-gray-600">
                      <p className="mb-2 font-medium">💡 Sugerencias:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          generateSlug(formData.event_name),
                          generateSlug(formData.event_name + ' ' + new Date(formData.event_date || Date.now()).getFullYear()),
                          generateSlug(formData.event_name + ' ' + formData.event_type)
                        ].filter((s, i, arr) => arr.indexOf(s) === i && s).slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData({ ...formData, slug: suggestion })}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-teal-300 transition-colors text-xs"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Ubicación (opcional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: Salón Los Jardines, Ciudad de México"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Describe tu evento especial..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Mesa de Regalos'}
                </button>
                <Link
                  href="/mis-mesas"
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
