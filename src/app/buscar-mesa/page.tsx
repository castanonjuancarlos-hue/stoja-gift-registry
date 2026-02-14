'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function BuscarMesaPage() {
  const [searchName, setSearchName] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      // Construir la query
      let query = supabase.from('gift_tables').select('*')

      if (searchName) {
        query = query.ilike('event_name', `%${searchName}%`)
      }

      if (searchDate) {
        query = query.eq('event_date', searchDate)
      }

      const { data, error } = await query

      if (error) throw error

      // Transformar los datos para que coincidan con el formato esperado
      const transformedResults = (data || []).map(item => ({
        id: item.id,
        names: item.event_name,
        date: item.event_date,
        type: item.event_type || 'Boda',
        location: item.location || ''
      }))

      setResults(transformedResults)
    } catch (error) {
      console.error('Error buscando mesas:', error)
      setResults([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
            Stoja
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              Buscar Mesa de Regalos
            </h1>
            <p className="text-lg text-gray-600">
              Encuentra la mesa de regalos de tu evento favorito
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de los Novios o Evento
                </label>
                <input
                  id="name"
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: María y Carlos"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Evento (Opcional)
                </label>
                <input
                  id="date"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar Mesa
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <div>
              {results.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
                    Resultados ({results.length})
                  </h2>
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {result.names}
                          </h3>
                          <p className="text-gray-600">{result.type}</p>
                        </div>
                        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                          {new Date(result.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">📍 {result.location}</p>
                      <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                        Ver Mesa de Regalos
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    No se encontraron mesas de regalos con estos criterios
                  </p>
                  <p className="text-gray-500">
                    Intenta con otro nombre o fecha
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
