import Link from 'next/link'

export function WebsiteCreation() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 text-gray-900">
              Crea y personaliza tu página web
            </h2>
            <Link href="/planes">
              <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                ¡CONOCE NUESTROS DISEÑOS!
              </button>
            </Link>
            <p className="mt-8 text-sm text-gray-500 uppercase tracking-wide">
              DISEÑA LA WEB DE TU EVENTO COMO TÚ QUIERAS
            </p>
          </div>

          {/* Right Side - Website Preview */}
          <div className="bg-orange-400 p-8 rounded-lg">
            <div className="bg-white rounded-lg p-6 shadow-lg transform rotate-3">
              <img
                src="https://ext.same-assets.com/414402080/3202036517.jpeg"
                alt="Website preview"
                className="w-full h-64 object-cover rounded mb-4"
              />
              <div className="grid grid-cols-3 gap-2">
                <img
                  src="https://ext.same-assets.com/414402080/1021847894.jpeg"
                  alt="Gallery 1"
                  className="w-full h-16 object-cover rounded"
                />
                <img
                  src="https://ext.same-assets.com/414402080/3239978179.jpeg"
                  alt="Gallery 2"
                  className="w-full h-16 object-cover rounded"
                />
                <img
                  src="https://ext.same-assets.com/414402080/3104962945.jpeg"
                  alt="Gallery 3"
                  className="w-full h-16 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
