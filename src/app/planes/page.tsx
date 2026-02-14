'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Check, CreditCard, Shield, ArrowLeft, Loader2, AlertTriangle, Info } from 'lucide-react'

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PlanesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [paypalConfigured, setPaypalConfigured] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const paypalButtonsRef = useRef<{ [key: string]: boolean }>({})

  // ========================================
  // 💰 PRECIOS DE PRUEBA - $0.01 cada plan
  // ========================================
  // Para producción, cambiar los precios a los valores reales
  const planes = [
    {
      id: 'basico',
      name: 'Básico',
      price: 0.01, // 💰 PRECIO DE PRUEBA - Cambiar a 49.99 en producción
      originalPrice: 49.99,
      description: 'Perfecto para bodas pequeñas',
      features: [
        'Hasta 50 invitados',
        'Mesa de regalos digital',
        'Invitaciones digitales básicas',
        'Soporte por email',
        '1 diseño de página web'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 0.01, // 💰 PRECIO DE PRUEBA - Cambiar a 99.99 en producción
      originalPrice: 99.99,
      description: 'Ideal para bodas medianas',
      features: [
        'Hasta 150 invitados',
        'Mesa de regalos digital',
        'Invitaciones digitales premium',
        'Soporte prioritario',
        '3 diseños de página web',
        'Seguimiento de confirmaciones',
        'Personalización avanzada'
      ],
      popular: true
    },
    {
      id: 'profesional',
      name: 'Profesional',
      price: 0.01, // 💰 PRECIO DE PRUEBA - Cambiar a 199.99 en producción
      originalPrice: 199.99,
      description: 'Para bodas grandes y eventos especiales',
      features: [
        'Invitados ilimitados',
        'Mesa de regalos digital ilimitada',
        'Invitaciones digitales premium',
        'Soporte 24/7',
        'Diseños personalizados',
        'Página web a medida',
        'Gestor personal de eventos',
        'Análisis y reportes',
        'Integración con redes sociales'
      ]
    }
  ]

  // Check PayPal configuration and load SDK
  useEffect(() => {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    // Check if PayPal is configured
    if (!paypalClientId || paypalClientId === 'your_paypal_client_id_here' || paypalClientId.length < 10) {
      console.log('PayPal Client ID not configured')
      setPaypalConfigured(false)
      setPaypalError('PayPal no está configurado. Se usará modo demo.')
      return
    }

    setPaypalConfigured(true)

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
    if (existingScript) {
      setPaypalLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`
    script.async = true

    script.onload = () => {
      console.log('PayPal SDK loaded successfully')
      setPaypalLoaded(true)
      setPaypalError(null)
    }

    script.onerror = () => {
      console.error('Error loading PayPal SDK')
      setPaypalError('Error al cargar PayPal. Intenta recargar la página.')
      setPaypalConfigured(false)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup if component unmounts
    }
  }, [])

  // Render PayPal button when a plan is selected
  useEffect(() => {
    if (
      selectedPlan &&
      paypalLoaded &&
      window.paypal &&
      isAuthenticated &&
      !isDemoMode &&
      paypalConfigured
    ) {
      renderPayPalButton(selectedPlan)
    }
  }, [selectedPlan, paypalLoaded, isAuthenticated, isDemoMode, paypalConfigured])

  const renderPayPalButton = (planId: string) => {
    const plan = planes.find(p => p.id === planId)
    if (!plan) return

    const containerId = `paypal-button-${planId}`
    const container = document.getElementById(containerId)

    if (!container) {
      console.error('PayPal container not found:', containerId)
      return
    }

    container.innerHTML = ''
    paypalButtonsRef.current[planId] = true

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        },
        createOrder: (data: any, actions: any) => {
          console.log('Creating PayPal order for plan:', plan.name, 'Price: $', plan.price)
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: plan.price.toFixed(2),
                currency_code: 'USD'
              },
              description: `Plan ${plan.name} - Stoja (Precio de prueba)`
            }]
          })
        },
        onApprove: async (data: any, actions: any) => {
          setProcessing(true)
          try {
            const order = await actions.order.capture()
            console.log('Payment completed:', order)

            if (user) {
              try {
                const { supabase } = await import('@/lib/supabase')

                await supabase
                  .from('profiles')
                  .update({ plan: planId })
                  .eq('id', user.id)

                await supabase
                  .from('payments')
                  .insert({
                    user_id: user.id,
                    plan_id: planId,
                    amount: plan.price,
                    payment_method: 'paypal',
                    payment_status: 'completed',
                    paypal_order_id: order.id
                  })

                alert(`¡Pago de $${plan.price} USD exitoso!\n\nPlan ${plan.name} activado.\nID de transacción: ${order.id}`)
                router.push('/mi-cuenta')
              } catch (error) {
                console.error('Error saving payment:', error)
                // Guardar en localStorage como backup
                const payments = JSON.parse(localStorage.getItem('demo_payments') || '[]')
                payments.push({
                  id: order.id,
                  user_id: user.id,
                  plan_id: planId,
                  amount: plan.price,
                  payment_method: 'paypal',
                  payment_status: 'completed',
                  created_at: new Date().toISOString()
                })
                localStorage.setItem('demo_payments', JSON.stringify(payments))

                alert(`¡Pago de $${plan.price} USD exitoso!\n\nPlan ${plan.name} activado.`)
                router.push('/mi-cuenta')
              }
            }
          } catch (error) {
            console.error('Error capturing order:', error)
            alert('Hubo un problema procesando el pago. Por favor contacta soporte.')
          } finally {
            setProcessing(false)
          }
        },
        onCancel: () => {
          console.log('Payment cancelled')
          setSelectedPlan(null)
        },
        onError: (err: any) => {
          console.error('PayPal error:', err)
          alert('Hubo un error con PayPal. Por favor intenta de nuevo.')
          setSelectedPlan(null)
        }
      }).render(`#${containerId}`).catch((err: any) => {
        console.error('Error rendering PayPal button:', err)
      })
    } catch (error) {
      console.error('Error setting up PayPal button:', error)
    }
  }

  const handleDemoPurchase = (planId: string, planName: string, price: number) => {
    setProcessing(true)

    setTimeout(() => {
      const payments = JSON.parse(localStorage.getItem('demo_payments') || '[]')
      payments.push({
        id: `payment-${Date.now()}`,
        user_id: user?.id,
        plan_id: planId,
        amount: price,
        payment_method: 'demo-paypal',
        payment_status: 'completed',
        created_at: new Date().toISOString()
      })
      localStorage.setItem('demo_payments', JSON.stringify(payments))

      const users = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === user?.id)
      if (userIndex !== -1) {
        users[userIndex].plan = planId
        localStorage.setItem('demo_users', JSON.stringify(users))
      }

      setProcessing(false)
      alert(`¡Pago simulado de $${price} USD exitoso!\n\nPlan: ${planName}`)
      router.push('/mi-cuenta')
    }, 1500)
  }

  const handleSelectPlan = (planId: string) => {
    const plan = planes.find(p => p.id === planId)
    if (!plan) return

    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      setSelectedPlan(planId)
      return
    }

    // If PayPal is not configured, always use demo mode
    if (isDemoMode || !paypalConfigured) {
      handleDemoPurchase(planId, plan.name, plan.price)
      return
    }

    setSelectedPlan(planId)
  }

  const goToLogin = () => {
    if (selectedPlan) {
      sessionStorage.setItem('pendingPlan', selectedPlan)
    }
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-2xl font-serif font-semibold text-gray-800">Stoja</span>
          </Link>
          {isAuthenticated ? (
            <div className="text-sm text-gray-600">
              Bienvenido, {user?.name}
              {isDemoMode && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  MODO DEMO
                </span>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* PayPal Error/Info */}
        {paypalError && (
          <div className="max-w-4xl mx-auto mb-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Atención: PayPal no disponible</h3>
                <p className="text-yellow-700 text-sm">
                  {paypalError} <br />
                  Las compras se simularán en modo demo. Si eres el administrador, revisa la variable <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> en tu entorno.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Test Mode Notice */}
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">PayPal 100% Operativo - Precios de Prueba</h3>
              <p className="text-green-700 text-sm">
                Todos los planes cuestan <strong>$0.01 USD</strong> para pruebas. Los pagos son REALES con PayPal.
              </p>
              {!paypalConfigured && (
                <div className="flex items-center mt-2 text-yellow-700 text-xs">
                  <Info className="w-4 h-4 mr-1" />
                  Modo demo activo: los pagos no serán reales.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Elige tu Plan Perfecto
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona el paquete ideal para tu evento especial. Todos los planes incluyen soporte dedicado.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-teal-500 scale-105' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-teal-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 text-center text-sm font-medium">
                  Más Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-green-600">${plan.price}</span>
                    <span className="text-gray-500 ml-2">USD</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-through">Precio normal: ${plan.originalPrice}</p>
                  <p className="text-xs text-green-600 font-medium">Precio de prueba</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* PayPal Button or Select Button */}
                {selectedPlan === plan.id && isAuthenticated && !isDemoMode && paypalConfigured && paypalLoaded ? (
                  <div className="space-y-3">
                    <div id={`paypal-button-${plan.id}`} className="min-h-[50px]">
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                        <span className="ml-2 text-gray-600 text-sm">Cargando PayPal...</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={processing && selectedPlan === plan.id}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>
                          {paypalConfigured && !isDemoMode
                            ? 'Pagar $0.01 con PayPal'
                            : 'Simular pago (demo)'}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact & Back */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Necesitas ayuda para elegir?{' '}
            <a
              href="mailto:contacto@stoja.mx"
              className="text-teal-600 hover:text-teal-700 font-medium underline decoration-dotted underline-offset-4"
            >
              Contáctanos
            </a>
          </p>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al inicio
          </Link>
        </div>

        {/* Secure Payment Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              {paypalConfigured
                ? 'Pagos REALES con PayPal - $0.01 USD por plan'
                : 'Modo demo: los pagos no son reales'}
            </span>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                Inicia Sesión para Continuar
              </h3>
              <p className="text-gray-600">
                Para adquirir un plan necesitas tener una cuenta en Stoja
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={goToLogin}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition-all"
              >
                Iniciar Sesión
              </button>
              <Link
                href="/registro"
                className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Crear Cuenta Nueva
              </Link>
              <button
                onClick={() => {
                  setShowLoginPrompt(false)
                  setSelectedPlan(null)
                }}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Procesando tu pago...</p>
            <p className="text-gray-500 text-sm mt-2">Por favor no cierres esta ventana</p>
          </div>
        </div>
      )}
    </div>
  )
}
