'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react'

interface VerificationResult {
  configured: boolean
  connected: boolean
  tablesExist: boolean
  errors: string[]
  warnings: string[]
}

export default function VerificarSetupPage() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    runVerification()
  }, [])

  const runVerification = async () => {
    setLoading(true)

    try {
      const { verifySupabaseSetup } = await import('@/lib/verify-supabase')
      const verification = await verifySupabaseSetup()
      setResult(verification)
    } catch (error) {
      console.error('Error verificando setup:', error)
      setResult({
        configured: false,
        connected: false,
        tablesExist: false,
        errors: ['Error al ejecutar verificación'],
        warnings: []
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
              Verificar Configuración
            </h1>
            <p className="text-gray-600">
              Comprueba el estado de tu configuración de Supabase
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
              <p className="text-gray-600">Verificando configuración...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Estado General
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Supabase Configurado</span>
                    {result.configured ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Conexión Exitosa</span>
                    {result.connected ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Tablas Creadas</span>
                    {result.tablesExist ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {result.configured && result.connected && result.tablesExist && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Check className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">
                        ✅ ¡Todo está configurado correctamente!
                      </h3>
                      <p className="text-green-800 text-sm">
                        Tu aplicación está conectada a Supabase y lista para usar en producción.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900 mb-3">
                        Advertencias
                      </h3>
                      <ul className="space-y-2">
                        {result.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-800 text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-3">
                        Errores Encontrados
                      </h3>
                      <ul className="space-y-2">
                        {result.errors.map((error, index) => (
                          <li key={index} className="text-red-800 text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Setup Guide */}
              {!result.configured && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    💡 Supabase no está configurado
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Tu aplicación está funcionando en modo demo con localStorage. Para usar Supabase en producción:
                  </p>
                  <ol className="space-y-2 text-blue-800 text-sm mb-4">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      <span>Lee la guía completa en <code className="bg-blue-100 px-1 rounded">SUPABASE_SETUP.md</code></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      <span>Crea una cuenta gratuita en supabase.com</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      <span>Obtén tus credenciales y actualiza .env.local</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">4.</span>
                      <span>Ejecuta el script SQL en Supabase</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">5.</span>
                      <span>Reinicia el servidor y verifica de nuevo</span>
                    </li>
                  </ol>
                  <a
                    href="/SUPABASE_SETUP.md"
                    target="_blank"
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Ver Guía Completa
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={runVerification}
                  className="flex-1 bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Verificar de Nuevo
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>

              {/* Technical Details */}
              <details className="bg-white rounded-lg shadow-md p-6">
                <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                  Detalles Técnicos
                </summary>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error al cargar resultados de verificación</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
