import Link from 'next/link'

export function PreMadeCollections() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="bg-emerald-600 text-white p-12 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
              Inspírate con nuestras mesas pre armadas
            </h2>
            <p className="text-lg mb-8 opacity-90">
              No te preocupes por seleccionar tus productos uno por uno, puedes escoger
              una lista pre armada y empezar a recibir regalos.
            </p>
            <Link href="/colecciones">
              <button className="border-2 border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-emerald-600 transition-colors">
                VER MESAS
              </button>
            </Link>
          </div>

          {/* Right Side - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://ext.same-assets.com/414402080/739416868.jpeg"
                  alt="Experiencias"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  EXPERIENCIAS
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://ext.same-assets.com/414402080/1835651507.jpeg"
                  alt="Mi Mesa de Regalos"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  MI MESA DE REGALOS
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://ext.same-assets.com/414402080/701023098.jpeg"
                  alt="Decoración"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  DECORACIÓN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
