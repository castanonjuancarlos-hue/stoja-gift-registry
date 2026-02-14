'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeroSection() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/buscar-mesa')
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Video with gradient fallback */}
      <div className="absolute inset-0">
        {/* Beautiful tropical gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-300 to-blue-400"></div>

        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        >
          <source src="/videoII.mp4" type="video/mp4" />
        </video>

        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/30 z-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-8 leading-tight tracking-wide">
          ¡LA MEJOR<br />
          PLATAFORMA<br />
          PARA PLANEAR<br />
          TU BODA!
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-black/70 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-medium mb-6">Encuentra una Mesa</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="NOMBRE"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border-b border-white/50 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="FECHA DEL EVENTO"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border-b border-white/50 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-white text-black font-medium py-3 px-6 rounded hover:bg-gray-100 transition-colors mt-6">
              BUSCAR
            </button>
          </div>
        </form>
      </div>

      {/* Social Media Icons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4 hidden lg:flex flex-col z-30">
        <a href="#" className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          <span className="text-sm font-bold">f</span>
        </a>
        <a href="#" className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          <span className="text-sm font-bold">ig</span>
        </a>
        <a href="#" className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          <span className="text-sm font-bold">p</span>
        </a>
        <a href="#" className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white hover:bg-black/70 transition-colors">
          <span className="text-sm font-bold">w</span>
        </a>
      </div>
    </section>
  )
}
