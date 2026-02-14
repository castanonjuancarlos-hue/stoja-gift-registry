'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  quantity: number
  giftTableId: string
  giftTableName: string
  itemId: string // gift_table_item_id
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [sessionId, setSessionId] = useState('')

  // Initialize session ID on mount
  useEffect(() => {
    const id = getSessionId()
    setSessionId(id)
    setMounted(true)
  }, [])

  // Load cart from Supabase on mount
  useEffect(() => {
    if (mounted && sessionId) {
      loadCartFromSupabase()
    }
  }, [mounted, sessionId])

  const loadCartFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)

      if (error) throw error

      // Map database records to CartItem format
      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productPrice: parseFloat(item.product_price),
        productImage: item.product_image || '',
        quantity: item.quantity,
        giftTableId: item.gift_table_id,
        giftTableName: item.gift_table_name,
        itemId: item.gift_table_item_id
      }))

      setItems(cartItems)
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const addToCart = async (item: Omit<CartItem, 'id' | 'quantity'>) => {
    try {
      // Check if item already exists in database
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .eq('gift_table_item_id', item.itemId)

      if (fetchError) throw fetchError

      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const existingItem = existingItems[0]
        const newQuantity = existingItem.quantity + 1

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)

        if (updateError) throw updateError

        // Update local state
        setItems(currentItems =>
          currentItems.map(i =>
            i.id === existingItem.id
              ? { ...i, quantity: newQuantity }
              : i
          )
        )
      } else {
        // Insert new item
        const { data: newItem, error: insertError } = await supabase
          .from('cart_items')
          .insert([{
            session_id: sessionId,
            product_id: item.productId,
            product_name: item.productName,
            product_price: item.productPrice,
            product_image: item.productImage,
            quantity: 1,
            gift_table_id: item.giftTableId,
            gift_table_name: item.giftTableName,
            gift_table_item_id: item.itemId
          }])
          .select()
          .single()

        if (insertError) throw insertError

        // Update local state
        const cartItem: CartItem = {
          id: newItem.id,
          productId: newItem.product_id,
          productName: newItem.product_name,
          productPrice: parseFloat(newItem.product_price),
          productImage: newItem.product_image || '',
          quantity: newItem.quantity,
          giftTableId: newItem.gift_table_id,
          giftTableName: newItem.gift_table_name,
          itemId: newItem.gift_table_item_id
        }

        setItems(currentItems => [...currentItems, cartItem])
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(currentItems => currentItems.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
