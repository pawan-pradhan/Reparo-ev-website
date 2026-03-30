// src/pages
// 


// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCart } from '../context/CartContext'

// ✅ LIVE RAZORPAY KEY from .env
// const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
const RAZORPAY_KEY = 'rzp_live_SUYuHzHNwzbCJP'

const Checkout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { getCartItem, getTotals, clearCart } = useCart()
  
  const [service, setService] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderCreating, setOrderCreating] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.mobile_number || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    notes: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // ✅ Load Razorpay Script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true)
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }
    loadRazorpayScript()
  }, [])

  useEffect(() => {
    const cartItem = getCartItem()
    if (!cartItem) {
      navigate('/shop')
      return
    }
    setService(cartItem)
    setQuantity(cartItem.quantity)
  }, [navigate, getCartItem])

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    })
  }

  const calculateTotals = () => {
    if (!service) return { subtotal: 0, gst: 0, total: 0 }
    const subtotal = service.price * quantity
    const gst = subtotal * 0.18
    const total = subtotal + gst
    return { subtotal, gst, total }
  }

  const { subtotal, gst, total } = calculateTotals()

  // ✅ Razorpay Payment Function
  const openRazorpay = (orderData) => {
    return new Promise((resolve, reject) => {
      const razorpayOrderId = orderData.order_id
      
      if (!razorpayOrderId) {
        console.error('No order_id received:', orderData)
        reject(new Error('Payment initialization failed. Please try again.'))
        return
      }

      if (!razorpayLoaded) {
        reject(new Error('Payment system loading. Please try again.'))
        return
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(orderData.order_total_amount * 100),
        currency: "INR",
        name: "Reparo",
        description: `${service.name} x ${quantity}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          console.log("Payment Success:", response)
          resolve(response)
        },
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email || ''
        },
        notes: {
          service_id: service.serviceId,
          service_name: service.name,
          quantity: quantity
        },
        theme: {
          color: "#0b86d0"
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled'))
          }
        }
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error)
        reject(new Error(response.error.description || 'Payment failed'))
      })
      
      rzp.open()
    })
  }

  // ✅ Verify Payment API
  const verifyPayment = async (paymentResponse) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('https://reparo24.com/web/service_payment_checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      })

      const data = await res.json()
      console.log('Verify Payment Response:', data)

      if (data.status === 200 || data.success) {
        return true
      } else {
        throw new Error(data.message || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Verify Payment Error:', error)
      throw error
    }
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    
    if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
      alert('Please fill all required fields')
      return
    }
    
    if (address.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }
    
    if (address.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode')
      return
    }
    
    setOrderCreating(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      const orderPayload = {
        quantity: quantity,
        service_id: service.serviceId || service.id,
        billing_address: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          pincode: address.pincode,
          notes: address.notes
        },
        payment_mode: paymentMethod
      }
      
      console.log('Order Payload:', orderPayload)
      
      const response = await fetch('https://reparo24.com/web/create_service_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })
      
      const data = await response.json()
      console.log('Order Response:', data)
      
      if (data.success) {
        if (paymentMethod === 'cod') {
          clearCart()
          alert('Order placed successfully!')
          navigate('/dashboard/orders')
        } else {
          // ✅ Online Payment
          if (!razorpayLoaded) {
            alert('Payment system is loading. Please wait and try again.')
            setOrderCreating(false)
            return
          }
          
          try {
            const paymentResponse = await openRazorpay(data.data)
            console.log('Payment Response:', paymentResponse)
            
            const verified = await verifyPayment(paymentResponse)
            
            if (verified) {
              clearCart()
              alert('Payment successful! Order placed successfully.')
              navigate('/dashboard/orders')
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (paymentError) {
            console.error('Payment Error:', paymentError)
            alert(paymentError.message || 'Payment failed. Please try again.')
          }
        }
      } else {
        alert(data.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setOrderCreating(false)
    }
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading checkout...</p>
      </div>
    )
  }

  return (
    <section className="checkout-section py-5">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-bold text-3xl mb-5 gradient-text">Checkout ⚡</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ADDRESS FORM */}
          <div className="lg:w-7/12">
            <div className="checkout-card bg-white rounded-xl shadow-md p-6">
              <h5 className="font-semibold text-lg mb-4">Delivery Address</h5>

              <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Mobile Number"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="address"
                      value={address.address}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Address Line"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Pincode"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      name="notes"
                      value={address.notes}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      rows="3"
                      placeholder="Additional Notes (Optional)"
                    />
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <h5 className="font-semibold text-lg mt-6 mb-3">Payment Method</h5>
                <div className="payment-box space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>UPI / Card Payment</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={orderCreating}
                  className="w-full gradient-animated text-white py-3 rounded-lg font-semibold mt-6 hover:opacity-90 transition disabled:opacity-50"
                >
                  {orderCreating ? 'Placing Order...' : 'Place Order ⚡'}
                </button>
              </form>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:w-5/12">
            <div className="checkout-card bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h5 className="font-semibold text-lg mb-4">Order Summary</h5>
              <hr className="mb-4" />

              <div className="mb-4">
                <div className="flex justify-between items-center mb-3 pb-3 border-b">
                  <div>
                    <h6 className="font-semibold">{service.name}</h6>
                    <p className="text-sm text-gray-500">₹{service.price} per item</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{service.price * quantity}</p>
                  </div>
                </div>
              </div>

              <hr className="my-3" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} items):</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <h5 className="font-bold text-lg">Total:</h5>
                <h5 className="font-bold text-lg text-primary">₹{total.toFixed(2)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout






// /Checkout.jsx
// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useCart } from '../context/CartContext'

// // ✅ RAZORPAY KEY from .env
// const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

// const Checkout = () => {
//   const navigate = useNavigate()
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const { getCartItem, getTotals, clearCart } = useCart()
  
//   const [service, setService] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const [orderCreating, setOrderCreating] = useState(false)
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  
//   const [address, setAddress] = useState({
//     name: user?.name || '',
//     phone: user?.mobile_number || '',
//     address: user?.address || '',
//     city: user?.city || '',
//     pincode: user?.pincode || '',
//     notes: ''
//   })
  
//   const [paymentMethod, setPaymentMethod] = useState('cod')

//   // ✅ Load Razorpay Script on component mount
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           setRazorpayLoaded(true)
//           resolve(true)
//           return
//         }
//         const script = document.createElement('script')
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js'
//         script.onload = () => {
//           setRazorpayLoaded(true)
//           resolve(true)
//         }
//         script.onerror = () => {
//           console.error('Failed to load Razorpay script')
//           resolve(false)
//         }
//         document.body.appendChild(script)
//       })
//     }
//     loadRazorpayScript()
//   }, [])

//   useEffect(() => {
//     const cartItem = getCartItem()
//     if (!cartItem) {
//       navigate('/shop')
//       return
//     }
//     setService(cartItem)
//     setQuantity(cartItem.quantity)
//   }, [navigate, getCartItem])

//   const handleAddressChange = (e) => {
//     setAddress({
//       ...address,
//       [e.target.name]: e.target.value
//     })
//   }

//   const calculateTotals = () => {
//     if (!service) return { subtotal: 0, gst: 0, total: 0 }
//     const subtotal = service.price * quantity
//     const gst = subtotal * 0.18
//     const total = subtotal + gst
//     return { subtotal, gst, total }
//   }

//   const { subtotal, gst, total } = calculateTotals()

//   // ✅ FIXED: Razorpay Payment Function
//   const openRazorpay = (orderData) => {
//     return new Promise((resolve, reject) => {
//       // ✅ Use 'order_id' from backend response
//       const razorpayOrderId = orderData.order_id
      
//       if (!razorpayOrderId) {
//         console.error('No order_id received:', orderData)
//         reject(new Error('Payment initialization failed. Please try again.'))
//         return
//       }

//       if (!razorpayLoaded) {
//         reject(new Error('Razorpay SDK not loaded. Please refresh the page.'))
//         return
//       }

//       const options = {
//         key: RAZORPAY_KEY,
//         amount: Math.round(orderData.order_total_amount * 100), // paise mein
//         currency: "INR",
//         name: "Reparo",
//         description: `Service: ${service.name} x ${quantity}`,
//         order_id: razorpayOrderId, // ✅ YEH SAHI HAI
//         handler: async function (response) {
//           console.log("Payment Success:", response)
//           resolve(response)
//         },
//         prefill: {
//           name: address.name,
//           contact: address.phone,
//           email: user?.email || ''
//         },
//         notes: {
//           service_id: service.serviceId,
//           service_name: service.name,
//           quantity: quantity
//         },
//         theme: {
//           color: "#0b86d0"
//         },
//         modal: {
//           ondismiss: function() {
//             reject(new Error('Payment cancelled by user'))
//           }
//         }
//       }

//       const rzp = new window.Razorpay(options)
      
//       // ✅ Payment failed handler
//       rzp.on('payment.failed', function (response) {
//         console.error('Payment Failed:', response.error)
//         reject(new Error(response.error.description || 'Payment failed'))
//       })
      
//       rzp.open()
//     })
//   }

//   // ✅ Verify Payment API
//   const verifyPayment = async (paymentResponse) => {
//     try {
//       const token = localStorage.getItem('token')
//       const res = await fetch('https://reparo24.com/web/service_payment_checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           razorpay_order_id: paymentResponse.razorpay_order_id,
//           razorpay_payment_id: paymentResponse.razorpay_payment_id,
//           razorpay_signature: paymentResponse.razorpay_signature
//         })
//       })

//       const data = await res.json()
//       console.log('Verify Payment Response:', data)

//       if (data.status === 200 || data.success) {
//         return true
//       } else {
//         throw new Error(data.message || 'Payment verification failed')
//       }
//     } catch (error) {
//       console.error('Verify Payment Error:', error)
//       throw error
//     }
//   }

//   const handleSubmitOrder = async (e) => {
//     e.preventDefault()
    
//     if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
//       alert('Please fill all required fields')
//       return
//     }
    
//     if (address.phone.length !== 10) {
//       alert('Please enter a valid 10-digit mobile number')
//       return
//     }
    
//     if (address.pincode.length !== 6) {
//       alert('Please enter a valid 6-digit pincode')
//       return
//     }
    
//     setOrderCreating(true)
    
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         navigate('/login')
//         return
//       }
      
//       const orderPayload = {
//         quantity: quantity,
//         service_id: service.serviceId || service.id,
//         billing_address: {
//           name: address.name,
//           phone: address.phone,
//           address: address.address,
//           city: address.city,
//           pincode: address.pincode,
//           notes: address.notes
//         },
//         payment_mode: paymentMethod
//       }
      
//       console.log('Order Payload:', orderPayload)
      
//       const response = await fetch('https://reparo24.com/web/create_service_order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(orderPayload)
//       })
      
//       const data = await response.json()
//       console.log('Order Response:', data)
      
//       if (data.success) {
//         if (paymentMethod === 'cod') {
//           clearCart()
//           alert('Order placed successfully!')
//           navigate('/dashboard/orders')
//         } else {
//           // ✅ Online Payment
//           try {
//             // Check if Razorpay is loaded
//             if (!razorpayLoaded) {
//               alert('Payment system is loading. Please try again.')
//               return
//             }
            
//             const paymentResponse = await openRazorpay(data.data)
//             console.log('Payment Response:', paymentResponse)
            
//             // ✅ Verify Payment
//             const verified = await verifyPayment(paymentResponse)
            
//             if (verified) {
//               clearCart()
//               alert('Payment successful! Order placed successfully.')
//               navigate('/dashboard/orders')
//             } else {
//               alert('Payment verification failed. Please contact support.')
//             }
//           } catch (paymentError) {
//             console.error('Payment Error:', paymentError)
//             alert(paymentError.message || 'Payment failed. Please try again.')
//           }
//         }
//       } else {
//         alert(data.message || 'Failed to create order')
//       }
//     } catch (error) {
//       console.error('Order creation error:', error)
//       alert('Failed to create order. Please try again.')
//     } finally {
//       setOrderCreating(false)
//     }
//   }

//   if (!service) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading checkout...</p>
//       </div>
//     )
//   }

//   return (
//     <section className="checkout-section py-5">
//       <div className="container mx-auto px-4">
//         <h2 className="text-center font-bold text-3xl mb-5 gradient-text">Checkout ⚡</h2>

//         <div className="flex flex-col lg:flex-row gap-8">
          
//           {/* ADDRESS FORM */}
//           <div className="lg:w-7/12">
//             <div className="checkout-card bg-white rounded-xl shadow-md p-6">
//               <h5 className="font-semibold text-lg mb-4">Delivery Address</h5>

//               <form onSubmit={handleSubmitOrder}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       name="name"
//                       value={address.name}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Full Name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={address.phone}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Mobile Number"
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <input
//                       type="text"
//                       name="address"
//                       value={address.address}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Address Line"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       name="city"
//                       value={address.city}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="City"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={address.pincode}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Pincode"
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <textarea
//                       name="notes"
//                       value={address.notes}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       rows="3"
//                       placeholder="Additional Notes (Optional)"
//                     />
//                   </div>
//                 </div>

//                 {/* PAYMENT METHOD */}
//                 <h5 className="font-semibold text-lg mt-6 mb-3">Payment Method</h5>
//                 <div className="payment-box space-y-3">
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="cod"
//                       checked={paymentMethod === 'cod'}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-4 h-4 text-primary"
//                     />
//                     <span>Cash on Delivery</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="online"
//                       checked={paymentMethod === 'online'}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-4 h-4 text-primary"
//                     />
//                     <span>UPI / Card Payment</span>
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={orderCreating}
//                   className="w-full gradient-animated text-white py-3 rounded-lg font-semibold mt-6 hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {orderCreating ? 'Placing Order...' : 'Place Order ⚡'}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* ORDER SUMMARY */}
//           <div className="lg:w-5/12">
//             <div className="checkout-card bg-white rounded-xl shadow-md p-6 sticky top-24">
//               <h5 className="font-semibold text-lg mb-4">Order Summary</h5>
//               <hr className="mb-4" />

//               <div className="mb-4">
//                 <div className="flex justify-between items-center mb-3 pb-3 border-b">
//                   <div>
//                     <h6 className="font-semibold">{service.name}</h6>
//                     <p className="text-sm text-gray-500">₹{service.price} per item</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-primary">₹{service.price * quantity}</p>
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-3" />

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST (18%):</span>
//                   <span>₹{gst.toFixed(2)}</span>
//                 </div>
//               </div>

//               <hr className="my-3" />

//               <div className="flex justify-between mt-3">
//                 <h5 className="font-bold text-lg">Total:</h5>
//                 <h5 className="font-bold text-lg text-primary">₹{total.toFixed(2)}</h5>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Checkout









// import React, { useState, useEffect } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// const Checkout = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
  
//   const [service, setService] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [orderCreating, setOrderCreating] = useState(false)
  
//   const [address, setAddress] = useState({
//     name: user?.name || '',
//     phone: user?.mobile_number || '',
//     address: user?.address || '',
//     city: user?.city || '',
//     pincode: user?.pincode || '',
//     notes: ''
//   })
  
//   const [paymentMethod, setPaymentMethod] = useState('cod')
//   const [orderData, setOrderData] = useState(null)

//   useEffect(() => {
//     // Get service data from location state or localStorage
//     const serviceData = location.state?.service || JSON.parse(localStorage.getItem('checkout_service'))
    
//     if (!serviceData) {
//       navigate('/shop')
//       return
//     }
    
//     setService(serviceData)
    
//     // Clear after loading
//     localStorage.removeItem('checkout_service')
//   }, [location, navigate])

//   const handleAddressChange = (e) => {
//     setAddress({
//       ...address,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleQuantityChange = (delta) => {
//     const newQuantity = quantity + delta
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity)
//     }
//   }

//   const calculateTotals = () => {
//     if (!service) return { subtotal: 0, gst: 0, total: 0 }
    
//     const subtotal = (service.offerPrice || service.price) * quantity
//     const gst = subtotal * 0.18
//     const total = subtotal + gst
    
//     return { subtotal, gst, total }
//   }

//   const { subtotal, gst, total } = calculateTotals()

//   const handleSubmitOrder = async (e) => {
//     e.preventDefault()
    
//     // Validate address
//     if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
//       alert('Please fill all required fields')
//       return
//     }
    
//     if (address.phone.length !== 10) {
//       alert('Please enter a valid 10-digit mobile number')
//       return
//     }
    
//     if (address.pincode.length !== 6) {
//       alert('Please enter a valid 6-digit pincode')
//       return
//     }
    
//     setOrderCreating(true)
    
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         navigate('/login')
//         return
//       }
      
//       const orderPayload = {
//         quantity: quantity,
//         service_id: service.serviceId || service.id,
//         billing_address: {
//           name: address.name,
//           phone: address.phone,
//           address: address.address,
//           city: address.city,
//           pincode: address.pincode,
//           notes: address.notes
//         },
//         payment_mode: paymentMethod
//       }
      
//       console.log('Order Payload:', orderPayload)
      
//       const response = await fetch('https://reparo24.com/web/create_service_order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(orderPayload)
//       })
      
//       const data = await response.json()
//       console.log('Order Response:', data)
      
//       if (data.success) {
//         setOrderData(data.data)
        
//         if (paymentMethod === 'cod') {
//           // For COD, order is complete
//           alert(`Order placed successfully!\nOrder ID: ${data.data.order_id}\nTotal Amount: ₹${data.data.order_total_amount}`)
//           navigate('/dashboard/orders')
//         } else {
//           // For online payment, redirect to payment gateway
//           // You can integrate Razorpay here
//           alert('Online payment integration coming soon. Using COD for now.')
//           // For demo, treat as success
//           navigate('/dashboard/orders')
//         }
//       } else {
//         alert(data.message || 'Failed to create order')
//       }
//     } catch (error) {
//       console.error('Order creation error:', error)
//       alert('Failed to create order. Please try again.')
//     } finally {
//       setOrderCreating(false)
//     }
//   }

//   if (!service) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading checkout...</p>
//       </div>
//     )
//   }

//   return (
//     <section className="checkout-section py-5">
//       <div className="container mx-auto px-4">
//         <h2 className="text-center font-bold text-3xl mb-5 gradient-text">Checkout ⚡</h2>

//         <div className="flex flex-col lg:flex-row gap-8">
          
//           {/* ADDRESS FORM */}
//           <div className="lg:w-7/12">
//             <div className="checkout-card bg-white rounded-xl shadow-md p-6">
//               <h5 className="font-semibold text-lg mb-4">Delivery Address</h5>

//               <form id="checkoutForm" onSubmit={handleSubmitOrder}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       name="name"
//                       value={address.name}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Full Name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={address.phone}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Mobile Number"
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <input
//                       type="text"
//                       name="address"
//                       value={address.address}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Address Line"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       name="city"
//                       value={address.city}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="City"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={address.pincode}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       placeholder="Pincode"
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <textarea
//                       name="notes"
//                       value={address.notes}
//                       onChange={handleAddressChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                       rows="3"
//                       placeholder="Additional Notes (Optional)"
//                     />
//                   </div>
//                 </div>

//                 {/* PAYMENT METHOD */}
//                 <h5 className="font-semibold text-lg mt-6 mb-3">Payment Method</h5>
//                 <div className="payment-box space-y-3">
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="cod"
//                       checked={paymentMethod === 'cod'}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-4 h-4 text-primary"
//                     />
//                     <span>Cash on Delivery</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="online"
//                       checked={paymentMethod === 'online'}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-4 h-4 text-primary"
//                     />
//                     <span>UPI / Card Payment</span>
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={orderCreating}
//                   className="w-full gradient-animated text-white py-3 rounded-lg font-semibold mt-6 hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {orderCreating ? 'Placing Order...' : 'Place Order ⚡'}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* ORDER SUMMARY */}
//           <div className="lg:w-5/12">
//             <div className="checkout-card bg-white rounded-xl shadow-md p-6 sticky top-24">
//               <h5 className="font-semibold text-lg mb-4">Order Summary</h5>
//               <hr className="mb-4" />

//               {/* Order Items */}
//               <div id="orderItems" className="mb-4">
//                 <div className="flex justify-between items-center mb-3 pb-3 border-b">
//                   <div>
//                     <h6 className="font-semibold">{service.name}</h6>
//                     <p className="text-sm text-gray-500">₹{service.offerPrice || service.price} per item</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-center gap-2 mb-1">
//                       <button
//                         onClick={() => handleQuantityChange(-1)}
//                         className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary transition flex items-center justify-center"
//                       >
//                         -
//                       </button>
//                       <span className="w-8 text-center font-medium">{quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange(1)}
//                         className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary transition flex items-center justify-center"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <p className="font-semibold text-primary">₹{(service.offerPrice || service.price) * quantity}</p>
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-3" />

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST (18%):</span>
//                   <span>₹{gst.toFixed(2)}</span>
//                 </div>
//               </div>

//               <hr className="my-3" />

//               <div className="flex justify-between mt-3">
//                 <h5 className="font-bold text-lg">Total:</h5>
//                 <h5 className="font-bold text-lg text-primary">₹{total.toFixed(2)}</h5>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Checkout