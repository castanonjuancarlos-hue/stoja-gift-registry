'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { User, CreditCard, Gift, Calendar, Settings, Mail, Plus, Edit, Eye, Share2, Trash2, MapPin, Clock, Shirt } from 'lucide-react'
import { supabase, type Invitation } from '@/lib/supabase'

export default function MiCuentaPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user?.id) {
      loadInvitations()
    }
  }, [user?.id])

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvitations(data || [])
    } catch (error) {
      console.error('Error loading invitations:', error)
      // Demo data if Supabase is not configured
      setInvitations([])
    } finally {
      setLoading(false)
    }
  }

  const deleteInvitation = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta invitación?')) return

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id)

      if (error) throw error
      setInvitations(prev => prev.filter(inv => inv.id !== id))
    } catch (error) {
      console.error('Error deleting invitation:', error)
    }
  }

  const copyShareLink = (slug: string) => {
    const link = `${window.location.origin}/invitacion/${slug}`
    navigator.clipboard.writeText(link)
    alert('Enlace copiado al portapapeles')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
            Stoja
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
              Mi Cuenta
            </h1>
            <p className="text-gray-600">Gestiona tu información y tus eventos</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {user?.plan && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="font-medium text-teal-900">
                    Plan Activo: {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </span>
                </div>
              </div>
            )}

            {!user?.plan && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-900 mb-3">No tienes un plan activo</p>
                <Link
                  href="/planes"
                  className="inline-block bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Ver Planes Disponibles
                </Link>
              </div>
            )}
          </div>

          {/* Invitations Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-rose-500 mr-3" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Mis Invitaciones</h2>
                  <p className="text-gray-600 text-sm">Crea y gestiona invitaciones digitales para tu evento</p>
                </div>
              </div>
              <Link
                href="/invitaciones/nueva"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Invitación
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
              </div>
            ) : invitations.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {invitation.cover_image && (
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img
                          src={invitation.cover_image}
                          alt={invitation.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-serif text-xl">{invitation.couple_names}</h3>
                        </div>
                      </div>
                    )}
                    {!invitation.cover_image && (
                      <div
                        className="aspect-video relative overflow-hidden flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${invitation.primary_color}20 0%, ${invitation.secondary_color} 100%)` }}
                      >
                        <div className="text-center p-4">
                          <h3 className="font-serif text-2xl" style={{ color: invitation.primary_color }}>
                            {invitation.couple_names || 'Sin nombre'}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{invitation.title}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {invitation.event_date ? new Date(invitation.event_date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Sin fecha'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {invitation.event_time || 'Sin hora'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1.5" />
                          <span className="truncate">{invitation.ceremony_venue || 'Sin ubicación'}</span>
                        </div>
                        <div className="flex items-center">
                          <Shirt className="w-4 h-4 mr-1.5" />
                          <span className="capitalize">{invitation.dress_code}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          invitation.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {invitation.is_published ? 'Publicada' : 'Borrador'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyShareLink(invitation.slug)}
                            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Compartir"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/invitacion/${invitation.slug}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver invitación"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/invitaciones/${invitation.id}`}
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteInvitation(invitation.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-dashed border-rose-200">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Crea tu primera invitación</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Diseña invitaciones digitales hermosas con fecha, ubicación, mapa, código de vestimenta y más.
                </p>
                <Link
                  href="/invitaciones/nueva"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Invitación
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/admin"
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg shadow-md p-6 hover-lift transition-smooth group"
            >
              <div className="bg-white/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-white/30 transition-colors">
                <Settings className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Dashboard Admin
              </h3>
              <p className="text-purple-100 text-sm">
                Estadísticas y análisis completo
              </p>
            </Link>

            <Link
              href="/mis-mesas"
              className="bg-white rounded-lg shadow-md p-6 hover-lift transition-smooth group border border-gray-200"
            >
              <Gift className="w-10 h-10 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mis Mesas de Regalos
              </h3>
              <p className="text-gray-600 text-sm">
                Ver y gestionar todas tus mesas
              </p>
            </Link>

            <Link
              href="/crear-mesa"
              className="bg-white rounded-lg shadow-md p-6 hover-lift transition-smooth group border border-gray-200"
            >
              <Calendar className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Crear Nueva Mesa
              </h3>
              <p className="text-gray-600 text-sm">
                Configura un nuevo evento
              </p>
            </Link>

            <Link
              href="/configurar"
              className="bg-white rounded-lg shadow-md p-6 hover-lift transition-smooth group border border-gray-200"
            >
              <Settings className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Configuración
              </h3>
              <p className="text-gray-600 text-sm">
                Supabase, Resend y PayPal
              </p>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-serif mb-4">¿Necesitas Ayuda?</h3>
            <p className="mb-6">
              Nuestro equipo está listo para ayudarte a crear el evento perfecto
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/soporte"
                className="bg-white text-teal-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contactar Soporte
              </Link>
              <Link
                href="/tutoriales"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Ver Tutoriales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
