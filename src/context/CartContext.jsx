// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('frontend_cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCartItems(items)
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('frontend_cart', JSON.stringify(cartItems))
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0))
  }, [cartItems])

  // Add item to cart (replaces existing cart, single item only)
  const addToCart = (item) => {
    // Clear existing cart and add new item
    const newItem = {
      id: item.id || item.serviceId,
      serviceId: item.serviceId || item.id,
      name: item.name,
      price: item.offerPrice || item.price,
      originalPrice: item.originalPrice || item.price,
      quantity: item.quantity || 1,
      image: item.image || '/assets/products/shop.png'
    }
    setCartItems([newItem])
  }

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems([])
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get cart item
  const getCartItem = () => {
    return cartItems[0] || null
  }

  // Calculate totals
  const getTotals = () => {
    if (cartItems.length === 0) return { subtotal: 0, gst: 0, total: 0 }
    
    const item = cartItems[0]
    const subtotal = item.price * item.quantity
    const gst = subtotal * 0.18
    const total = subtotal + gst
    
    return { subtotal, gst, total, item }
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartItem,
      getTotals
    }}>
      {children}
    </CartContext.Provider>
  )
}