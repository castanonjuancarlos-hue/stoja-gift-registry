export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-gray-900">
          ¿CÓMO FUNCIONA STOJA?
        </h2>

        <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-16 leading-relaxed">
          Somos la plataforma en línea que permite crear Mesas de Regalo para cualquier tipo de evento.
          Elige productos y/o experiencias de nuestro amplio catálogo y escoge si quieres recibir el
          equivalente de tus regalos en tu cuenta bancaria, que te enviemos los regalos a tu casa o
          cambiarlos por otros productos del catálogo. Además, podrás crear tu página web, invitación
          digital, agradecer a tus invitados y mucho más!
        </p>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">PASO 1</p>
            <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">
              Crea tu mesa de regalos
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Agrega productos del catálogo y/o crea tus propios productos y experiencias y
              personaliza tu página web con los detalles de tu evento.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">PASO 2</p>
            <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">
              Comparte y recibe
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Crea tu invitación digital, compártela con tus invitados y empieza a recibir
              notificaciones en tu correo cada vez que te regalen algo.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">PASO 3</p>
            <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">
              Elige la forma de canje
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Escoge si quieres convertir tus regalos en efectivo, recibirlos en tu casa
              y/o cambiarlos por otros productos del catálogo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
