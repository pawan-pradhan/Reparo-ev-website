// src/context/ProductCartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'

const ProductCartContext = createContext()

export const useProductCart = () => {
  const context = useContext(ProductCartContext)
  if (!context) {
    throw new Error('useProductCart must be used within ProductCartProvider')
  }
  return context
}

export const ProductCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('product_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('product_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id)
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prevItems, { ...item, quantity }]
    })
  }

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get cart total quantity
  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Get cart total amount
  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  // Calculate totals with GST
  const getTotals = () => {
    const subtotal = getTotalAmount()
    const gst = subtotal * 0.18
    const total = subtotal + gst
    return { subtotal, gst, total, items: cartItems }
  }

  return (
    <ProductCartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalQuantity,
      getTotalAmount,
      getTotals
    }}>
      {children}
    </ProductCartContext.Provider>
  )
}