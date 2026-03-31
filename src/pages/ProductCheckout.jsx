// src/pages/ProductCheckout.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useProductCart } from '../context/ProductCartContext'

const ProductCheckout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  console.log("🚀 ~ ProductCheckout ~ isAuthenticated:", isAuthenticated)
  const { cartItems, getTotals, clearCart } = useProductCart()
  const [orderCreating, setOrderCreating] = useState(false)
  
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.mobile_number || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    notes: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('COD') // COD or online

  const { subtotal, gst, total } = getTotals()

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop')
    }
  }, [cartItems, navigate])

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    })
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
      
      // ✅ Prepare order payload with product_name
      const orderPayload = {
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name, // ✅ ADD product_name
          quantity: item.quantity,
          amount: Math.round(item.price) // amount after GST
        })),
        billing_address: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          pincode: address.pincode,
          notes: address.notes
        },
        payment_mode: paymentMethod,
        total_amount: parseFloat(total.toFixed(2))
      }
      
      console.log('Product Order Payload:', orderPayload)
      
      const response = await fetch('https://reparo24.com/web/create_product_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })
      
      const data = await response.json()
      console.log('Product Order Response:', data)
      
      if (data.success) {
        clearCart()
        
        if (paymentMethod === 'COD') {
          alert('Order placed successfully!')
          navigate('/dashboard/product-orders')
        } else {
          // Online payment - Open Razorpay
          if (data.razorpay_order_id) {
            openRazorpay(data)
          } else {
            alert('Payment gateway not ready. Please try COD.')
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

  // Razorpay payment function for products
  const openRazorpay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(orderData.order_total_amount * 100),
      currency: "INR",
      name: "Reparo",
      description: "Product Order Payment",
      order_id: orderData.razorpay_order_id,
      handler: async function (response) {
        console.log("Payment Success:", response)
        await verifyProductPayment(response, orderData._id)
      },
      prefill: {
        name: address.name,
        contact: address.phone,
        email: user?.email || ''
      },
      theme: {
        color: "#0b86d0"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const verifyProductPayment = async (paymentResponse, orderId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('https://reparo24.com/web/product_payment_checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      })

      const data = await res.json()
      console.log('Verify Payment Response:', data)

      if (data.status === 200 || data.success) {
        alert('Payment successful! Order placed successfully.')
        navigate('/dashboard/product-orders')
      } else {
        alert('Payment verification failed. Please contact support.')
      }
    } catch (error) {
      console.error('Verify Payment Error:', error)
      alert('Payment verification failed. Please contact support.')
    }
  }

  if (cartItems.length === 0) {
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
        <h2 className="text-center font-bold text-3xl mb-5 gradient-text">Product Checkout 🛍️</h2>

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
                      value="COD"
                      checked={paymentMethod === 'COD'}
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

              <div className="mb-4 space-y-3 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <h6 className="font-semibold text-sm">{item.name}</h6>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{Math.round(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items):</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gst}</span>
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <h5 className="font-bold text-lg">Total:</h5>
                <h5 className="font-bold text-lg text-primary">₹{total}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductCheckout