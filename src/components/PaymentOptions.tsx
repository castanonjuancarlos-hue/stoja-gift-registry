export function PaymentOptions() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-gray-900">
          DIFERENTES MANERAS PARA RETIRAR TU DINERO
        </h2>
        <p className="text-lg text-gray-700 text-center mb-12">
          Elige el esquema que más te convenga.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Advance Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">
              Pago anticipado
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Pago por adelantado al crear tu mesa de regalos. *sin cargos extra
            </p>
          </div>

          {/* Commission */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">
              Comisión
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Se cobra el 3% de comisión al momento de retirar el dinero en tu cuenta de banco
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
