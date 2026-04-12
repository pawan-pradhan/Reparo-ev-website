// src/pages/user/ProductOrders.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const ProductOrders = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    fetchProductOrders()
  }, [])

  const fetchProductOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('https://reparo24.com/web/get_product_orderItems', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Product Orders Response:', data)
      
      if (data.success && data.data) {
        const formattedOrders = data.data.map(order => ({
          id: order._id,
          orderId: order.orderId || order._id,
          product: order.product_name || order.product_id?.product_name || 'Product',
          productName: order.product_name,
          productId: order.product_id?._id,
          amount: order.sub_total || 0,
          totalAmount: order.sub_total + (order.sub_total * 0.18),
          subtotal: order.sub_total || 0,
          gstAmount: (order.sub_total * 0.18) || 0,
          status: order.order_status || 'order_ongoing',
          date: formatDate(order.created_at),
          paymentMode: order.payment_mode,
          paymentStatus: order.payment_status,
          quantity: order.quantity || 1,
          price: order.price || 0,
          user: order.user_id
        }))
        setOrders(formattedOrders)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching product orders:', error)
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

  const getPaymentModeText = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'COD':
        return 'Cash on Delivery'
      case 'ONLINE':
        return 'Online Payment'
      default:
        return mode || 'N/A'
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

  const downloadProductInvoice = async (orderId) => {
    setDownloading(orderId)
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`https://reparo24.com/web/download_product_invoice?_id=${orderId}`, {
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
        a.download = `product_invoice_${orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to download invoice')
      }
    } catch (error) {
      console.error('Download product invoice error:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product orders...</p>
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
          <h4 className="font-semibold text-lg">Product Orders 🛍️</h4>
        </div>

        <div className="p-4 md:p-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h5 className="font-semibold">All Product Orders</h5>
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
              <div className="text-6xl mb-4">🛍️</div>
              <h5 className="font-semibold text-lg mb-2">No Product Orders Found</h5>
              <p className="text-gray-500">You haven't placed any product orders yet.</p>
              <Link to="/shop" className="inline-block mt-4 gradient-animated text-white px-6 py-2 rounded-lg">
                Shop Now
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
                    {/* Left Section */}
                    <div className="flex-1">
                      <h5 className="font-semibold text-base">{order.product}</h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Order ID: {order.orderId?.slice(-8) || order.id.slice(-8)} • {order.date}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          Qty: {order.quantity}
                        </span>
                        <span className="text-xs text-gray-400">
                          Payment: {getPaymentModeText(order.paymentMode)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'payment_success' ? 'Paid' : order.paymentStatus === 'payment_pending' ? 'Pending' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-lg font-bold text-[#0b86d0]">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </div>
                    
                    {/* Right Section */}
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="flex gap-4">
                        <Link
                          to={`/dashboard/track-order/${order.id}?type=product`}
                          className="text-[#0b86d0] text-sm hover:underline"
                        >
                          Track
                        </Link>
                        <button 
                          onClick={() => downloadProductInvoice(order.orderId || order.id)}
                          disabled={downloading === (order.orderId || order.id)}
                          className="text-[#00c853] text-sm hover:underline disabled:opacity-50"
                        >
                          {downloading === (order.orderId || order.id) ? 'Downloading...' : 'Invoice'}
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

export default ProductOrders


// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import Sidebar from '../../components/user/Sidebar'

// const ProductOrders = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [downloading, setDownloading] = useState(null)

//   useEffect(() => {
//     fetchProductOrders()
//   }, [])

//   // const fetchProductOrders = async () => {
//   //   try {
//   //     setLoading(true)
//   //     const token = localStorage.getItem('token')
      
//   //     const response = await fetch('https://reparo24.com/web/get_product_order', {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     })
      
//   //     const data = await response.json()
//   //     console.log('Product Orders Response:', data)
      
//   //     if (data.success && data.status === 200 && data.data) {
//   //       // Format orders according to API response structure
//   //       const formattedOrders = data.data.map(order => ({
//   //         id: order._id,
//   //         orderId: order._id,
//   //         product: order.product_id?.product_name || order.product_id?.name || 'Product',
//   //         productName: order.product_id?.product_name,
//   //         productId: order.product_id?._id,
//   //         amount: order.order_subtotal_amount || 0,
//   //         totalAmount: order.order_total_amount || 0,
//   //         subtotal: order.order_subtotal_amount || 0,
//   //         gstAmount: order.gst_amount || 0,
//   //         status: order.status || 'pending',
//   //         date: formatDate(order.created_at),
//   //         paymentMode: order.payment_mode,
//   //         paymentStatus: order.payment_status,
//   //         quantity: order.quantity || 1,
//   //         user: order.user_id
//   //       }))
//   //       setOrders(formattedOrders)
//   //     } else {
//   //       setOrders([])
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching product orders:', error)
//   //     setOrders([])
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const fetchProductOrders = async () => {
//     try {
//       setLoading(true)
//       const token = localStorage.getItem('token')
      
//       // ✅ Use get_product_orderItems API
//       const response = await fetch('https://reparo24.com/web/get_product_orderItems', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       const data = await response.json()
//       console.log('Product Orders Response:', data)
      
//       if (data.success && data.data) {
//         const formattedOrders = data.data.map(order => ({
//           id: order._id,
//           orderId: order._id,
//           product: order.product_name || order.product_id?.product_name || 'Product',
//           productName: order.product_name,
//           productId: order.product_id?._id,
//           amount: order.sub_total || 0,
//           totalAmount: order.sub_total + (order.sub_total * 0.18),
//           subtotal: order.sub_total || 0,
//           gstAmount: (order.sub_total * 0.18) || 0,
//           status: order.status || 'pending',
//           date: formatDate(order.created_at),
//           paymentMode: order.payment_mode,
//           paymentStatus: order.payment_status,
//           quantity: order.quantity || 1,
//           price: order.price || 0,
//           user: order.user_id
//         }))
//         setOrders(formattedOrders)
//       } else {
//         setOrders([])
//       }
//     } catch (error) {
//       console.error('Error fetching product orders:', error)
//       setOrders([])
//     } finally {
//       setLoading(false)
//     }
//   }


//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A'
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     })
//   }

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//       case 'delivered':
//         return 'bg-green-100 text-green-600'
//       case 'in-progress':
//       case 'processing':
//         return 'bg-yellow-100 text-yellow-600'
//       case 'pending':
//         return 'bg-orange-100 text-orange-600'
//       case 'cancelled':
//         return 'bg-red-100 text-red-600'
//       default:
//         return 'bg-gray-100 text-gray-600'
//     }
//   }

//   const getStatusText = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//         return 'Completed'
//       case 'in-progress':
//         return 'In Progress'
//       case 'pending':
//         return 'Pending'
//       case 'cancelled':
//         return 'Cancelled'
//       default:
//         return status || 'Pending'
//     }
//   }

//   const getPaymentModeText = (mode) => {
//     switch (mode?.toUpperCase()) {
//       case 'COD':
//         return 'Cash on Delivery'
//       case 'ONLINE':
//         return 'Online Payment'
//       default:
//         return mode || 'N/A'
//     }
//   }

//   const getPaymentStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'paid':
//         return 'bg-green-100 text-green-600'
//       case 'unpaid':
//         return 'bg-yellow-100 text-yellow-600'
//       case 'failed':
//         return 'bg-red-100 text-red-600'
//       default:
//         return 'bg-gray-100 text-gray-600'
//     }
//   }

//   // Download Product Invoice Function
//   // const downloadProductInvoice = async (orderId) => {
//   //   setDownloading(orderId)
    
//   //   try {
//   //     const token = localStorage.getItem('token')
      
//   //     const response = await fetch(`https://reparo24.com/web/download_product_invoice?_id=${orderId}`, {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     })
      
//   //     const data = await response.json()
//   //     console.log('Product Invoice Download Response:', data)
      
//   //     if (response.ok && data.success) {
//   //       if (data.pdfUrl) {
//   //         window.open(data.pdfUrl, '_blank')
//   //       } else {
//   //         alert('Invoice download started. Check your downloads folder.')
//   //       }
//   //     } else {
//   //       alert(data.message || 'Failed to download invoice. Please try again later.')
//   //     }
//   //   } catch (error) {
//   //     console.error('Download product invoice error:', error)
//   //     alert('Failed to download invoice. Please try again.')
//   //   } finally {
//   //     setDownloading(null)
//   //   }
//   // }

//   const downloadProductInvoice = async (orderId) => {
//     setDownloading(orderId)
    
//     try {
//       const token = localStorage.getItem('token')
      
//       const response = await fetch(`https://reparo24.com/web/download_product_invoice?_id=${orderId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       })
      
//       if (response.ok) {
//         const blob = await response.blob()
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = `product_invoice_${orderId}.pdf`
//         document.body.appendChild(a)
//         a.click()
//         window.URL.revokeObjectURL(url)
//         document.body.removeChild(a)
//       } else {
//         const data = await response.json()
//         alert(data.message || 'Failed to download invoice')
//       }
//     } catch (error) {
//       console.error('Download product invoice error:', error)
//       alert('Failed to download invoice. Please try again.')
//     } finally {
//       setDownloading(null)
//     }
//   }


//   const filteredOrders = orders.filter((order) =>
//     order.product.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
//         <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading product orders...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
//       <div className="flex-1 ml-0 md:ml-64">
//         <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="md:hidden text-2xl text-gray-600"
//           >
//             ☰
//           </button>
//           <h4 className="font-semibold text-lg">Product Orders 🛍️</h4>
//         </div>

//         <div className="p-4 md:p-6">
//           {/* Search Bar */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <h5 className="font-semibold">All Product Orders</h5>
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-[#0b86d0]"
//               />
//             </div>
//           </div>

//           {/* Order Cards */}
//           {filteredOrders.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
//               <div className="text-6xl mb-4">🛍️</div>
//               <h5 className="font-semibold text-lg mb-2">No Product Orders Found</h5>
//               <p className="text-gray-500">You haven't placed any product orders yet.</p>
//               <Link to="/shop" className="inline-block mt-4 gradient-animated text-white px-6 py-2 rounded-lg">
//                 Shop Now
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {filteredOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                     {/* Left Section */}
//                     <div className="flex-1">
//                       <h5 className="font-semibold text-base">{order.product}</h5>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Order ID: {order.id.slice(-8)} • {order.date}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         <span className="text-xs text-gray-400">
//                           Qty: {order.quantity}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           Payment: {getPaymentModeText(order.paymentMode)}
//                         </span>
//                         <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
//                           {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Amount */}
//                     <div className="text-lg font-bold text-[#0b86d0]">
//                       ₹{order.totalAmount}
//                     </div>
                    
//                     {/* Right Section */}
//                     <div className="flex flex-col items-start sm:items-end gap-2">
//                       <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                         {getStatusText(order.status)}
//                       </span>
//                       <div className="flex gap-4">
//                         {/* <Link
//                           to={`/dashboard/track-product-order/${order.productId}`}
//                           className="text-[#0b86d0] text-sm hover:underline"
//                         >
//                           Track
//                         </Link> */}

//                         <Link
//                           to={`/dashboard/track-order/${order.orderId}?type=product`}
//                           className="text-[#0b86d0] text-sm hover:underline"
//                         >
//                           Track
//                         </Link>

//                         <button 
//                           onClick={() => downloadProductInvoice(order.orderId)}
//                           disabled={downloading === order.orderId}
//                           className="text-[#00c853] text-sm hover:underline disabled:opacity-50"
//                         >
//                           {downloading === order.orderId ? 'Downloading...' : 'Invoice'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductOrders