// src/pages/user/ServiceOrders.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const ServiceOrders = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_BASE_URL}/web/get_service_order`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Service Orders Response:', data)
      
      if (data.status === 200 && data.data) {
        const formattedOrders = data.data.map(order => ({
          id: order._id,
          orderId: order._id,
          service: order.service_id?.title || 'Service',
          serviceId: order.service_id?._id,
          amount: order.amount || order.order_sub_total_amount || 0,
          totalAmount: order.order_total_amount || 0,
          status: order.order_status || 'order_ongoing',
          date: formatDate(order.created_at),
          paymentMode: order.payment_mode,
          paymentStatus: order.payment_status,
          quantity: order.quantity || 1,
          gstAmount: order.gst_amount || 0
        }))
        setOrders(formattedOrders)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
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
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'order_completed':
        return 'bg-green-100 text-green-600'
      case 'order_assigned':
        return 'bg-purple-100 text-purple-600'
      case 'order_success':
        return 'bg-blue-100 text-blue-600'
      case 'order_ongoing':
        return 'bg-yellow-100 text-yellow-600'
      case 'order_cancelled':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'order_completed':
        return 'Completed'
      case 'order_assigned':
        return 'Technician Assigned'
      case 'order_success':
        return 'Payment Success'
      case 'order_ongoing':
        return 'Order Ongoing'
      case 'order_cancelled':
        return 'Cancelled'
      default:
        return status || 'Order Ongoing'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'payment_success':
        return 'bg-green-100 text-green-600'
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-600'
      case 'payment_failed':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const downloadInvoice = async (orderId) => {
    setDownloading(orderId)
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_BASE_URL}/web/download_invoice?id=${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice_${orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to download invoice')
      }
    } catch (error) {
      console.error('Download invoice error:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service orders...</p>
          </div>
        </div>
      </div>
    )
  }

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
          <h4 className="font-semibold text-lg">Service Orders 🔧</h4>
        </div>

        <div className="p-4 md:p-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h5 className="font-semibold">All Service Orders</h5>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-[#0b86d0]"
              />
            </div>
          </div>

          {/* Order Cards */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h5 className="font-semibold text-lg mb-2">No Service Orders Found</h5>
              <p className="text-gray-500">You haven't placed any service orders yet.</p>
              <Link to="/services" className="inline-block mt-4 gradient-animated text-white px-6 py-2 rounded-lg">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-base">{order.service}</h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Order ID: {order.orderId?.slice(-8)} • {order.date}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          Quantity: {order.quantity}
                        </span>
                        <span className="text-xs text-gray-400">
                          Payment: {order.paymentMode?.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'payment_success' ? 'Paid' : order.paymentStatus === 'payment_pending' ? 'Pending' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-[#0b86d0]">
                      ₹{Number(order.totalAmount || order.amount).toFixed(2)}
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="flex gap-4">
                        <Link
                          to={`/dashboard/track-order/${order.orderId}?type=service`}
                          className="text-[#0b86d0] text-sm hover:underline"
                        >
                          Track
                        </Link>
                        <button 
                          onClick={() => downloadInvoice(order.orderId)}
                          disabled={downloading === order.orderId}
                          className="text-[#00c853] text-sm hover:underline disabled:opacity-50"
                        >
                          {downloading === order.orderId ? 'Downloading...' : 'Invoice'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceOrders