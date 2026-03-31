// src/pages/ProductCart.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProductCart } from '../context/ProductCartContext'

const ProductCart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getTotals } = useProductCart()
  console.log("🚀 ~ ProductCart ~ cartItems:", cartItems)
  const { subtotal, gst, total } = getTotals()
  console.log("🚀 ~ ProductCart ~ total:", total)
  console.log("🚀 ~ ProductCart ~ gst:", gst)

  const handleProceedToCheckout = () => {
    navigate('/product-checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/shop" className="gradient-animated text-white px-6 py-3 rounded-lg inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 gradient-text text-center">Your Product Cart 🛍️</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row gap-4">
                <img 
                  src={item.image || '/assets/products/shop.png'} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-bold text-xl">₹{item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{gst.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">₹{total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleProceedToCheckout}
              className="block w-full gradient-animated text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Proceed to Checkout ⚡
            </button>
            
            <Link 
              to="/shop" 
              className="block w-full text-center text-primary mt-3 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCart