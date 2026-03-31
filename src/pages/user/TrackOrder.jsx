// src/pages/user/TrackOrder.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const TrackOrder = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'service'
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrderStatus()
  }, [id, type])

  const fetchOrderStatus = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      let url = ''
      if (type === 'service') {
        url = 'https://reparo24.com/web/track_service_order_status'
      } else {
        url = 'https://reparo24.com/web/track_product_order_status'
      }
      
      const formData = new URLSearchParams()
      formData.append(type === 'service' ? 'orderId' : 'order_id', id)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })
      
      const data = await response.json()
      console.log('Track Order Response:', data)
      
      if (data.message === 'Order fetched successfully') {
        setOrder(data.data)
      } else {
        setError(data.message || 'Order not found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Order Pending', color: 'text-orange-600', bg: 'bg-orange-100', icon: '⏳' }
      case 'confirmed':
        return { text: 'Order Confirmed', color: 'text-blue-600', bg: 'bg-blue-100', icon: '✓' }
      case 'assigned':
        return { text: 'On The Way', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🚚' }
      case 'completed':
        return { text: 'Delivered', color: 'text-green-600', bg: 'bg-green-100', icon: '✅' }
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100', icon: '❌' }
      default:
        return { text: status || 'Pending', color: 'text-gray-600', bg: 'bg-gray-100', icon: '📦' }
    }
  }

  // Timeline steps based on order status
  const getTimelineSteps = () => {
    const status = order?.status?.toLowerCase()
    
    if (type === 'service') {
      const steps = [
        { 
          label: 'Order Placed', 
          time: order?.date ? formatDate(order.date) : 'Pending',
          status: status === 'cancelled' ? 'cancelled' : 'completed'
        },
        { 
          label: 'Technician Assigned', 
          time: status === 'assigned' || status === 'completed' ? 'Assigned' : 'Pending',
          status: status === 'assigned' || status === 'completed' ? 'completed' : 
                  status === 'cancelled' ? 'cancelled' : 'pending'
        },
        { 
          label: 'Service In Progress', 
          time: status === 'completed' ? 'Completed' : 'Ongoing',
          status: status === 'completed' ? 'completed' : 
                  status === 'assigned' ? 'active' :
                  status === 'cancelled' ? 'cancelled' : 'pending'
        },
        { 
          label: 'Service Completed', 
          time: status === 'completed' ? 'Completed' : 'Pending',
          status: status === 'completed' ? 'completed' : 
                  status === 'cancelled' ? 'cancelled' : 'pending'
        }
      ]
      return steps
    } else {
      // Product timeline
      const steps = [
        { 
          label: 'Order Placed', 
          time: order?.date ? formatDate(order.date) : 'Pending',
          status: status === 'cancelled' ? 'cancelled' : 'completed'
        },
        { 
          label: 'Order Confirmed', 
          time: status === 'confirmed' || status === 'assigned' || status === 'completed' ? 'Confirmed' : 'Pending',
          status: status === 'confirmed' || status === 'assigned' || status === 'completed' ? 'completed' : 
                  status === 'cancelled' ? 'cancelled' : 'pending'
        },
        { 
          label: 'Out for Delivery', 
          time: status === 'assigned' || status === 'completed' ? 'On The Way' : 'Pending',
          status: status === 'assigned' || status === 'completed' ? 'active' : 
                  status === 'cancelled' ? 'cancelled' : 'pending'
        },
        { 
          label: 'Delivered', 
          time: status === 'completed' ? 'Delivered' : 'Pending',
          status: status === 'completed' ? 'completed' : 
                  status === 'cancelled' ? 'cancelled' : 'pending'
        }
      ]
      return steps
    }
  }

  const getStepIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return '✓'
      case 'active':
        return '⏳'
      case 'cancelled':
        return '✗'
      default:
        return '○'
    }
  }

  const getStepColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-600 border-green-500 bg-green-500'
      case 'active':
        return 'text-yellow-500 border-yellow-500 bg-yellow-500 animate-pulse'
      case 'cancelled':
        return 'text-red-600 border-red-500 bg-red-500'
      default:
        return 'text-gray-400 border-gray-300 bg-white'
    }
  }

  const getStepTextColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-600'
      case 'active':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-gray-500">{error || 'Unable to find order details'}</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 gradient-animated text-white px-4 py-2 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const timelineSteps = getTimelineSteps()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl text-gray-600"
          >
            ☰
          </button>
          <h4 className="font-semibold text-lg">Track Order 📦</h4>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
              <h4 className="font-semibold">Track Order</h4>
              <span className="text-sm text-gray-500">Order ID: #{id?.slice(-8)}</span>
            </div>

            {/* Status Badge */}
            <div className={`${statusInfo.bg} rounded-xl p-4 text-center`}>
              <span className={`text-lg font-semibold ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.text}
              </span>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="h-48 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                📍 Live Map Tracking (Coming Soon)
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h5 className="font-semibold mb-3">
                {type === 'service' ? 'Service Details' : 'Product Details'}
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {type === 'service' ? 'Service' : 'Product'}
                  </span>
                  <span className="font-medium">
                    {type === 'service' ? order.service_name : order.product_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium">{order.user_name}</span>
                </div>
                {type === 'product' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Quantity</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Unit Price</span>
                      <span className="font-medium">₹{order.price}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-primary font-semibold">₹{order.amount}</span>
                </div>
              </div>
            </div>

            {/* Timeline - HTML Design */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h5 className="font-semibold mb-4">Order Timeline</h5>
              <div className="relative border-l-2 border-gray-200 pl-6 space-y-6">
                {timelineSteps.map((step, index) => {
                  const isCompleted = step.status === 'completed'
                  const isActive = step.status === 'active'
                  const isCancelled = step.status === 'cancelled'
                  
                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-8 w-4 h-4 rounded-full ${
                        isCancelled ? 'bg-red-500' :
                        isCompleted ? 'bg-green-500' :
                        isActive ? 'bg-yellow-500 animate-pulse' :
                        'bg-gray-300'
                      }`} />
                      <h6 className={`font-medium ${
                        isCancelled ? 'text-red-600' :
                        isCompleted ? 'text-green-600' :
                        isActive ? 'text-yellow-600' :
                        'text-gray-400'
                      }`}>
                        {step.label}
                      </h6>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder