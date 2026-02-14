'use client'

import { useState } from 'react'
import { Copy, Check, Share2, QrCode } from 'lucide-react'

interface ShareUrlCardProps {
  slug: string
  eventName: string
}

export function ShareUrlCard({ slug, eventName }: ShareUrlCardProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/mesa/${slug}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          text: `¡Visita nuestra mesa de regalos!`,
          url: fullUrl
        })
      } catch (error) {
        // Usuario canceló o no soportado
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6 shadow-lg animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-teal-500 p-2 rounded-lg mr-3">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tu URL Personalizada</h3>
            <p className="text-sm text-gray-600">Comparte este enlace con tus invitados</p>
          </div>
        </div>
      </div>

      {/* URL Display */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-xs text-gray-500 mb-1">Tu enlace personalizado:</p>
            <p className="font-mono text-sm md:text-base text-teal-700 font-semibold truncate">
              {fullUrl}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-lg transition-all hover:scale-105 shadow-md"
            title="Copiar enlace"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {copied && (
          <p className="text-sm text-green-600 mt-2 flex items-center animate-fade-in">
            <Check className="w-4 h-4 mr-1" />
            ¡Enlace copiado al portapapeles!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </button>

        <button
          onClick={() => {
            // Abrir en nueva pestaña para ver cómo se ve
            window.open(fullUrl, '_blank')
          }}
          className="flex items-center justify-center px-4 py-3 bg-white border-2 border-teal-500 text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-colors"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Previsualizar
        </button>
      </div>

      {/* Tips */}
      <div className="mt-4 pt-4 border-t border-teal-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Esta URL es fácil de recordar y perfecta para compartir en invitaciones, redes sociales o por WhatsApp.
        </p>
      </div>
    </div>
  )
}
