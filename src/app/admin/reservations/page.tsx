'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, DollarSign, CheckCircle, XCircle, Package } from 'lucide-react'

interface Reservation {
  id: string
  gift_table_id: string
  gift_table_item_id: string
  buyer_name: string
  buyer_email: string
  amount: number
  payment_method: string
  payment_status: string
  created_at: string
  eventName?: string
  productName?: string
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      const { data: giftsData, error } = await supabase
        .from('gift_purchases')
        .select(`
          *,
          gift_tables!inner(event_name),
          gift_table_items!inner(
            products(name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const enrichedReservations = (giftsData || []).map((gift: any) => ({
        ...gift,
        eventName: gift.gift_tables?.event_name,
        productName: gift.gift_table_items?.products?.name
      }))

      setReservations(enrichedReservations)
    } catch (error) {
      console.error('Error loading reservations:', error)
      alert('Error al cargar las reservaciones')
    }

    setLoading(false)
  }

  // Filter and paginate
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch =
      searchTerm === '' ||
      reservation.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.buyer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.eventName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || reservation.payment_status === filterStatus

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalRevenue = reservations.reduce((sum, r) => sum + r.amount, 0)
  const completedCount = reservations.filter(r => r.payment_status === 'completed').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
          Reservaciones y Compras
        </h1>
        <p className="text-gray-600">
          Gestiona todas las reservaciones de regalos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Reservaciones</p>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{reservations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Completadas</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Ingresos Totales</p>
            <DollarSign className="w-5 h-5 text-teal-500" />
          </div>
          <p className="text-3xl font-bold text-teal-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Ticket Promedio</p>
            <DollarSign className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            ${reservations.length > 0 ? (totalRevenue / reservations.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : paginatedReservations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron reservaciones</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Comprador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Método
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reservation.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        <div className="text-xs text-gray-500">
                          {new Date(reservation.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.buyer_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {reservation.buyer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reservation.eventName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reservation.productName}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${reservation.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reservation.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : reservation.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {reservation.payment_status === 'completed' && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {reservation.payment_status === 'cancelled' && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {reservation.payment_status === 'completed'
                            ? 'Completado'
                            : reservation.payment_status === 'pending'
                            ? 'Pendiente'
                            : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {reservation.payment_method.replace('-', ' ')}
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
                  {Math.min(currentPage * itemsPerPage, filteredReservations.length)} de{' '}
                  {filteredReservations.length} reservaciones
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
