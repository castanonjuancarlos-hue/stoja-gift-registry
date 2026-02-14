'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Invitation } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Shirt,
  Heart,
  Gift,
  ExternalLink,
  ChevronDown,
  Images,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  QrCode,
  Copy,
  Check
} from 'lucide-react'

const DRESS_CODE_LABELS: Record<string, { label: string; description: string }> = {
  'formal': { label: 'Formal', description: 'Traje oscuro / Vestido largo' },
  'semi-formal': { label: 'Semi-formal', description: 'Traje / Vestido de cóctel' },
  'cocktail': { label: 'Cóctel', description: 'Vestido corto / Traje sport' },
  'casual-elegante': { label: 'Casual Elegante', description: 'Smart casual' },
  'casual': { label: 'Casual', description: 'Ropa cómoda y elegante' },
  'tematico': { label: 'Temático', description: 'Según el tema del evento' },
  'playa': { label: 'Playa', description: 'Ropa ligera y fresca' },
  'garden-party': { label: 'Garden Party', description: 'Elegante para exteriores' },
}

const THEME_STYLES: Record<string, string> = {
  'classic': 'from-stone-50 via-stone-100 to-stone-200',
  'romantic': 'from-rose-50 via-pink-50 to-rose-100',
  'modern': 'from-slate-50 via-gray-50 to-slate-100',
  'rustic': 'from-amber-50 via-orange-50 to-amber-100',
  'elegant': 'from-neutral-50 via-zinc-50 to-neutral-100',
  'bohemian': 'from-teal-50 via-emerald-50 to-teal-100',
  'tropical': 'from-green-50 via-lime-50 to-green-100',
  'vintage': 'from-yellow-50 via-amber-50 to-yellow-100',
  'minimalist': 'from-white via-gray-50 to-white',
  'luxury': 'from-yellow-100 via-amber-100 to-yellow-200',
  'garden': 'from-green-100 via-emerald-50 to-green-100',
  'beach': 'from-cyan-50 via-blue-50 to-cyan-100',
}

export default function PublicInvitationPage() {
  const params = useParams()
  const slug = params.slug as string

  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showRsvp, setShowRsvp] = useState(false)
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    guests: 1,
    attending: true,
    message: ''
  })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showQrModal, setShowQrModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadInvitation()
    // eslint-disable-next-line
  }, [slug])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!invitation?.gallery_images) return
    const total = invitation.gallery_images.length
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev - 1 + total) % total)
    } else {
      setLightboxIndex((prev) => (prev + 1) % total)
    }
  }

  const loadInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setInvitation(data)
      }
    } catch (error) {
      console.error('Error loading invitation:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const copyInvitationLink = () => {
    const link = window.location.href
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareInvitation = async () => {
    const link = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: invitation?.title || 'Invitación',
          text: `${invitation?.couple_names} te invitan a su celebración`,
          url: link
        })
      } catch (err) {
        copyInvitationLink()
      }
    } else {
      copyInvitationLink()
    }
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
        downloadLink.download = `invitacion-${slug}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save the RSVP to the database
    console.log('RSVP submitted:', rsvpData)
    setRsvpSubmitted(true)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysUntilEvent = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-center">
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Invitación no encontrada</h1>
          <p className="text-gray-600 mb-8">
            Esta invitación no existe o aún no ha sido publicada.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!invitation) return null

  const themeStyle = THEME_STYLES[invitation.theme] || THEME_STYLES.classic
  const daysUntil = getDaysUntilEvent(invitation.event_date)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyle}`}>
      {/* Floating Share Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowQrModal(true)}
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all hover:scale-105"
          title="Código QR"
        >
          <QrCode className="w-6 h-6" />
        </button>
        <button
          onClick={shareInvitation}
          className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
          style={{ backgroundColor: invitation.primary_color }}
          title="Compartir"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {invitation.cover_image && (
          <div className="absolute inset-0">
            <img
              src={invitation.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        <div className={`relative z-10 text-center px-6 py-20 ${invitation.cover_image ? 'text-white' : ''}`}>
          <p className={`text-sm uppercase tracking-[0.3em] mb-6 ${
            invitation.cover_image ? 'text-white/80' : 'text-gray-500'
          }`}>
            {invitation.title || 'Te invitamos a celebrar'}
          </p>

          <h1
            className="text-5xl md:text-7xl font-serif mb-8"
            style={{ color: invitation.cover_image ? 'white' : invitation.primary_color }}
          >
            {invitation.couple_names}
          </h1>

          <div className={`flex items-center justify-center gap-6 text-lg mb-8 ${
            invitation.cover_image ? 'text-white/90' : 'text-gray-700'
          }`}>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(invitation.event_date)}
            </div>
          </div>

          {daysUntil > 0 && (
            <div className={`inline-block px-6 py-3 rounded-full ${
              invitation.cover_image
                ? 'bg-white/20 backdrop-blur-sm text-white'
                : 'bg-white shadow-md'
            }`}>
              <span className="font-serif text-2xl">{daysUntil}</span>
              <span className="ml-2 text-sm">días para el gran día</span>
            </div>
          )}

          <div className="mt-12 animate-bounce">
            <ChevronDown className={`w-8 h-8 mx-auto ${
              invitation.cover_image ? 'text-white/60' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </section>

      {/* Message Section */}
      {invitation.message && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Heart
              className="w-8 h-8 mx-auto mb-6"
              style={{ color: invitation.primary_color }}
            />
            <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed italic">
              "{invitation.message}"
            </p>
          </div>
        </section>
      )}

      {/* Photo Gallery Section */}
      {invitation.gallery_images && invitation.gallery_images.length > 0 && (
        <section className="py-16 px-6 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Images
                className="w-8 h-8 mx-auto mb-4"
                style={{ color: invitation.primary_color }}
              />
              <h2
                className="text-3xl font-serif"
                style={{ color: invitation.primary_color }}
              >
                Nuestra Historia
              </h2>
              <p className="text-gray-600 mt-2">Algunos momentos especiales</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {invitation.gallery_images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Details */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-serif text-center mb-12"
            style={{ color: invitation.primary_color }}
          >
            Detalles del Evento
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ceremony */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${invitation.primary_color}20` }}
              >
                <Heart className="w-6 h-6" style={{ color: invitation.primary_color }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ceremonia</h3>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{invitation.event_time}</p>
                    <p className="text-sm">{formatDate(invitation.event_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{invitation.ceremony_venue}</p>
                    <p className="text-sm">{invitation.ceremony_address}</p>
                  </div>
                </div>
              </div>

              {invitation.map_url && (
                <a
                  href={invitation.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${invitation.primary_color}15`,
                    color: invitation.primary_color
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo llegar
                </a>
              )}
            </div>

            {/* Reception */}
            {invitation.reception_venue && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${invitation.primary_color}20` }}
                >
                  <Gift className="w-6 h-6" style={{ color: invitation.primary_color }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recepción</h3>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{invitation.reception_venue}</p>
                      <p className="text-sm">{invitation.reception_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dress Code */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg ${!invitation.reception_venue ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''}`}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${invitation.primary_color}20` }}
              >
                <Shirt className="w-6 h-6" style={{ color: invitation.primary_color }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Código de Vestimenta</h3>

              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-3"
                style={{
                  backgroundColor: `${invitation.primary_color}15`,
                  color: invitation.primary_color
                }}
              >
                {DRESS_CODE_LABELS[invitation.dress_code]?.label || invitation.dress_code}
              </div>
              <p className="text-gray-600 text-sm">
                {DRESS_CODE_LABELS[invitation.dress_code]?.description}
              </p>
              {invitation.dress_code_details && (
                <p className="text-gray-600 text-sm mt-3 p-3 bg-gray-50 rounded-lg">
                  {invitation.dress_code_details}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gift Table Section */}
      {invitation.gift_table_id && (
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: `${invitation.primary_color}10` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${invitation.primary_color}20` }}
              >
                <Gift className="w-8 h-8" style={{ color: invitation.primary_color }} />
              </div>
              <h2
                className="text-3xl font-serif mb-4"
                style={{ color: invitation.primary_color }}
              >
                Mesa de Regalos
              </h2>
              <p className="text-gray-600 mb-6">
                Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo,
                hemos preparado una lista especial para ti.
              </p>
              <Link
                href={`/mesa/${invitation.gift_table_id}`}
                className="inline-flex items-center px-8 py-4 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: invitation.primary_color }}
              >
                <Gift className="w-5 h-5 mr-3" />
                Ver Mesa de Regalos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* QR Code Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: `${invitation.primary_color}08` }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${invitation.primary_color}15` }}
            >
              <QrCode className="w-8 h-8" style={{ color: invitation.primary_color }} />
            </div>
            <h2
              className="text-3xl font-serif mb-4"
              style={{ color: invitation.primary_color }}
            >
              Comparte esta Invitación
            </h2>
            <p className="text-gray-600 mb-6">
              Escanea el código QR o comparte el enlace con tus seres queridos
            </p>

            <div className="bg-white rounded-xl p-6 inline-block mb-6 shadow-md" ref={qrRef}>
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : `https://stoja.mx/invitacion/${slug}`}
                size={180}
                level="H"
                includeMargin={true}
                fgColor={invitation.primary_color || '#0d9488'}
                bgColor="#ffffff"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadQRCode}
                className="inline-flex items-center justify-center px-6 py-3 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: invitation.primary_color }}
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar QR
              </button>
              <button
                onClick={copyInvitationLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Enlace Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar Enlace
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-3xl font-serif mb-4"
            style={{ color: invitation.primary_color }}
          >
            Confirma tu Asistencia
          </h2>
          {invitation.rsvp_deadline && (
            <p className="text-gray-600 mb-8">
              Por favor confirma antes del {formatDate(invitation.rsvp_deadline)}
            </p>
          )}

          {rsvpSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">¡Gracias por confirmar!</h3>
              <p className="text-green-700">
                Hemos recibido tu confirmación. ¡Nos vemos pronto!
              </p>
            </div>
          ) : showRsvp ? (
            <form onSubmit={handleRsvpSubmit} className="bg-white rounded-xl p-8 shadow-lg text-left">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={rsvpData.email}
                    onChange={(e) => setRsvpData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Asistirás?</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRsvpData(prev => ({ ...prev, attending: true }))}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        rsvpData.attending
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Sí, asistiré
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpData(prev => ({ ...prev, attending: false }))}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        !rsvpData.attending
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      No podré asistir
                    </button>
                  </div>
                </div>
                {rsvpData.attending && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de acompañantes</label>
                    <select
                      value={rsvpData.guests}
                      onChange={(e) => setRsvpData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje (opcional)</label>
                  <textarea
                    value={rsvpData.message}
                    onChange={(e) => setRsvpData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Un mensaje para los novios..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-4 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: invitation.primary_color }}
              >
                Enviar Confirmación
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRsvp(true)}
              className="px-8 py-4 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: invitation.primary_color }}
            >
              Confirmar Asistencia
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>
          Invitación creada con{' '}
          <Link href="/" className="text-teal-600 hover:underline">
            Stoja
          </Link>
        </p>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && invitation.gallery_images && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {invitation.gallery_images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev') }}
                className="absolute left-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next') }}
                className="absolute right-4 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={invitation.gallery_images[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="text-center text-white/70 text-sm mt-4">
              {lightboxIndex + 1} / {invitation.gallery_images.length}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-serif mb-4" style={{ color: invitation.primary_color }}>
              Escanea para ver la invitación
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : `https://stoja.mx/invitacion/${slug}`}
                size={200}
                level="H"
                includeMargin={true}
                fgColor={invitation.primary_color || '#0d9488'}
                bgColor="#ffffff"
                className="mx-auto"
              />
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {invitation.couple_names}
            </p>

            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: invitation.primary_color }}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Descargar
              </button>
              <button
                onClick={shareInvitation}
                className="flex-1 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
