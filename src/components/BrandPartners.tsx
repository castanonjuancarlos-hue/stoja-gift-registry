import Link from 'next/link'

export function BrandPartners() {
  const brands = [
    { name: "CASAH", logo: "https://ext.same-assets.com/414402080/1500204535.png" },
    { name: "marcosweb", logo: "https://ext.same-assets.com/414402080/1884005864.png" },
    { name: "CasaMia", logo: "https://ext.same-assets.com/414402080/250869090.png" },
    { name: "indesign living", logo: "https://ext.same-assets.com/414402080/3859701442.png" },
    { name: "lurmix", logo: "https://ext.same-assets.com/414402080/1997518771.png" },
    { name: "LAITING", logo: "https://ext.same-assets.com/414402080/100765931.png" },
    { name: "mabe", logo: "https://ext.same-assets.com/414402080/3694769595.png" },
    { name: "menta", logo: "https://ext.same-assets.com/414402080/4223004573.png" },
    { name: "Le Creuset", logo: "https://ext.same-assets.com/414402080/660581004.png" },
    { name: "Sofamania", logo: "https://ext.same-assets.com/414402080/306859372.png" }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gray-900">
          NUESTRAS MARCAS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto items-center">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-12 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="mailto:proveedores@stoja.com">
            <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
              ¿QUIERES SER PROVEEDOR? ¡CONTÁCTANOS!
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}
