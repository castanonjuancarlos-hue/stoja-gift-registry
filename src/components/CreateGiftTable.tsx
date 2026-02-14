'use client'

import Link from 'next/link'

export function CreateGiftTable() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA */}
          <div className="bg-orange-400 text-white p-12 rounded-lg text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-8">
              Crea tu mesa de regalos
            </h2>
            <Link href="/planes">
              <button className="border-2 border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-orange-400 transition-colors">
                ¡CREAR MESA!
              </button>
            </Link>
            <p className="mt-8 text-sm uppercase tracking-wide">
              DIGITAL FÁCIL AMIGABLE INNOVADOR
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <img
              src="https://ext.same-assets.com/414402080/3540778603.jpeg"
              alt="Elegant gift wrapping"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
