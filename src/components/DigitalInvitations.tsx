import Link from 'next/link'

export function DigitalInvitations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 text-gray-900">
              Diseña y envía tu invitación digital
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Personaliza tus invitaciones, agrega a tus invitados y maneja las
              confirmaciones desde un solo lugar.
            </p>
            <Link href="/planes">
              <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                VE LOS DISEÑOS
              </button>
            </Link>
            <p className="mt-8 text-sm text-gray-500 uppercase tracking-wide">
              DISEÑOS PARA TODO TIPO DE EVENTOS
            </p>
          </div>

          {/* Right Side - Invitation Preview */}
          <div className="relative">
            <div className="bg-emerald-600 p-8 rounded-lg">
              <div className="bg-white rounded-lg p-6 shadow-lg transform -rotate-3">
                <div className="text-center">
                  <h3 className="text-2xl font-serif text-gray-800 mb-2">Sofía y Ramón</h3>
                  <p className="text-gray-600 text-sm mb-4">NOS CASAMOS</p>
                  <div className="bg-gray-100 rounded p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-2">CONFIRMACIÓN DE ASISTENCIA</p>
                    <div className="space-y-2">
                      <button className="w-full bg-emerald-600 text-white py-2 rounded text-sm">
                        CONFIRMAR ASISTENCIA
                      </button>
                      <div className="text-xs text-gray-500">
                        <p>• CEREMONIA</p>
                        <p>• RECEPCIÓN</p>
                        <p>• FIESTA</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Mesa de Regalos</p>
                    <p className="font-serif font-semibold text-gray-800 mt-2">Stoja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
