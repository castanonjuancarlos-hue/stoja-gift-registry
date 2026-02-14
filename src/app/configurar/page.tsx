'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy, ExternalLink, FileCode, Settings, Mail, CreditCard, Database } from 'lucide-react'

export default function ConfigurarPage() {
  const [copiedSupabaseUrl, setCopiedSupabaseUrl] = useState(false)
  const [copiedSupabaseKey, setCopiedSupabaseKey] = useState(false)
  const [copiedResendKey, setCopiedResendKey] = useState(false)

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setter(true)
    setTimeout(() => setter(false), 2000)
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
              Guía de Configuración
            </h1>
            <p className="text-gray-600">
              Configura Supabase, Resend y PayPal para usar tu plataforma en producción
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">📚 Guías Completas</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <a
                href="/CONFIGURACION_RAPIDA.md"
                target="_blank"
                className="flex items-center text-blue-700 hover:text-blue-900"
              >
                <FileCode className="w-4 h-4 mr-2" />
                <span className="text-sm">CONFIGURACION_RAPIDA.md</span>
              </a>
              <a
                href="/SUPABASE_SETUP.md"
                target="_blank"
                className="flex items-center text-blue-700 hover:text-blue-900"
              >
                <FileCode className="w-4 h-4 mr-2" />
                <span className="text-sm">SUPABASE_SETUP.md</span>
              </a>
              <a
                href="/EMAIL_SETUP.md"
                target="_blank"
                className="flex items-center text-blue-700 hover:text-blue-900"
              >
                <FileCode className="w-4 h-4 mr-2" />
                <span className="text-sm">EMAIL_SETUP.md</span>
              </a>
              <Link
                href="/verificar-setup"
                className="flex items-center text-blue-700 hover:text-blue-900"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="text-sm">Verificar Configuración</span>
              </Link>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1: Supabase */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
                <div className="flex items-center text-white">
                  <Database className="w-8 h-8 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold">1. Configurar Supabase</h2>
                    <p className="text-green-100">Base de datos y autenticación • 15-20 minutos</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 1.1: Crear cuenta</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>Ve a <strong>supabase.com</strong></li>
                    <li>Haz clic en "Start your project"</li>
                    <li>Regístrate con GitHub o email</li>
                  </ol>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Abrir Supabase
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 1.2: Crear proyecto</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Haz clic en "New Project"</li>
                    <li>Name: <code className="bg-gray-200 px-1 rounded">stoja-production</code></li>
                    <li>Database Password: Crea una contraseña segura (guárdala)</li>
                    <li>Region: Selecciona la más cercana</li>
                    <li>Plan: FREE</li>
                    <li>Espera 1-2 minutos</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 1.3: Ejecutar SQL</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>En Supabase, ve a "SQL Editor"</li>
                    <li>Haz clic en "New query"</li>
                    <li>Abre el archivo <code className="bg-gray-200 px-1 rounded">supabase-schema.sql</code></li>
                    <li>Copia TODO el contenido</li>
                    <li>Pega en Supabase y haz clic en "Run"</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 1.4: Obtener credenciales</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>Ve a Settings → API</li>
                    <li>Copia "Project URL"</li>
                    <li>Copia "anon public" key</li>
                  </ol>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        NEXT_PUBLIC_SUPABASE_URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="https://tu-proyecto.supabase.co"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm"
                          id="supabase-url"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('supabase-url') as HTMLInputElement
                            if (input.value) {
                              copyToClipboard(
                                `NEXT_PUBLIC_SUPABASE_URL=${input.value}`,
                                setCopiedSupabaseUrl
                              )
                            }
                          }}
                          className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                        >
                          {copiedSupabaseUrl ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        NEXT_PUBLIC_SUPABASE_ANON_KEY
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm"
                          id="supabase-key"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('supabase-key') as HTMLInputElement
                            if (input.value) {
                              copyToClipboard(
                                `NEXT_PUBLIC_SUPABASE_ANON_KEY=${input.value}`,
                                setCopiedSupabaseKey
                              )
                            }
                          }}
                          className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                        >
                          {copiedSupabaseKey ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Pega estas líneas en tu archivo <code className="bg-gray-200 px-1 rounded">.env.local</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Resend */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center text-white">
                  <Mail className="w-8 h-8 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold">2. Configurar Resend</h2>
                    <p className="text-blue-100">Emails transaccionales • 5-10 minutos</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 2.1: Crear cuenta</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>Ve a <strong>resend.com</strong></li>
                    <li>Haz clic en "Get Started"</li>
                    <li>Regístrate con email o GitHub</li>
                  </ol>
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Abrir Resend
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 2.2: Obtener API Key</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>Ve a "API Keys"</li>
                    <li>Haz clic en "Create API Key"</li>
                    <li>Name: <code className="bg-gray-200 px-1 rounded">Stoja Production</code></li>
                    <li>Permission: Sending access</li>
                    <li>Copia la clave (empieza con <code className="bg-gray-200 px-1 rounded">re_</code>)</li>
                  </ol>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      RESEND_API_KEY
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="re_AbCdEf123456..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm"
                        id="resend-key"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('resend-key') as HTMLInputElement
                          if (input.value) {
                            copyToClipboard(`RESEND_API_KEY=${input.value}`, setCopiedResendKey)
                          }
                        }}
                        className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                      >
                        {copiedResendKey ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Pega esta línea en tu archivo <code className="bg-gray-200 px-1 rounded">.env.local</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Verify */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center text-white">
                  <Settings className="w-8 h-8 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold">3. Verificar Configuración</h2>
                    <p className="text-purple-100">Comprobar que todo funciona • 2 minutos</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 3.1: Reiniciar servidor</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    En la terminal de Same IDE:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm">
                    # Detén el servidor (Ctrl+C)<br />
                    bun run dev
                  </code>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 3.2: Verificar</h3>
                  <Link
                    href="/verificar-setup"
                    className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  >
                    Ir a Verificar Setup →
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 4: PayPal */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                <div className="flex items-center text-white">
                  <CreditCard className="w-8 h-8 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold">4. Configurar PayPal</h2>
                    <p className="text-yellow-100">Pasarela de pago • 10 minutos</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Paso 4.1: Obtener Client ID</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
                    <li>Ve a <strong>developer.paypal.com</strong></li>
                    <li>Inicia sesión o crea cuenta</li>
                    <li>Ve a "My Apps & Credentials"</li>
                    <li>Crea una app: "Create App"</li>
                    <li>Copia el Client ID (Sandbox para pruebas)</li>
                  </ol>
                  <a
                    href="https://developer.paypal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Abrir PayPal Developer
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Editar archivos manualmente</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    PayPal requiere editar el código directamente:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded">
                      <p className="font-mono text-xs mb-1">src/app/planes/page.tsx (línea ~82)</p>
                      <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
                        client-id=<span className="text-red-400">test</span> → client-id=<span className="text-green-400">TU_CLIENT_ID</span>
                      </code>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-mono text-xs mb-1">src/app/mesa/[id]/page.tsx (línea ~113)</p>
                      <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
                        client-id=<span className="text-red-400">test</span> → client-id=<span className="text-green-400">TU_CLIENT_ID</span>
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-serif mb-4">¿Necesitas ayuda?</h3>
            <p className="mb-6">
              Lee las guías completas o verifica tu configuración
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/CONFIGURACION_RAPIDA.md"
                target="_blank"
                className="bg-white text-teal-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Guía Rápida
              </a>
              <Link
                href="/verificar-setup"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Verificar Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
