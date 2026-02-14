'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Trash2, Search, Gift, Filter } from 'lucide-react'

interface GiftTable {
  id: string
  event_name: string
  event_date: string
  event_type: string
  location?: string
  description?: string
  user_id: string
  slug?: string
  created_at?: string
}

interface ExtendedGiftTable extends GiftTable {
  itemsCount: number
  reservedCount: number
  ownerEmail?: string
  ownerName?: string
}

export default function RegistriesPage() {
  const [tables, setTables] = useState<ExtendedGiftTable[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    loadRegistries()
  }, [])

  const loadRegistries = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      // Get all gift tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('gift_tables')
        .select(`
          *,
          profiles!gift_tables_user_id_fkey(email, name)
        `)
        .order('created_at', { ascending: false })

      if (tablesError) throw tablesError

      // Get items count for each table
      const extendedTables: ExtendedGiftTable[] = await Promise.all(
        (tablesData || []).map(async (table: any) => {
          const { data: items } = await supabase
            .from('gift_table_items')
            .select('id, reserved')
            .eq('gift_table_id', table.id)

          const itemsCount = items?.length || 0
          const reservedCount = items?.filter(item => item.reserved).length || 0

          return {
            ...table,
            itemsCount,
            reservedCount,
            ownerEmail: table.profiles?.email,
            ownerName: table.profiles?.name
          }
        })
      )

      setTables(extendedTables)
    } catch (error) {
      console.error('Error loading registries:', error)
      alert('Error al cargar las mesas de regalos')
    }

    setLoading(false)
  }

  const handleDelete = async (table: ExtendedGiftTable) => {
    if (!confirm(`¿Eliminar la mesa "${table.event_name}"? Esto también eliminará todos sus items.`)) {
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')

      // Delete related items first
      await supabase
        .from('gift_table_items')
        .delete()
        .eq('gift_table_id', table.id)

      // Delete table
      const { error } = await supabase
        .from('gift_tables')
        .delete()
        .eq('id', table.id)

      if (error) throw error

      loadRegistries()
    } catch (error) {
      console.error('Error deleting registry:', error)
      alert('Error al eliminar la mesa')
    }
  }

  // Filter and paginate
  const filteredTables = tables.filter(table => {
    const matchesSearch =
      searchTerm === '' ||
      table.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || table.event_type === filterType

    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage)
  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const eventTypes = ['all', ...Array.from(new Set(tables.map(t => t.event_type)))]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
          Mesas de Regalos
        </h1>
        <p className="text-gray-600">
          Gestiona todas las mesas de regalos de la plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Todos los tipos' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total de Mesas</p>
          <p className="text-3xl font-bold text-gray-900">{tables.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total de Regalos</p>
          <p className="text-3xl font-bold text-gray-900">
            {tables.reduce((sum, t) => sum + t.itemsCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Reservados</p>
          <p className="text-3xl font-bold text-green-600">
            {tables.reduce((sum, t) => sum + t.reservedCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Tasa Promedio</p>
          <p className="text-3xl font-bold text-teal-600">
            {tables.length > 0
              ? Math.round(
                  (tables.reduce((sum, t) => sum + t.reservedCount, 0) /
                    Math.max(1, tables.reduce((sum, t) => sum + t.itemsCount, 0))) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : paginatedTables.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron mesas de regalos</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Propietario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reservados
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTables.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{table.event_name}</div>
                        {table.slug && (
                          <div className="text-xs text-gray-500 font-mono">/{table.slug}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{table.ownerName || '-'}</div>
                        <div className="text-xs text-gray-500">{table.ownerEmail || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {table.event_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(table.event_date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {table.itemsCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600">
                            {table.reservedCount}
                          </span>
                          {table.itemsCount > 0 && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({Math.round((table.reservedCount / table.itemsCount) * 100)}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/mesa/${table.id}`}
                          className="inline-flex items-center text-teal-600 hover:text-teal-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(table)}
                          className="inline-flex items-center text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTables.length)} de{' '}
                  {filteredTables.length} mesas
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
