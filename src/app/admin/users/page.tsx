'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, UserPlus, X, Mail, Calendar, Crown } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  plan: string
  created_at: string
  tablesCount?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    plan: 'free'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get tables count for each user
      const enrichedUsers = await Promise.all(
        (usersData || []).map(async (user: any) => {
          const { count } = await supabase
            .from('gift_tables')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

          return {
            ...user,
            tablesCount: count || 0
          }
        })
      )

      setUsers(enrichedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      alert('Error al cargar los usuarios')
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.name) {
      alert('Por favor completa los campos requeridos')
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')

      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            plan: formData.plan
          })
          .eq('id', editingUser.id)

        if (error) throw error
        alert('Usuario actualizado')
        loadUsers()
      } else {
        // In production, you'd use Supabase Auth to create users
        alert('La creación de usuarios requiere integración con Supabase Auth')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error al guardar el usuario')
    }

    setShowModal(false)
    setEditingUser(null)
    setFormData({ email: '', name: '', plan: 'free' })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      plan: user.plan
    })
    setShowModal(true)
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`¿Eliminar al usuario "${user.name}"? Esto también eliminará todas sus mesas de regalos.`)) {
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')

      // Delete user's tables first
      await supabase
        .from('gift_tables')
        .delete()
        .eq('user_id', user.id)

      // Delete user
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar el usuario')
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ email: '', name: '', plan: 'free' })
    setShowModal(true)
  }

  // Filter and paginate
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan

    return matchesSearch && matchesPlan
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const planCounts = {
    free: users.filter(u => u.plan === 'free').length,
    basic: users.filter(u => u.plan === 'basic').length,
    premium: users.filter(u => u.plan === 'premium').length
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra todos los usuarios de la plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
            <button
              onClick={openCreateModal}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total de Usuarios</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Plan Free</p>
          <p className="text-3xl font-bold text-gray-600">{planCounts.free}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Plan Basic</p>
          <p className="text-3xl font-bold text-teal-600">{planCounts.basic}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Plan Premium</p>
          <p className="text-3xl font-bold text-orange-600">{planCounts.premium}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mesas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'premium'
                              ? 'bg-orange-100 text-orange-800'
                              : user.plan === 'basic'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.plan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.tablesCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center text-teal-600 hover:text-teal-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de{' '}
                  {filteredUsers.length} usuarios
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-serif font-semibold text-gray-900">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'} Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
