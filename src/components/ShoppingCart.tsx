'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { X, Trash2, Plus, Minus, ShoppingCart as CartIcon } from 'lucide-react'

export function ShoppingCart() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart()
  const { isDemoMode } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' })
  const [processing, setProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    // Load PayPal SDK
    if (!isDemoMode && items.length > 0 && !paypalLoaded) {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
      script.addEventListener('load', () => setPaypalLoaded(true))
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isDemoMode, items.length, paypalLoaded])

  const handleReserveAll = async () => {
    if (!guestInfo.name || !guestInfo.email) {
      alert('Por favor completa tu nombre y email')
      return
    }

    if (items.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setProcessing(true)

    // Simular pequeño delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Placeholder - guardar en localStorage
      const allItems = JSON.parse(localStorage.getItem('demo_gift_table_items') || '[]')
      const gifts = JSON.parse(localStorage.getItem('demo_gift_purchases') || '[]')

      items.forEach(cartItem => {
        // Update item as reserved
        const itemIndex = allItems.findIndex((item: any) => item.id === cartItem.itemId)
        if (itemIndex !== -1) {
          allItems[itemIndex].reserved = true
          allItems[itemIndex].reserved_by = guestInfo.email
          allItems[itemIndex].reserved_by_name = guestInfo.name
        }

        // Save gift purchase record
        gifts.push({
          id: `gift-${Date.now()}-${Math.random()}`,
          gift_table_id: cartItem.giftTableId,
          gift_table_item_id: cartItem.itemId,
          buyer_name: guestInfo.name,
          buyer_email: guestInfo.email,
          amount: cartItem.productPrice,
          payment_method: 'placeholder',
          payment_status: 'completed',
          created_at: new Date().toISOString()
        })
      })

      localStorage.setItem('demo_gift_table_items', JSON.stringify(allItems))
      localStorage.setItem('demo_gift_purchases', JSON.stringify(gifts))

      alert(`¡${items.length} regalo(s) reservado(s) exitosamente!\n\nTotal: ${getTotalPrice().toFixed(2)}\n\n(PayPal está temporalmente desactivado)`)

      clearCart()
      setGuestInfo({ name: '', email: '' })
      setIsOpen(false)
    } catch (error) {
      console.error('Error processing reservation:', error)
      alert('Hubo un error al procesar la reserva. Por favor intenta de nuevo.')
    } finally {
      setProcessing(false)
    }
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <CartIcon className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Sliding Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                Carrito de Regalos
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <CartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.giftTableName}
                        </p>
                        <p className="text-teal-600 font-semibold text-sm">
                          ${item.productPrice.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-teal-600">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Guest Info */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={guestInfo.name}
                    onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={guestInfo.email}
                    onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Reserve Button */}
                <button
                  onClick={handleReserveAll}
                  disabled={processing || !guestInfo.name || !guestInfo.email}
                  className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Procesando...' : `Reservar ${totalItems} Regalo(s)`}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
