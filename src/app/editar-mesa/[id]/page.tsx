'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Type, FileText, Link as LinkIcon, Check, X, Loader2, Save, Trash2 } from 'lucide-react'


export default function EditarMesaPage() {
  const router = useRouter()
  const params = useParams()
  const tableId = params.id as string
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    event_type: 'Boda',
    location: '',
    description: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadGiftTable()
  }, [isAuthenticated, router, tableId, isDemoMode, user])

  const loadGiftTable = async () => {
    setLoadingData(true)

    if (isDemoMode) {
      const tables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
      const table = tables.find((t: any) => t.id === tableId && t.user_id === user?.id)

      if (!table) {
        alert('Mesa de regalos no encontrada')
        router.push('/mis-mesas')
        return
      }

      setFormData({
        event_name: table.event_name,
        event_date: table.event_date,
        event_type: table.event_type,
        location: table.location || '',
        description: table.description || ''
      })
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase
          .from('gift_tables')
          .select('*')
          .eq('id', tableId)
          .eq('user_id', user?.id)
          .single()

        if (error || !data) {
          alert('Mesa de regalos no encontrada')
          router.push('/mis-mesas')
          return
        }

        setFormData({
          event_name: data.event_name,
          event_date: data.event_date,
          event_type: data.event_type,
          location: data.location || '',
          description: data.description || ''
        })
      } catch (err) {
        console.error('Error loading gift table:', err)
        alert('Error al cargar la mesa de regalos')
        router.push('/mis-mesas')
      }
    }

    setLoadingData(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.event_name || !formData.event_date) {
      setError('Por favor completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      if (isDemoMode) {
        const tables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
        const tableIndex = tables.findIndex((t: any) => t.id === tableId)

        if (tableIndex === -1) {
          throw new Error('Mesa no encontrada')
        }

        tables[tableIndex] = {
          ...tables[tableIndex],
          ...formData
        }

        localStorage.setItem('demo_gift_tables', JSON.stringify(tables))
        alert('¡Mesa de regalos actualizada exitosamente!')
        router.push('/mis-mesas')
      } else {
        const { supabase } = await import('@/lib/supabase')
        const { error: supabaseError } = await supabase
          .from('gift_tables')
          .update(formData)
          .eq('id', tableId)
          .eq('user_id', user?.id)

        if (supabaseError) throw supabaseError

        alert('¡Mesa de regalos actualizada exitosamente!')
        router.push('/mis-mesas')
      }
    } catch (err) {
      console.error('Error updating gift table:', err)
      setError('Error al actualizar la mesa de regalos. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
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
              Editar Mesa de Regalos
            </h1>
            <p className="text-gray-600">
              Actualiza los detalles de tu evento
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Save className="w-4 h-4 inline mr-2" />
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
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
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
