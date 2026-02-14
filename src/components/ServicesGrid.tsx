export function ServicesGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-gray-900">
          TODO EN UN MISMO LUGAR
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Agradecimientos */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer">
            <img
              src="https://ext.same-assets.com/414402080/1211170396.jpeg"
              alt="Agradecimientos"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-xl font-medium">AGRADECIMIENTOS</h3>
            </div>
          </div>

          {/* Crea tus propias experiencias */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer">
            <img
              src="https://ext.same-assets.com/414402080/1887241284.jpeg"
              alt="Experiencias y productos"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-xl font-medium text-center">
                CREA TUS PROPIAS<br />EXPERIENCIAS Y PRODUCTOS
              </h3>
            </div>
          </div>

          {/* RSVP */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer">
            <img
              src="https://ext.same-assets.com/414402080/3540778603.jpeg"
              alt="RSVP"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-xl font-medium">RSVP</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
