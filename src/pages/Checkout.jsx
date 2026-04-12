// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCart } from '../context/CartContext'

const VITE_RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID 


// ✅ LIVE RAZORPAY KEY from .env
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

const Checkout = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { getCartItem, getTotals, clearCart } = useCart()
  
  const [service, setService] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderCreating, setOrderCreating] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [currentOrderId, setCurrentOrderId] = useState(null)
  
  // ✅ Get saved city from localStorage
  const savedCity = localStorage.getItem('selected_location_name')
  
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.mobile_number || '',
    address: user?.address || '',
    city: savedCity || user?.city || '',
    pincode: user?.pincode || '',
    notes: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('online')

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
      navigate('/services')
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

  // ✅ Function to send failed payment status to backend
  const sendFailedPaymentStatus = async (orderId, reason) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/web/service_payment_checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id : 'null',
          razorpay_signature : 'null',
          status: 'failed',
          failure_reason: reason
        })
      })
      const data = await res.json()
      // console.log('Failed Payment Status Sent:', data)
    } catch (error) {
      console.error('Error sending failed status:', error)
    }
  }

  // ✅ Razorpay Payment Function with proper status handling
  const openRazorpay = (orderData) => {
    return new Promise((resolve, reject) => {
      const razorpayOrderId = orderData.order_id
      
      if (!razorpayOrderId) {
        // console.error('No order_id received:', orderData)
        reject({ status: 'error', message: 'Payment initialization failed' })
        return
      }

      if (!razorpayLoaded) {
        reject({ status: 'error', message: 'Payment system loading. Please try again.' })
        return
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(orderData.order_total_amount * 100),
        currency: "INR",
        name: "Reparo",
        description: `${service.name} x ${quantity}`,
        order_id: razorpayOrderId,
        
        // ✅ SUCCESS: Jab user payment karega
        handler: async function (response) {
          // console.log("✅ Payment Success:", response)
          resolve({ status: 'success', data: response, orderData: orderData })
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
        
        // ✅ CANCELLED: Jab user close button press karega
        modal: {
          ondismiss: async function() {
            // console.log("❌ User cancelled payment")
            // ✅ Send failed status to backend
            await sendFailedPaymentStatus(orderData.order_id, 'User cancelled payment')
            reject({ status: 'cancelled', message: 'Payment cancelled by user', orderId: orderData.order_id })
          }
        }
      }

      const rzp = new window.Razorpay(options)
      
      // ✅ FAILED: Agar payment fail ho jaye
      rzp.on('payment.failed', async function (response) {
        // console.error("❌ Payment Failed:", response.error)
        // ✅ Send failed status to backend
        await sendFailedPaymentStatus(orderData.order_id, response.error.description || 'Payment failed')
        reject({ 
          status: 'failed', 
          message: response.error.description || 'Payment failed',
          error: response.error,
          orderId: orderData.order_id
        })
      })
      
      rzp.open()
    })
  }

  // ✅ Verify Payment API with success status
  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/web/service_payment_checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          status: 'success'
        })
      })

      const data = await res.json()
      // console.log('Verify Payment Response:', data)

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
    setPaymentStatus(null)
    
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
      
      // console.log('Order Payload:', orderPayload)
      
      const response = await fetch(`${API_BASE_URL}/web/create_service_order`, {
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
          navigate('/dashboard/service-orders')
        } else {
          // ✅ Online Payment
          if (!razorpayLoaded) {
            alert('Payment system is loading. Please wait and try again.')
            setOrderCreating(false)
            return
          }
          
          try {
            // ✅ Open Razorpay and wait for response
            const paymentResult = await openRazorpay(data.data)
            
            // ✅ Check if payment was successful
            if (paymentResult.status === 'success') {
              setPaymentStatus('success')
              // ✅ Verify payment with backend
              const verified = await verifyPayment(paymentResult.data, data.data.order_id)
              
              if (verified) {
                clearCart()
                alert('✅ Payment successful! Order placed successfully.')
                // ✅ Redirect to service orders page
                navigate('/dashboard/service-orders')
              } else {
                alert('Payment verification failed. Please contact support.')
              }
            }
          } catch (paymentError) {
            console.error('Payment Error:', paymentError)
            setPaymentStatus(paymentError.status)
            
            // ✅ Handle different payment scenarios
            if (paymentError.status === 'cancelled') {
              alert('❌ Payment was cancelled. You can try again.')
              // Stay on checkout page, don't clear cart
            } else if (paymentError.status === 'failed') {
              alert('❌ Payment failed. Please try again with different payment method.')
              // Stay on checkout page
            } else {
              alert(paymentError.message || 'Payment failed. Please try again.')
            }
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
                      readOnly
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