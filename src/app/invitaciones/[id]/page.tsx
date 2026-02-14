'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, type Invitation, type Guest, type GiftTable } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft, Calendar, Clock, MapPin, Share2, Eye, Save, Palette, Users, Shirt,
  MessageSquare, Copy, Check, ExternalLink, Image as ImageIcon, Mail, Plus,
  Trash2, Send, Gift, CheckCircle, XCircle, HelpCircle, Edit2, Layout, Type,
  Images, Download, QrCode, X
} from 'lucide-react'

const DRESS_CODE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Traje oscuro / Vestido largo' },
  { value: 'semi-formal', label: 'Semi-formal', description: 'Traje / Vestido de cóctel' },
  { value: 'cocktail', label: 'Cóctel', description: 'Vestido corto / Traje sport' },
  { value: 'casual-elegante', label: 'Casual Elegante', description: 'Smart casual' },
  { value: 'casual', label: 'Casual', description: 'Ropa cómoda y elegante' },
  { value: 'tematico', label: 'Temático', description: 'Según el tema del evento' },
  { value: 'playa', label: 'Playa', description: 'Ropa ligera y fresca' },
  { value: 'garden-party', label: 'Garden Party', description: 'Elegante para exteriores' },
]

const THEME_OPTIONS = [
  { value: 'classic', label: 'Clásico', preview: 'bg-gradient-to-br from-stone-50 to-stone-200' },
  { value: 'romantic', label: 'Romántico', preview: 'bg-gradient-to-br from-rose-50 to-pink-200' },
  { value: 'modern', label: 'Moderno', preview: 'bg-gradient-to-br from-slate-50 to-gray-200' },
  { value: 'rustic', label: 'Rústico', preview: 'bg-gradient-to-br from-amber-50 to-orange-200' },
  { value: 'elegant', label: 'Elegante', preview: 'bg-gradient-to-br from-neutral-50 to-zinc-200' },
  { value: 'bohemian', label: 'Bohemio', preview: 'bg-gradient-to-br from-teal-50 to-emerald-200' },
  { value: 'tropical', label: 'Tropical', preview: 'bg-gradient-to-br from-green-50 to-lime-200' },
  { value: 'vintage', label: 'Vintage', preview: 'bg-gradient-to-br from-yellow-50 to-amber-100' },
  { value: 'minimalist', label: 'Minimalista', preview: 'bg-gradient-to-br from-white to-gray-100' },
  { value: 'luxury', label: 'Lujo', preview: 'bg-gradient-to-br from-yellow-100 to-amber-200' },
  { value: 'garden', label: 'Jardín', preview: 'bg-gradient-to-br from-green-100 to-emerald-200' },
  { value: 'beach', label: 'Playa', preview: 'bg-gradient-to-br from-cyan-50 to-blue-200' },
]

const TEMPLATE_OPTIONS = [
  { value: 'classic-wedding', label: 'Boda Clásica', theme: 'classic', primary: '#4a5568', secondary: '#f7fafc', font: 'serif' },
  { value: 'romantic-blush', label: 'Rosa Romántico', theme: 'romantic', primary: '#be185d', secondary: '#fdf2f8', font: 'script' },
  { value: 'modern-minimal', label: 'Moderno Minimal', theme: 'minimalist', primary: '#1f2937', secondary: '#ffffff', font: 'sans' },
  { value: 'rustic-charm', label: 'Encanto Rústico', theme: 'rustic', primary: '#92400e', secondary: '#fef3c7', font: 'serif' },
  { value: 'tropical-paradise', label: 'Paraíso Tropical', theme: 'tropical', primary: '#059669', secondary: '#ecfdf5', font: 'sans' },
  { value: 'beach-sunset', label: 'Atardecer Playa', theme: 'beach', primary: '#0891b2', secondary: '#ecfeff', font: 'sans' },
  { value: 'golden-luxury', label: 'Lujo Dorado', theme: 'luxury', primary: '#b45309', secondary: '#fffbeb', font: 'serif' },
  { value: 'garden-romance', label: 'Romance Jardín', theme: 'garden', primary: '#047857', secondary: '#f0fdf4', font: 'script' },
  { value: 'vintage-elegance', label: 'Elegancia Vintage', theme: 'vintage', primary: '#78350f', secondary: '#fef9c3', font: 'serif' },
  { value: 'boho-chic', label: 'Boho Chic', theme: 'bohemian', primary: '#0d9488', secondary: '#f0fdfa', font: 'sans' },
]

const COLOR_OPTIONS = [
  { value: '#0d9488', label: 'Teal' },
  { value: '#be185d', label: 'Rosa' },
  { value: '#7c3aed', label: 'Violeta' },
  { value: '#059669', label: 'Esmeralda' },
  { value: '#dc2626', label: 'Rojo' },
  { value: '#ca8a04', label: 'Dorado' },
  { value: '#1e40af', label: 'Azul' },
  { value: '#374151', label: 'Gris' },
  { value: '#7f1d1d', label: 'Borgoña' },
  { value: '#4c1d95', label: 'Púrpura' },
  { value: '#065f46', label: 'Verde Oscuro' },
  { value: '#1e3a5f', label: 'Azul Marino' },
]

export default function EditInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const invitationId = params.id as string
  const isNew = invitationId === 'nueva'

  const [activeTab, setActiveTab] = useState('detalles')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [giftTables, setGiftTables] = useState<GiftTable[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [showAddGuest, setShowAddGuest] = useState(false)
  const [sendingEmails, setSendingEmails] = useState(false)
  const [newGalleryImage, setNewGalleryImage] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)

  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', group_name: '', plus_ones: 0 })

  const [formData, setFormData] = useState<Partial<Invitation>>({
    title: 'Nuestra Boda',
    couple_names: '',
    event_date: '',
    event_time: '17:00',
    ceremony_venue: '',
    ceremony_address: '',
    reception_venue: '',
    reception_address: '',
    dress_code: 'formal',
    dress_code_details: '',
    message: '¡Estamos emocionados de compartir este día especial contigo!',
    rsvp_deadline: '',
    map_url: '',
    cover_image: '',
    gallery_images: [],
    theme: 'classic',
    primary_color: '#0d9488',
    secondary_color: '#f0fdfa',
    font_family: 'serif',
    template: '',
    gift_table_id: '',
    is_published: false,
    slug: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadGiftTables()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isNew && invitationId) {
      loadInvitation()
      loadGuests()
    }
  }, [invitationId, isNew])

  const loadInvitation = async () => {
    try {
      const { data, error } = await supabase.from('invitations').select('*').eq('id', invitationId).single()
      if (error) throw error
      if (data) setFormData(data)
    } catch (error) {
      console.error('Error loading invitation:', error)
    }
  }

  const loadGiftTables = async () => {
    try {
      const { data, error } = await supabase.from('gift_tables').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      if (error) throw error
      setGiftTables(data || [])
    } catch (error) {
      console.error('Error loading gift tables:', error)
    }
  }

  const loadGuests = async () => {
    try {
      const { data, error } = await supabase.from('guests').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: true })
      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error loading guests:', error)
    }
  }

  const generateSlug = (names: string) => names.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleChange = (field: keyof Invitation, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'couple_names' && typeof value === 'string') updated.slug = generateSlug(value)
      return updated
    })
  }

  const applyTemplate = (templateValue: string) => {
    const template = TEMPLATE_OPTIONS.find(t => t.value === templateValue)
    if (template) {
      setFormData(prev => ({
        ...prev, template: templateValue, theme: template.theme,
        primary_color: template.primary, secondary_color: template.secondary, font_family: template.font,
      }))
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const invitationData = { ...formData, user_id: user.id, updated_at: new Date().toISOString() }
      if (isNew) {
        invitationData.created_at = new Date().toISOString()
        const { data, error } = await supabase.from('invitations').insert([invitationData]).select().single()
        if (error) throw error
        router.push(`/invitaciones/${data.id}`)
      } else {
        const { error } = await supabase.from('invitations').update(invitationData).eq('id', invitationId)
        if (error) throw error
      }
      alert('Invitación guardada correctamente')
    } catch (error) {
      console.error('Error saving invitation:', error)
      alert('Error al guardar la invitación')
    } finally {
      setSaving(false)
    }
  }

  const addGuest = async () => {
    if (!newGuest.name || !newGuest.email) { alert('Por favor ingresa nombre y email'); return }
    try {
      const guestData = { ...newGuest, invitation_id: invitationId, invitation_sent: false, rsvp_status: 'pending', rsvp_guests: 0, created_at: new Date().toISOString() }
      const { data, error } = await supabase.from('guests').insert([guestData]).select().single()
      if (error) throw error
      setGuests(prev => [...prev, data])
      setNewGuest({ name: '', email: '', phone: '', group_name: '', plus_ones: 0 })
      setShowAddGuest(false)
    } catch (error) {
      console.error('Error adding guest:', error)
      alert('Error al agregar invitado')
    }
  }

  const deleteGuest = async (id: string) => {
    if (!confirm('¿Eliminar este invitado?')) return
    try {
      const { error } = await supabase.from('guests').delete().eq('id', id)
      if (error) throw error
      setGuests(prev => prev.filter(g => g.id !== id))
    } catch (error) {
      console.error('Error deleting guest:', error)
    }
  }

  const sendInvitationEmails = async (guestIds?: string[]) => {
    setSendingEmails(true)
    try {
      const guestsToSend = guestIds ? guests.filter(g => guestIds.includes(g.id)) : guests.filter(g => !g.invitation_sent)
      for (const guest of guestsToSend) {
        await supabase.from('guests').update({ invitation_sent: true, invitation_sent_at: new Date().toISOString() }).eq('id', guest.id)
      }
      await loadGuests()
      alert(`Invitaciones enviadas a ${guestsToSend.length} invitados`)
    } catch (error) {
      console.error('Error sending emails:', error)
      alert('Error al enviar invitaciones')
    } finally {
      setSendingEmails(false)
    }
  }

  const copyShareLink = () => {
    const link = `${window.location.origin}/invitacion/${formData.slug}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isAuthenticated) return null

  const confirmedGuests = guests.filter(g => g.rsvp_status === 'confirmed')
  const pendingGuests = guests.filter(g => g.rsvp_status === 'pending')
  const declinedGuests = guests.filter(g => g.rsvp_status === 'declined')
  const totalAttending = confirmedGuests.reduce((sum, g) => sum + g.rsvp_guests, 0)

  const addGalleryImage = () => {
    if (!newGalleryImage.trim()) return
    setFormData(prev => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), newGalleryImage.trim()]
    }))
    setNewGalleryImage('')
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, i) => i !== index)
    }))
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()

    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 400, 400)
        ctx.drawImage(img, 0, 0, 400, 400)
        const pngUrl = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `invitacion-${formData.slug || 'qr'}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const tabs = [
    { id: 'detalles', label: 'Detalles', icon: Calendar },
    { id: 'ubicacion', label: 'Ubicación', icon: MapPin },
    { id: 'dresscode', label: 'Dress Code', icon: Shirt },
    { id: 'galeria', label: 'Galería', icon: Images },
    { id: 'plantillas', label: 'Plantillas', icon: Layout },
    { id: 'diseno', label: 'Diseño', icon: Palette },
    { id: 'mesa', label: 'Mesa de Regalos', icon: Gift },
    { id: 'invitados', label: 'Invitados', icon: Users },
    { id: 'compartir', label: 'Compartir', icon: Share2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/mi-cuenta" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />Volver
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">{isNew ? 'Nueva Invitación' : 'Editar Invitación'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPreview(true)} className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Eye className="w-4 h-4 mr-2" />Vista Previa
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">
                <Save className="w-4 h-4 mr-2" />{saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <tab.icon className="w-4 h-4 mr-2" />{tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Detalles Tab */}
            {activeTab === 'detalles' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Detalles del Evento</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título de la Invitación</label>
                    <input type="text" value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Nuestra Boda" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombres de la Pareja</label>
                    <input type="text" value={formData.couple_names || ''} onChange={(e) => handleChange('couple_names', e.target.value)} placeholder="María & Juan" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-2" />Fecha del Evento</label>
                    <input type="date" value={formData.event_date || ''} onChange={(e) => handleChange('event_date', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="w-4 h-4 inline mr-2" />Hora del Evento</label>
                    <input type="time" value={formData.event_time || ''} onChange={(e) => handleChange('event_time', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-2" />Fecha Límite RSVP</label>
                  <input type="date" value={formData.rsvp_deadline || ''} onChange={(e) => handleChange('rsvp_deadline', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MessageSquare className="w-4 h-4 inline mr-2" />Mensaje Personal</label>
                  <textarea value={formData.message || ''} onChange={(e) => handleChange('message', e.target.value)} rows={4} placeholder="Escribe un mensaje especial..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Imagen de Portada (URL)</label>
                  <input type="url" value={formData.cover_image || ''} onChange={(e) => handleChange('cover_image', e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  {formData.cover_image && <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100"><img src={formData.cover_image} alt="Preview" className="w-full h-full object-cover" /></div>}
                </div>
              </div>
            )}

            {/* Ubicación Tab */}
            {activeTab === 'ubicacion' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Ubicación del Evento</h2>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-teal-900 mb-2">Ceremonia</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-teal-700 mb-1">Nombre del Lugar</label><input type="text" value={formData.ceremony_venue || ''} onChange={(e) => handleChange('ceremony_venue', e.target.value)} placeholder="Iglesia San José" className="w-full px-4 py-3 border border-teal-300 rounded-lg bg-white" /></div>
                    <div><label className="block text-sm text-teal-700 mb-1">Dirección</label><input type="text" value={formData.ceremony_address || ''} onChange={(e) => handleChange('ceremony_address', e.target.value)} placeholder="Av. Principal #123" className="w-full px-4 py-3 border border-teal-300 rounded-lg bg-white" /></div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-amber-900 mb-2">Recepción (Opcional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-amber-700 mb-1">Nombre del Lugar</label><input type="text" value={formData.reception_venue || ''} onChange={(e) => handleChange('reception_venue', e.target.value)} placeholder="Salón Las Palmas" className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-white" /></div>
                    <div><label className="block text-sm text-amber-700 mb-1">Dirección</label><input type="text" value={formData.reception_address || ''} onChange={(e) => handleChange('reception_address', e.target.value)} placeholder="Blvd. Los Jardines #456" className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-white" /></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-2" />Enlace de Google Maps</label>
                  <input type="url" value={formData.map_url || ''} onChange={(e) => handleChange('map_url', e.target.value)} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  {formData.map_url && <a href={formData.map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-3 text-teal-600 hover:text-teal-700"><ExternalLink className="w-4 h-4 mr-2" />Ver en Google Maps</a>}
                </div>
              </div>
            )}

            {/* Dress Code Tab */}
            {activeTab === 'dresscode' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Código de Vestimenta</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {DRESS_CODE_OPTIONS.map((option) => (
                    <button key={option.value} onClick={() => handleChange('dress_code', option.value)} className={`p-4 rounded-lg border-2 text-left transition-all ${formData.dress_code === option.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center mb-2"><Shirt className={`w-5 h-5 mr-2 ${formData.dress_code === option.value ? 'text-teal-600' : 'text-gray-400'}`} /><span className={`font-medium ${formData.dress_code === option.value ? 'text-teal-900' : 'text-gray-900'}`}>{option.label}</span></div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detalles Adicionales</label>
                  <textarea value={formData.dress_code_details || ''} onChange={(e) => handleChange('dress_code_details', e.target.value)} rows={3} placeholder="Ej: Colores sugeridos: tonos tierra. Evitar color blanco." className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none" />
                </div>
              </div>
            )}

            {/* Galería Tab */}
            {activeTab === 'galeria' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-2">Galería de Fotos</h2>
                  <p className="text-gray-600 mb-6">Agrega fotos de tu historia de amor para mostrar en la invitación.</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Images className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Agregar Imagen</h3>
                      <p className="text-gray-600 text-sm mb-4">Ingresa la URL de una imagen para agregarla a tu galería.</p>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={newGalleryImage}
                          onChange={(e) => setNewGalleryImage(e.target.value)}
                          placeholder="https://ejemplo.com/nuestra-foto.jpg"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                          onKeyPress={(e) => e.key === 'Enter' && addGalleryImage()}
                        />
                        <button
                          onClick={addGalleryImage}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {(formData.gallery_images?.length || 0) > 0 ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Imágenes en la galería ({formData.gallery_images?.length})</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.gallery_images?.map((img, index) => (
                        <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={img} alt={`Galería ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeGalleryImage(index)}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                              title="Eliminar imagen"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Images className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Sin fotos aún</h3>
                    <p className="text-gray-600">Agrega fotos de tu historia de amor para compartir con tus invitados.</p>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Tip:</strong> Usa imágenes de alta calidad en formato horizontal para mejor visualización.
                    Recomendamos entre 3 y 10 fotos para tu galería.
                  </p>
                </div>
              </div>
            )}

            {/* Plantillas Tab */}
            {activeTab === 'plantillas' && (
              <div className="space-y-6">
                <div><h2 className="text-2xl font-serif text-gray-900 mb-2">Plantillas Prediseñadas</h2><p className="text-gray-600 mb-6">Selecciona una plantilla para aplicar automáticamente tema, colores y tipografía.</p></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TEMPLATE_OPTIONS.map((template) => {
                    const themeData = THEME_OPTIONS.find(t => t.value === template.theme)
                    return (
                      <button key={template.value} onClick={() => applyTemplate(template.value)} className={`rounded-xl overflow-hidden border-2 transition-all text-left ${formData.template === template.value ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'}`}>
                        <div className={`h-32 flex items-center justify-center ${themeData?.preview || 'bg-gray-100'}`}>
                          <div className="text-center">
                            <p className={`text-2xl ${template.font === 'script' ? 'italic' : ''} ${template.font === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ color: template.primary }}>María & Juan</p>
                            <p className="text-sm text-gray-600 mt-1">15 de Junio, 2026</p>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <h3 className="font-medium text-gray-900">{template.label}</h3>
                          <div className="flex items-center gap-2 mt-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.primary }} /><span className="text-xs text-gray-500">{template.theme}</span></div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Diseño Tab */}
            {activeTab === 'diseno' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Personalizar Diseño</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Tema</label>
                  <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {THEME_OPTIONS.map((theme) => (
                      <button key={theme.value} onClick={() => handleChange('theme', theme.value)} className={`p-3 rounded-lg border-2 transition-all ${formData.theme === theme.value ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-full h-12 rounded-md mb-2 ${theme.preview}`} /><span className="text-xs font-medium text-gray-900">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4"><Type className="w-4 h-4 inline mr-2" />Tipografía</label>
                  <div className="flex flex-wrap gap-4">
                    {[{ value: 'serif', label: 'Serif', preview: 'font-serif' }, { value: 'sans', label: 'Sans Serif', preview: 'font-sans' }, { value: 'script', label: 'Script', preview: 'italic' }].map((font) => (
                      <button key={font.value} onClick={() => handleChange('font_family', font.value)} className={`px-6 py-4 rounded-lg border-2 transition-all ${formData.font_family === font.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <span className={`text-xl ${font.preview} block mb-1`}>Aa Bb Cc</span><span className="text-sm font-medium text-gray-900">{font.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Color Principal</label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_OPTIONS.map((color) => (
                      <button key={color.value} onClick={() => handleChange('primary_color', color.value)} className={`w-10 h-10 rounded-full transition-all ${formData.primary_color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.value }} title={color.label} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mesa de Regalos Tab */}
            {activeTab === 'mesa' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Conectar Mesa de Regalos</h2>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Gift className="w-6 h-6 text-teal-600" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Vincula tu Mesa de Regalos</h3>
                      <p className="text-gray-600 text-sm mb-4">Conecta tu invitación con tu mesa de regalos para que tus invitados puedan ver y reservar regalos.</p>
                      {giftTables.length > 0 ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona una Mesa</label>
                          <select value={formData.gift_table_id || ''} onChange={(e) => handleChange('gift_table_id', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                            <option value="">Sin mesa vinculada</option>
                            {giftTables.map((table) => (<option key={table.id} value={table.id}>{table.event_name} - {new Date(table.event_date).toLocaleDateString('es-MX')}</option>))}
                          </select>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-4 border border-teal-200">
                          <p className="text-gray-600 mb-3">No tienes mesas de regalos.</p>
                          <Link href="/crear-mesa" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"><Plus className="w-4 h-4 mr-2" />Crear Mesa</Link>
                        </div>
                      )}
                      {formData.gift_table_id && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-teal-200">
                          <div className="flex items-center text-teal-700"><CheckCircle className="w-5 h-5 mr-2" /><span>Mesa de regalos vinculada</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invitados Tab */}
            {activeTab === 'invitados' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-2xl font-serif text-gray-900">Gestión de Invitados</h2><p className="text-gray-600 text-sm mt-1">Administra tu lista y envía invitaciones por email</p></div>
                  {!isNew && <button onClick={() => setShowAddGuest(true)} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"><Plus className="w-4 h-4 mr-2" />Agregar</button>}
                </div>
                {isNew ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center"><HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" /><h3 className="font-semibold text-gray-900 mb-2">Guarda primero la invitación</h3><p className="text-gray-600">Para agregar invitados, primero debes guardar.</p></div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4"><div className="text-3xl font-bold text-gray-900">{guests.length}</div><div className="text-sm text-gray-600">Total invitados</div></div>
                      <div className="bg-green-50 rounded-xl p-4"><div className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2" /><span className="text-3xl font-bold text-green-700">{confirmedGuests.length}</span></div><div className="text-sm text-green-600">Confirmados ({totalAttending})</div></div>
                      <div className="bg-amber-50 rounded-xl p-4"><div className="flex items-center"><HelpCircle className="w-5 h-5 text-amber-600 mr-2" /><span className="text-3xl font-bold text-amber-700">{pendingGuests.length}</span></div><div className="text-sm text-amber-600">Pendientes</div></div>
                      <div className="bg-red-50 rounded-xl p-4"><div className="flex items-center"><XCircle className="w-5 h-5 text-red-600 mr-2" /><span className="text-3xl font-bold text-red-700">{declinedGuests.length}</span></div><div className="text-sm text-red-600">No asistirán</div></div>
                    </div>
                    {guests.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => sendInvitationEmails()} disabled={sendingEmails || guests.filter(g => !g.invitation_sent).length === 0} className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"><Send className="w-4 h-4 mr-2" />{sendingEmails ? 'Enviando...' : `Enviar (${guests.filter(g => !g.invitation_sent).length})`}</button>
                      </div>
                    )}
                    {guests.length > 0 ? (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">+</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Enviado</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th></tr></thead>
                          <tbody className="divide-y divide-gray-200">
                            {guests.map((guest) => (
                              <tr key={guest.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3"><div className="font-medium text-gray-900">{guest.name}</div>{guest.group_name && <div className="text-xs text-gray-500">{guest.group_name}</div>}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{guest.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{guest.plus_ones}</td>
                                <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-700' : guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{guest.rsvp_status === 'confirmed' ? 'Confirmado' : guest.rsvp_status === 'declined' ? 'No asistirá' : 'Pendiente'}</span></td>
                                <td className="px-4 py-3">{guest.invitation_sent ? <span className="text-xs text-green-600">Sí</span> : <span className="text-xs text-gray-400">No</span>}</td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {!guest.invitation_sent && <button onClick={() => sendInvitationEmails([guest.id])} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded" title="Enviar"><Send className="w-4 h-4" /></button>}
                                    <button onClick={() => deleteGuest(guest.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"><Users className="w-12 h-12 text-gray-400 mx-auto mb-4" /><h3 className="font-semibold text-gray-900 mb-2">No hay invitados</h3><p className="text-gray-600 mb-4">Agrega invitados para enviarles invitaciones.</p><button onClick={() => setShowAddGuest(true)} className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"><Plus className="w-4 h-4 mr-2" />Agregar</button></div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Compartir Tab */}
            {activeTab === 'compartir' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Compartir Invitación</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* URL Section */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL de tu invitación</label>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-600 overflow-hidden text-sm">
                          <span className="text-gray-400">{typeof window !== 'undefined' ? window.location.origin : ''}/invitacion/</span>
                          <span className="font-medium text-gray-900">{formData.slug || 'tu-invitacion'}</span>
                        </div>
                        <button onClick={copyShareLink} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                          {copied ? <><Check className="w-4 h-4 mr-2" />Copiado</> : <><Copy className="w-4 h-4 mr-2" />Copiar</>}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.is_published || false} onChange={(e) => handleChange('is_published', e.target.checked)} className="sr-only" />
                        <div className={`relative w-14 h-7 rounded-full transition-colors ${formData.is_published ? 'bg-teal-500' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.is_published ? 'translate-x-7' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="ml-3 font-medium text-gray-900">{formData.is_published ? 'Publicada' : 'Borrador'}</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => { const link = `${window.location.origin}/invitacion/${formData.slug}`; if (navigator.share) navigator.share({ title: formData.title, url: link }); else copyShareLink() }}
                        className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
                      >
                        <Share2 className="w-5 h-5 mr-2" />Compartir
                      </button>
                      <Link href={`/invitacion/${formData.slug}`} target="_blank" className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                        <ExternalLink className="w-5 h-5 mr-2" />Ver
                      </Link>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                    <div className="flex items-center gap-2 mb-4">
                      <QrCode className="w-5 h-5 text-violet-600" />
                      <h3 className="font-semibold text-gray-900">Código QR</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Escanea el código QR para abrir la invitación. Perfecto para imprimir o compartir.
                    </p>
                    <div className="bg-white rounded-xl p-4 flex items-center justify-center mb-4" ref={qrRef}>
                      <QRCodeSVG
                        value={`${typeof window !== 'undefined' ? window.location.origin : 'https://stoja.mx'}/invitacion/${formData.slug || 'preview'}`}
                        size={180}
                        level="H"
                        includeMargin={true}
                        fgColor={formData.primary_color || '#0d9488'}
                        bgColor="#ffffff"
                      />
                    </div>
                    <button
                      onClick={downloadQRCode}
                      className="w-full flex items-center justify-center px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar QR
                    </button>
                  </div>
                </div>

                {/* WhatsApp Sharing Tips */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-medium text-green-900 mb-2">Comparte por WhatsApp</h4>
                  <p className="text-green-800 text-sm">
                    Copia el enlace y compártelo directamente en WhatsApp. También puedes descargar el código QR
                    y enviarlo como imagen para que tus invitados lo escaneen fácilmente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Agregar Invitado</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label><input type="text" value={newGuest.name} onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Juan Pérez" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={newGuest.email} onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="juan@email.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label><input type="tel" value={newGuest.phone} onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="+52 123 456 7890" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label><input type="text" value={newGuest.group_name} onChange={(e) => setNewGuest(prev => ({ ...prev, group_name: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Familia" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Acompañantes</label><select value={newGuest.plus_ones} onChange={(e) => setNewGuest(prev => ({ ...prev, plus_ones: parseInt(e.target.value) }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowAddGuest(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button><button onClick={addGuest} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Agregar</button></div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"><h3 className="text-lg font-semibold">Vista Previa</h3><button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">✕</button></div>
            <div className="p-8" style={{ background: `linear-gradient(135deg, ${formData.secondary_color || '#f0fdfa'} 0%, white 100%)` }}>
              {formData.cover_image && <div className="aspect-video rounded-xl overflow-hidden mb-6"><img src={formData.cover_image} alt="Cover" className="w-full h-full object-cover" /></div>}
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">{formData.title || 'Nuestra Boda'}</p>
                <h2 className={`text-4xl mb-4 ${formData.font_family === 'serif' ? 'font-serif' : formData.font_family === 'script' ? 'italic' : 'font-sans'}`} style={{ color: formData.primary_color }}>{formData.couple_names || 'María & Juan'}</h2>
                <div className="flex items-center justify-center gap-4 text-gray-600 mb-6"><div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{formData.event_date ? new Date(formData.event_date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha'}</div><div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{formData.event_time || '17:00'}</div></div>
                <p className="text-gray-600 mb-6">{formData.message}</p>
                <div className="bg-white/80 rounded-xl p-4 mb-4"><div className="flex items-center justify-center mb-2"><MapPin className="w-4 h-4 mr-2" style={{ color: formData.primary_color }} /><span className="font-medium">{formData.ceremony_venue || 'Lugar'}</span></div><p className="text-sm text-gray-600">{formData.ceremony_address}</p></div>
                <div className="flex items-center justify-center gap-4">
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm" style={{ backgroundColor: `${formData.primary_color}20`, color: formData.primary_color }}><Shirt className="w-4 h-4 mr-2" />{DRESS_CODE_OPTIONS.find(d => d.value === formData.dress_code)?.label || 'Formal'}</div>
                  {formData.gift_table_id && <div className="inline-flex items-center px-4 py-2 rounded-full text-sm" style={{ backgroundColor: `${formData.primary_color}20`, color: formData.primary_color }}><Gift className="w-4 h-4 mr-2" />Mesa de Regalos</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
