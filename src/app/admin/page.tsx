'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import {
  Users,
  Gift,
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  Mail,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalTables: number
  totalGifts: number
  totalRevenue: number
  reservedGifts: number
  availableGifts: number
  recentActivity: any[]
  topProducts: any[]
  recentTables: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTables: 0,
    totalGifts: 0,
    totalRevenue: 0,
    reservedGifts: 0,
    availableGifts: 0,
    recentActivity: [],
    topProducts: [],
    recentTables: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadDashboardStats()
  }, [isAuthenticated, router])

  const loadDashboardStats = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      // Get user's tables
      const { data: tables } = await supabase
        .from('gift_tables')
        .select('*')
        .eq('user_id', user?.id)

      const tableIds = tables?.map(t => t.id) || []

      // Get items
      const { data: items } = await supabase
        .from('gift_table_items')
        .select('*')
        .in('gift_table_id', tableIds)

      const reservedItems = items?.filter(i => i.reserved) || []
      const availableItems = items?.filter(i => !i.reserved) || []

      // Get purchases
      const { data: purchases } = await supabase
        .from('gift_purchases')
        .select('*')
        .in('gift_table_id', tableIds)
        .order('created_at', { ascending: false })

      // Get payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)

      const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: usersCount || 0,
        totalTables: tables?.length || 0,
        totalGifts: items?.length || 0,
        totalRevenue,
        reservedGifts: reservedItems.length,
        availableGifts: availableItems.length,
        recentActivity: purchases?.slice(0, 5) || [],
        topProducts: [],
        recentTables: tables?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      alert('Error al cargar las estadísticas')
    }

    setLoading(false)
  }

  if (!isAuthenticated) {
    return null
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="ml-1">{trendValue}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
              Stoja
            </Link>
            <span className="text-sm text-gray-500">/ Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/mi-cuenta" className="text-gray-600 hover:text-gray-900">
              Mi Cuenta
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
            Bienvenido, {user?.name} 👋
          </h1>
          <p className="text-gray-600">
            Aquí está un resumen de tu plataforma de mesas de regalos
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Mesas de Regalos"
                value={stats.totalTables}
                icon={Gift}
                color="bg-gradient-to-br from-teal-500 to-cyan-500"
                trend="up"
                trendValue="12"
              />
              <StatCard
                title="Total de Regalos"
                value={stats.totalGifts}
                icon={Package}
                color="bg-gradient-to-br from-blue-500 to-indigo-500"
              />
              <StatCard
                title="Regalos Reservados"
                value={stats.reservedGifts}
                icon={CheckCircle}
                color="bg-gradient-to-br from-green-500 to-emerald-500"
                trend="up"
                trendValue="8"
              />
              <StatCard
                title="Ingresos Totales"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                icon={DollarSign}
                color="bg-gradient-to-br from-orange-500 to-red-500"
                trend="up"
                trendValue="23"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Tasa de Reserva</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalGifts > 0
                        ? Math.round((stats.reservedGifts / stats.totalGifts) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.reservedGifts} de {stats.totalGifts} regalos
                    </p>
                  </div>
                  <div className="w-24 h-24">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${stats.totalGifts > 0 ? (stats.reservedGifts / stats.totalGifts) * 100 : 0}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Disponibles</h3>
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.availableGifts}</p>
                <p className="text-sm text-gray-600 mt-1">Regalos sin reservar</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Usuarios</h3>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600 mt-1">Registrados en total</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-teal-500" />
                  Actividad Reciente
                </h3>
                {stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Gift className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.buyer_name} regaló un producto
                          </p>
                          <p className="text-sm text-gray-600">{activity.buyer_email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ${activity.amount.toFixed(2)} • {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay actividad reciente</p>
                  </div>
                )}
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Productos Más Regalados
                </h3>
                {stats.topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topProducts.map((product: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-700 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {product.count} veces regalado
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${product.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay productos regalados aún</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Tables */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-teal-500" />
                  Mis Mesas de Regalos
                </h3>
                <Link
                  href="/mis-mesas"
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Ver todas →
                </Link>
              </div>
              {stats.recentTables.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Evento
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ubicación
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentTables.map((table: any) => (
                        <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {table.event_name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {table.event_type}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(table.event_date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {table.location || '-'}
                          </td>
                          <td className="px-4 py-4 text-sm text-right">
                            <Link
                              href={`/mesa/${table.id}`}
                              className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">No tienes mesas de regalos aún</p>
                  <Link
                    href="/crear-mesa"
                    className="inline-block bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Crear Primera Mesa
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Link
                href="/crear-mesa"
                className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <Gift className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Crear Mesa de Regalos</h3>
                <p className="text-sm text-teal-100">Configura un nuevo evento</p>
              </Link>
              <Link
                href="/mis-mesas"
                className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <Package className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Gestionar Mesas</h3>
                <p className="text-sm text-blue-100">Ver y editar tus mesas</p>
              </Link>
              <Link
                href="/configurar"
                className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <TrendingUp className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Configuración</h3>
                <p className="text-sm text-purple-100">Supabase, Resend, PayPal</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
