// src/pages/Cart.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { getCartItem, updateQuantity, removeFromCart, getTotals } = useCart()
  
  const cartItem = getCartItem()
  const { subtotal, gst, total, item } = getTotals()

  const handleQuantityChange = (delta) => {
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity >= 1) {
        updateQuantity(item.id, newQuantity)
      }
    }
  }

  const handleRemoveItem = () => {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      removeFromCart()
    }
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout')
  }

  if (!cartItem) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any services to your cart yet.</p>
          <Link to="/shop" className="gradient-animated text-white px-6 py-3 rounded-lg inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 gradient-text text-center">Service Cart 🛒</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              <img 
                src={cartItem.image || '/assets/products/shop.png'} 
                alt={cartItem.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{cartItem.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-bold text-xl">₹{cartItem.price}</span>
                      {cartItem.originalPrice && cartItem.originalPrice > cartItem.price && (
                        <span className="text-gray-400 line-through text-sm">₹{cartItem.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{cartItem.price * cartItem.quantity}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRemoveItem}
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
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
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
              to="/" 
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

export default Cart






// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useCart } from '../context/CartContext'

// const Cart = () => {
//   const navigate = useNavigate()
//   const { getCartItem, updateQuantity, removeFromCart, getTotals } = useCart()
  
//   const cartItem = getCartItem()
//   const { subtotal, gst, total, item } = getTotals()

//   const handleQuantityChange = (delta) => {
//     if (item) {
//       const newQuantity = item.quantity + delta
//       if (newQuantity >= 1) {
//         updateQuantity(item.id, newQuantity)
//       }
//     }
//   }

//   const handleRemoveItem = () => {
//     if (confirm('Are you sure you want to remove this item from cart?')) {
//       removeFromCart()
//     }
//   }

//   const handleProceedToCheckout = () => {
//     navigate('/checkout')
//   }

//   if (!cartItem) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="max-w-md mx-auto">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
//           <p className="text-gray-600 mb-6">Looks like you haven't added any services to your cart yet.</p>
//           <Link to="/shop" className="gradient-animated text-white px-6 py-3 rounded-lg inline-block">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-16">
//       <h1 className="text-3xl font-bold mb-8 gradient-text text-center">Your Cart 🛒</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <img 
//                 src={cartItem.image || '/assets/products/shop.png'} 
//                 alt={cartItem.name}
//                 className="w-24 h-24 object-cover rounded-lg"
//               />
              
//               <div className="flex-1">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                   <div>
//                     <h3 className="font-semibold text-lg">{cartItem.name}</h3>
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-primary font-bold text-xl">₹{cartItem.price}</span>
//                       {cartItem.originalPrice && cartItem.originalPrice > cartItem.price && (
//                         <span className="text-gray-400 line-through text-sm">₹{cartItem.originalPrice}</span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="text-right">
//                     <p className="font-bold text-lg">₹{cartItem.price * cartItem.quantity}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between mt-4">
//                   <div className="flex items-center gap-3">
//                     <label className="text-sm text-gray-600">Quantity:</label>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleQuantityChange(-1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
//                       >
//                         -
//                       </button>
//                       <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange(1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={handleRemoveItem}
//                     className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
//             <div className="space-y-3 border-b pb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium">₹{subtotal}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">GST (18%)</span>
//                 <span className="font-medium">₹{gst.toFixed(2)}</span>
//               </div>
//             </div>
            
//             <div className="flex justify-between mt-4 mb-6">
//               <span className="font-bold text-lg">Total</span>
//               <span className="font-bold text-xl text-primary">₹{total.toFixed(2)}</span>
//             </div>
            
//             <button
//               onClick={handleProceedToCheckout}
//               className="block w-full gradient-animated text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition"
//             >
//               Proceed to Checkout ⚡
//             </button>
            
//             <Link 
//               to="/shop" 
//               className="block w-full text-center text-primary mt-3 hover:underline"
//             >
//               ← Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Cart



// // src/pages/Cart.jsx
// import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
// import { getCartItems, updateCartQuantity, removeCartItem } from '../services/api'
// import { setCartItems, removeFromCart, updateQuantity } from '../store/slices/cartSlice'

// const Cart = () => {
//   const dispatch = useDispatch()
//   const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart)
//   const [loading, setLoading] = useState(true)
//   const [updating, setUpdating] = useState(false)
//   const [removingId, setRemovingId] = useState(null)

//   useEffect(() => {
//     fetchCartItems()
//   }, [])

//   const fetchCartItems = async () => {
//     try {
//       setLoading(true)
//       const response = await getCartItems()
//       console.log('Cart API Response:', response)
      
//       if (response.success && response.data) {
//         const cartItems = response.data.map(item => ({
//           id: item._id,
//           cartItemId: item._id, // Store the cart item ID for remove/update
//           serviceId: item.service_id?._id || item.service_id,
//           name: item.service_id?.title || item.service_id?.name || 'Service',
//           price: item.service_id?.offer_price || item.service_id?.price || 0,
//           originalPrice: item.service_id?.price,
//           quantity: item.quantity,
//           image: item.service_id?.image || '/assets/products/shop.png'
//         }))
        
//         dispatch(setCartItems(cartItems))
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error)
//       alert('Failed to load cart items')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateQuantity = async (cartItemId, currentQuantity, newQuantity) => {
//     if (newQuantity < 1) return
    
//     setUpdating(true)
//     try {
//       const response = await updateCartQuantity(cartItemId, newQuantity)
//       console.log('Update Quantity Response:', response)
      
//       if (response.success) {
//         dispatch(updateQuantity({ id: cartItemId, quantity: newQuantity }))
//       } else {
//         alert(response.message || 'Failed to update quantity')
//       }
//     } catch (error) {
//       console.error('Error updating quantity:', error)
//       alert('Failed to update quantity')
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const handleRemoveItem = async (cartItemId, itemName) => {
//     if (!confirm(`Are you sure you want to remove "${itemName}" from your cart?`)) return
    
//     setRemovingId(cartItemId)
//     try {
//       const response = await removeCartItem(cartItemId)
//       console.log('Remove Item Response:', response)
      
//       if (response.success) {
//         dispatch(removeFromCart(cartItemId))
//         alert('Item removed from cart successfully!')
//       } else {
//         alert(response.message || 'Failed to remove item')
//       }
//     } catch (error) {
//       console.error('Error removing item:', error)
//       alert('Failed to remove item. Please try again.')
//     } finally {
//       setRemovingId(null)
//     }
//   }

//   // Calculate GST (18%)
//   const gstAmount = totalAmount * 0.18
//   const finalTotal = totalAmount + gstAmount

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading your cart...</p>
//       </div>
//     )
//   }

//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="max-w-md mx-auto">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
//           <p className="text-gray-600 mb-6">Looks like you haven't added any services to your cart yet.</p>
//           <Link to="/shop" className="gradient-animated text-white px-6 py-3 rounded-lg inline-block">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-16">
//       <h1 className="text-3xl font-bold mb-8 gradient-text text-center">Your Cart 🛒</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           {items.map((item) => (
//             <div key={item.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <img 
//                   src={item.image || '/assets/products/shop.png'} 
//                   alt={item.name}
//                   className="w-24 h-24 object-cover rounded-lg"
//                 />
                
//                 <div className="flex-1">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                     <div>
//                       <h3 className="font-semibold text-lg">{item.name}</h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className="text-primary font-bold text-xl">₹{item.price}</span>
//                         {item.originalPrice && item.originalPrice > item.price && (
//                           <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-4">
//                     <div className="flex items-center gap-3">
//                       <label className="text-sm text-gray-600">Quantity:</label>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleUpdateQuantity(item.cartItemId || item.id, item.quantity, item.quantity - 1)}
//                           disabled={updating}
//                           className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition disabled:opacity-50"
//                         >
//                           -
//                         </button>
//                         <span className="w-8 text-center font-medium">{item.quantity}</span>
//                         <button
//                           onClick={() => handleUpdateQuantity(item.cartItemId || item.id, item.quantity, item.quantity + 1)}
//                           disabled={updating}
//                           className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition disabled:opacity-50"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={() => handleRemoveItem(item.cartItemId || item.id, item.name)}
//                       disabled={removingId === (item.cartItemId || item.id)}
//                       className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
//                     >
//                       {removingId === (item.cartItemId || item.id) ? (
//                         <>
//                           <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           <span>Removing...</span>
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           <span>Remove</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
//             <div className="space-y-3 border-b pb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
//                 <span className="font-medium">₹{totalAmount}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">GST (18%)</span>
//                 <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
//               </div>
//             </div>
            
//             <div className="flex justify-between mt-4 mb-6">
//               <span className="font-bold text-lg">Total</span>
//               <span className="font-bold text-xl text-primary">₹{finalTotal.toFixed(2)}</span>
//             </div>
            
//             <Link 
//               to="/checkout" 
//               className="block w-full gradient-animated text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition"
//             >
//               Proceed to Checkout ⚡
//             </Link>
            
//             <Link 
//               to="/shop" 
//               className="block w-full text-center text-primary mt-3 hover:underline"
//             >
//               ← Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Cart