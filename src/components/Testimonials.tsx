import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: "Ana Lucia D",
      rating: 5,
      text: "Es GRAN opción para mesa de regalos. Súper fácil y rápido todo, tienen diferentes paquetes de acuerdo a lo que buscas y lo puedes personalizar tanto como quieras. Muy buena atención al cliente, lo recomiendo mucho."
    },
    {
      name: "Nicole",
      rating: 5,
      text: "¡Todo fue muy fácil y rápido! Nos encantó la experiencia y la atención en todo momento."
    },
    {
      name: "Galia",
      rating: 5,
      text: "Usamos Stoja para la mesa de regalos de nuestra boda y toda la experiencia fue buenísima! Muy buena atención, siempre contestan super rápido cualquier pregunta. Además, todo el proceso de agregar regalos, recibir depósitos fue muy fácil. Los recomiendo mucho!"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-gray-900">
          TODOS REALMENTE AMAN STOJA
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                  <div className="flex space-x-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
