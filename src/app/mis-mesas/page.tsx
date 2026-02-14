'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Edit, Trash2, Eye } from 'lucide-react'

interface GiftTable {
  id: string
  event_name: string
  event_date: string
  event_type: string
  location?: string
  description?: string
  created_at?: string
}

export default function MisMesasPage() {
  const router = useRouter()
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const [giftTables, setGiftTables] = useState<GiftTable[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadGiftTables()
  }, [isAuthenticated, router, user])

  const loadGiftTables = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('gift_tables')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGiftTables(data || [])
    } catch (error) {
      console.error('Error loading gift tables:', error)
      alert('Error al cargar las mesas de regalos')
    }

    setLoading(false)
  }

  const handleDelete = async (tableId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mesa de regalos?')) {
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('gift_tables')
        .delete()
        .eq('id', tableId)

      if (error) throw error
      loadGiftTables()
    } catch (error) {
      console.error('Error deleting gift table:', error)
      alert('Error al eliminar la mesa de regalos')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800 hover:text-teal-600 transition-colors">
            Stoja
          </Link>
          <Link href="/mi-cuenta" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Mi Cuenta
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
                Mis Mesas de Regalos
              </h1>
              <p className="text-gray-600">
                Gestiona tus eventos y mesas de regalos
              </p>
            </div>
            <Link
              href="/crear-mesa"
              className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Mesa
            </Link>
          </div>

          {isDemoMode && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Modo Demo:</strong> Las mesas se guardan en tu navegador.
                Configura Supabase para guardar en la nube.
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              <p className="mt-4 text-gray-600">Cargando mesas...</p>
            </div>
          ) : giftTables.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-serif text-gray-900 mb-4">
                No tienes mesas de regalos
              </h2>
              <p className="text-gray-600 mb-8">
                Crea tu primera mesa de regalos para tu evento especial
              </p>
              <Link
                href="/crear-mesa"
                className="inline-block bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Crear Primera Mesa
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                      {table.event_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{table.event_type}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(table.event_date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {table.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {table.location}
                        </div>
                      )}
                    </div>

                    {table.description && (
                      <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                        {table.description}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/mesa/${table.id}`}
                        className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                      <Link
                        href={`/editar-mesa/${table.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(table.id)}
                        className="bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
