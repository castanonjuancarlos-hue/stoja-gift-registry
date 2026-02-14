'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { ShareUrlCard } from '@/components/ShareUrlCard'
import { ArrowLeft, Calendar, MapPin, Plus, Trash2, ShoppingCart, Share2, Gift, X } from 'lucide-react'


interface GiftTable {
  id: string
  event_name: string
  event_date: string
  event_type: string
  location?: string
  description?: string
  user_id: string
  slug?: string
}

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  brand?: string
}

interface GiftTableItem {
  id: string
  product: Product
  quantity: number
  reserved: boolean
  reserved_by?: string
  reserved_by_name?: string
}

// 💰 PRECIOS DE PRUEBA - $0.01 cada producto
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Juego de Cubiertos Premium',
    price: 0.01, // Precio de prueba
    description: 'Set completo de cubiertos de acero inoxidable',
    category: 'Cocina',
    brand: 'Le Creuset',
    image_url: 'https://ext.same-assets.com/414402080/3540778603.jpeg'
  },
  {
    id: 'prod-2',
    name: 'Set de Decoración Moderna',
    price: 0.01, // Precio de prueba
    description: 'Elementos decorativos para el hogar',
    category: 'Decoración',
    brand: 'indesign living',
    image_url: 'https://ext.same-assets.com/414402080/1211170396.jpeg'
  },
  {
    id: 'prod-3',
    name: 'Juego de Sábanas Premium',
    price: 0.01, // Precio de prueba
    description: 'Sábanas de algodón egipcio',
    category: 'Dormitorio',
    brand: 'Sofamania',
    image_url: 'https://ext.same-assets.com/414402080/3239978179.jpeg'
  },
  {
    id: 'prod-4',
    name: 'Set de Copas de Vino',
    price: 0.01, // Precio de prueba
    description: 'Juego de 6 copas de cristal',
    category: 'Cocina',
    brand: 'Le Creuset',
    image_url: 'https://ext.same-assets.com/414402080/3104962945.jpeg'
  },
  {
    id: 'prod-5',
    name: 'Batidora Premium',
    price: 0.01, // Precio de prueba
    description: 'Batidora de mano profesional',
    category: 'Cocina',
    brand: 'mabe',
    image_url: 'https://ext.same-assets.com/414402080/1021847894.jpeg'
  }
]

declare global {
  interface Window {
    paypal?: any
  }
}

export default function MesaPage() {
  const router = useRouter()
  const params = useParams()
  const tableId = params.id as string
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const { addToCart } = useCart()

  const [table, setTable] = useState<GiftTable | null>(null)
  const [items, setItems] = useState<GiftTableItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<GiftTableItem | null>(null)
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' })
  const [processing, setProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalConfigured, setPaypalConfigured] = useState(false)

  useEffect(() => {
    loadGiftTable()

    // Check PayPal configuration
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!paypalClientId || paypalClientId === 'your_paypal_client_id_here' || paypalClientId.length < 10) {
      console.log('PayPal not configured, using demo mode')
      setPaypalConfigured(false)
      return
    }

    setPaypalConfigured(true)

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
    if (existingScript) {
      setPaypalLoaded(true)
      return
    }

    // Load PayPal SDK
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`
    script.addEventListener('load', () => setPaypalLoaded(true))
    script.addEventListener('error', () => {
      console.error('Error loading PayPal SDK')
      setPaypalConfigured(false)
    })
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [tableId, isDemoMode, user])

  const loadGiftTable = async () => {
    setLoading(true)

    if (isDemoMode) {
      const tables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
      // Buscar por ID o por slug
      const foundTable = tables.find((t: any) => t.id === tableId || t.slug === tableId)

      if (!foundTable) {
        alert('Mesa de regalos no encontrada')
        router.push('/')
        return
      }

      setTable(foundTable)

      const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
      const tableItems = allItems
        .filter((item: any) => item.gift_table_id === tableId)
        .map((item: any) => ({
          id: item.id,
          product: DEMO_PRODUCTS.find(p => p.id === item.product_id)!,
          quantity: item.quantity,
          reserved: item.reserved,
          reserved_by: item.reserved_by,
          reserved_by_name: item.reserved_by_name
        }))
        .filter((item: any) => item.product)

      setItems(tableItems)
      setProducts(DEMO_PRODUCTS)
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')

        // Intentar buscar por slug primero, luego por ID
        let tableData = null
        let tableError = null

        // Intenta buscar por slug
        const slugResult = await supabase
          .from('gift_tables')
          .select('*')
          .eq('slug', tableId)
          .single()

        if (slugResult.data) {
          tableData = slugResult.data
        } else {
          // Si no se encuentra por slug, intenta por ID
          const idResult = await supabase
            .from('gift_tables')
            .select('*')
            .eq('id', tableId)
            .single()

          tableData = idResult.data
          tableError = idResult.error
        }

        if (tableError || !tableData) {
          alert('Mesa de regalos no encontrada')
          router.push('/')
          return
        }

        setTable(tableData)

        const { data: productsData } = await supabase
          .from('products')
          .select('*')

        setProducts(productsData || [])

        const { data: itemsData } = await supabase
          .from('gift_table_items')
          .select(`
            id,
            quantity,
            reserved,
            reserved_by,
            products (*)
          `)
          .eq('gift_table_id', tableId)

        if (itemsData) {
          const formattedItems = itemsData.map((item: any) => ({
            id: item.id,
            product: item.products,
            quantity: item.quantity,
            reserved: item.reserved,
            reserved_by: item.reserved_by
          }))
          setItems(formattedItems)
        }
      } catch (err) {
        console.error('Error loading gift table:', err)
        alert('Error al cargar la mesa de regalos')
        router.push('/')
      }
    }

    setLoading(false)
  }

  const handleAddProduct = async (productId: string) => {
    if (isDemoMode) {
      const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
      const newItem = {
        id: `item-${Date.now()}`,
        gift_table_id: tableId,
        product_id: productId,
        quantity: 1,
        reserved: false
      }
      allItems.push(newItem)
      localStorage.setItem('demo_gift_table_items', JSON.stringify(allItems))

      setShowAddProduct(false)
      loadGiftTable()
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')
        await supabase
          .from('gift_table_items')
          .insert([{
            gift_table_id: tableId,
            product_id: productId,
            quantity: 1,
            reserved: false
          }])

        setShowAddProduct(false)
        loadGiftTable()
      } catch (err) {
        console.error('Error adding product:', err)
        alert('Error al agregar el producto')
      }
    }
  }

  const handleRemoveProduct = async (itemId: string) => {
    if (!confirm('¿Eliminar este producto de la mesa?')) return

    if (isDemoMode) {
      const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
      const updatedItems = allItems.filter((item: any) => item.id !== itemId)
      localStorage.setItem('demo_gift_table_items', JSON.stringify(updatedItems))
      loadGiftTable()
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')
        await supabase
          .from('gift_table_items')
          .delete()
          .eq('id', itemId)

        loadGiftTable()
      } catch (err) {
        console.error('Error removing product:', err)
        alert('Error al eliminar el producto')
      }
    }
  }

  const handleReserveClick = (item: GiftTableItem) => {
    if (item.reserved) {
      alert('Este regalo ya está reservado')
      return
    }
    setSelectedProduct(item)
  }

  const handleCancelReservation = () => {
    setSelectedProduct(null)
    setGuestInfo({ name: '', email: '' })
  }

  const handleAddToCart = (item: GiftTableItem) => {
    if (item.reserved) {
      alert('Este regalo ya está reservado')
      return
    }

    if (!table) return

    addToCart({
      productId: item.product.id,
      productName: item.product.name,
      productPrice: item.product.price,
      productImage: item.product.image_url || '',
      giftTableId: table.id,
      giftTableName: table.event_name,
      itemId: item.id
    })

    alert(`✓ ${item.product.name} agregado al carrito`)
  }

  const handleDemoReservation = async () => {
    if (!guestInfo.name || !guestInfo.email) {
      alert('Por favor completa tu nombre y email')
      return
    }

    if (!selectedProduct) return

    setProcessing(true)

    // Simular pequeño delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update item as reserved in localStorage
    const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
    const itemIndex = allItems.findIndex((item: any) => item.id === selectedProduct.id)

    if (itemIndex !== -1) {
      allItems[itemIndex].reserved = true
      allItems[itemIndex].reserved_by = guestInfo.email
      allItems[itemIndex].reserved_by_name = guestInfo.name
      localStorage.setItem('demo_gift_table_items', JSON.stringify(allItems))
    }

    // Save gift purchase record
    const gifts = JSON.parse(localStorage.getItem('demo_gift_purchases') || '[]')
    gifts.push({
      id: `gift-${Date.now()}`,
      gift_table_id: tableId,
      gift_table_item_id: selectedProduct.id,
      buyer_name: guestInfo.name,
      buyer_email: guestInfo.email,
      amount: selectedProduct.product.price,
      payment_method: 'placeholder',
      payment_status: 'completed',
      created_at: new Date().toISOString()
    })
    localStorage.setItem('demo_gift_purchases', JSON.stringify(gifts))

    setProcessing(false)
    alert(`¡Regalo reservado exitosamente!\n\nProducto: ${selectedProduct.product.name}\nPrecio: ${selectedProduct.product.price}\n\n(PayPal está temporalmente desactivado)`)

    setSelectedProduct(null)
    setGuestInfo({ name: '', email: '' })
    loadGiftTable()
  }

// Render PayPal button when product is selected
  useEffect(() => {
    if (selectedProduct && paypalLoaded && paypalConfigured && window.paypal && !isDemoMode) {
      const container = document.getElementById('paypal-button-container')
      if (container) {
        container.innerHTML = ''

        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: selectedProduct.product.price.toFixed(2)
                },
                description: `Regalo: ${selectedProduct.product.name} - ${table?.event_name}`
              }]
            })
          },
          onApprove: async (data: any, actions: any) => {
            setProcessing(true)
            const order = await actions.order.capture()
            console.log('Pago completado:', order)

            // Update item as reserved in localStorage
            const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
            const itemIndex = allItems.findIndex((item: any) => item.id === selectedProduct.id)

            if (itemIndex !== -1) {
              allItems[itemIndex].reserved = true
              allItems[itemIndex].reserved_by = guestInfo.email
              allItems[itemIndex].reserved_by_name = guestInfo.name
              localStorage.setItem('demo_gift_table_items', JSON.stringify(allItems))
            }

            // Save gift purchase record
            const gifts = JSON.parse(localStorage.getItem('demo_gift_purchases') || '[]')
            gifts.push({
              id: order.id,
              gift_table_id: tableId,
              gift_table_item_id: selectedProduct.id,
              buyer_name: guestInfo.name,
              buyer_email: guestInfo.email,
              amount: selectedProduct.product.price,
              payment_method: 'paypal',
              payment_status: 'completed',
              created_at: new Date().toISOString()
            })
            localStorage.setItem('demo_gift_purchases', JSON.stringify(gifts))

            setProcessing(false)
            alert(`¡Pago de ${selectedProduct.product.price} USD exitoso!\n\nGracias por tu regalo: ${selectedProduct.product.name}`)
            setSelectedProduct(null)
            setGuestInfo({ name: '', email: '' })
            loadGiftTable()
          },
          onError: (err: any) => {
            console.error('Error en el pago:', err)
            alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.')
          }
        }).render('#paypal-button-container')
      }
    }
  }, [selectedProduct, paypalLoaded, paypalConfigured, guestInfo, isDemoMode])

  const handleShare = () => {
    // Usar slug si está disponible, sino usar ID
    const identifier = table?.slug || tableId
    const url = `${window.location.origin}/mesa/${identifier}`
    navigator.clipboard.writeText(url)

    // Mostrar mensaje más bonito con la URL
    const message = table?.slug
      ? `¡Enlace copiado!\n\n${url}\n\n¡Compártelo con tus invitados! 🎉`
      : '¡Enlace copiado al portapapeles! Compártelo con tus invitados.'

    alert(message)
  }

  if (loading || !table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === table.user_id
  const totalValue = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const reservedCount = items.filter(item => item.reserved).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
            Stoja
          </Link>
          {isOwner && (
            <Link href="/mis-mesas" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Mis Mesas
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 space-y-4 md:space-y-0">
              <div className="flex-1">
                <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
                  {table.event_name}
                </h1>
                <p className="text-gray-600 mb-3">{table.event_type}</p>

                {/* Mostrar URL personalizada si existe */}
                {table.slug && (
                  <div className="inline-flex items-center bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg px-4 py-2">
                    <Share2 className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-sm text-gray-600 mr-2">URL personalizada:</span>
                    <code className="font-mono text-sm text-teal-700 font-semibold">
                      /mesa/{table.slug}
                    </code>
                  </div>
                )}
              </div>
              <button
                onClick={handleShare}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center whitespace-nowrap"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {table.slug ? 'Copiar Enlace' : 'Compartir'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                {new Date(table.event_date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {table.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {table.location}
                </div>
              )}
            </div>

            {table.description && (
              <p className="mt-4 text-gray-600">{table.description}</p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de regalos</p>
                  <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reservados</p>
                  <p className="text-2xl font-semibold text-green-600">{reservedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor total</p>
                  <p className="text-2xl font-semibold text-teal-600">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share URL Card - Solo para el dueño y si tiene slug */}
          {isOwner && table.slug && (
            <div className="mb-8">
              <ShareUrlCard slug={table.slug} eventName={table.event_name} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                Lista de Regalos
              </h2>
              {isOwner && (
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Producto
                </button>
              )}
            </div>

            {showAddProduct && isOwner && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Selecciona un producto del catálogo
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.filter(p => !items.some(i => i.product.id === p.id)).map(product => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 cursor-pointer transition-colors"
                      onClick={() => handleAddProduct(product.id)}
                    >
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                      <p className="text-lg font-semibold text-teal-600">${product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay regalos en esta mesa aún</p>
                {isOwner && (
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Agregar tu primer producto
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      item.reserved ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {item.product.brand} • {item.product.category}
                        </p>
                        <p className="text-lg font-semibold text-teal-600">
                          ${item.product.price}
                        </p>
                        {item.reserved && item.reserved_by_name && (
                          <p className="text-sm text-green-600 mt-1">
                            Reservado por {item.reserved_by_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {item.reserved ? (
                        <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg text-sm font-medium">
                          ✓ Reservado
                        </div>
                      ) : (
                        <>
                          {!isOwner && (
                            <button
                              onClick={() => handleReserveClick(item)}
                              className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Regalar
                            </button>
                          )}
                          {isOwner && (
                            <button
                              onClick={() => handleRemoveProduct(item.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-serif font-semibold text-gray-900">
                Regalar este producto
              </h3>
              <button onClick={handleCancelReservation} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                {selectedProduct.product.image_url && (
                  <img
                    src={selectedProduct.product.image_url}
                    alt={selectedProduct.product.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct.product.name}</h4>
                  <p className="text-lg font-semibold text-teal-600">${selectedProduct.product.price}</p>
                </div>
              </div>
            </div>

            {paypalConfigured && !isDemoMode ? (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  <strong>PayPal Activo:</strong> Pago real de $0.01 USD (precio de prueba).
                </p>
              </div>
            ) : (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Modo Demo:</strong> Los pagos se simularán (no son reales).
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu email
                </label>
                <input
                  type="email"
                  required
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {isDemoMode || !paypalConfigured ? (
              <button
                onClick={handleDemoReservation}
                disabled={!guestInfo.name || !guestInfo.email || processing}
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Reservando...' : 'Simular Pago y Reservar'}
              </button>
            ) : (
              <div id="paypal-button-container" className="min-h-[45px]"></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
