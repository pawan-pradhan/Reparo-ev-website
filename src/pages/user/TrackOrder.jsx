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
      case 'order_ongoing':
        return { text: 'Order Ongoing', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⏳' }
      case 'order_success':
        return { text: 'Order Success', color: 'text-blue-600', bg: 'bg-blue-100', icon: '✓' }
      case 'order_assigned':
        return { text: 'Order Assigned', color: 'text-purple-600', bg: 'bg-purple-100', icon: '👨‍🔧' }
      case 'order_completed':
        return { text: 'Order Completed', color: 'text-green-600', bg: 'bg-green-100', icon: '✅' }
      case 'order_cancelled':
        return { text: 'Order Cancelled', color: 'text-red-600', bg: 'bg-red-100', icon: '❌' }
      default:
        return { text: status || 'Order Ongoing', color: 'text-gray-600', bg: 'bg-gray-100', icon: '📦' }
    }
  }

  const getStepLabel = (stepKey) => {
    switch (stepKey) {
      case 'order_ongoing':
        return 'Order Ongoing'
      case 'order_success':
        return 'Order Success'
      case 'order_assigned':
        return 'Order Assigned'
      case 'order_completed':
        return 'Order Completed'
      case 'order_cancelled':
        return 'Order Cancelled'
      default:
        return stepKey
    }
  }

  // Timeline steps - cancel step always visible (gray normally, red if cancelled)
  const getTimelineSteps = () => {
    const currentStatus = order?.order_status?.toLowerCase()
    const isFullyCancelled = currentStatus === 'order_cancelled'
    
    let allSteps = []
    
    if (type === 'service') {
      // Service timeline steps
      allSteps = ['order_ongoing', 'order_success', 'order_assigned', 'order_completed', 'order_cancelled']
    } else {
      // Product timeline steps
      allSteps = ['order_ongoing', 'order_success', 'order_completed', 'order_cancelled']
    }
    
    // If fully cancelled, all steps should be red (cancelled)
    if (isFullyCancelled) {
      return allSteps.map(stepKey => ({
        label: getStepLabel(stepKey),
        statusKey: stepKey,
        status: 'cancelled'
      }))
    }
    
    // Otherwise, determine based on current status
    const currentIndex = allSteps.indexOf(currentStatus)
    
    return allSteps.map(stepKey => {
      const stepIndex = allSteps.indexOf(stepKey)
      
      // Cancel step is always at the end
      if (stepKey === 'order_cancelled') {
        // Cancel step always gray, unless order is cancelled
        return { label: getStepLabel(stepKey), statusKey: stepKey, status: 'pending' }
      }
      
      if (stepIndex < currentIndex) {
        return { label: getStepLabel(stepKey), statusKey: stepKey, status: 'completed' }
      } else if (stepIndex === currentIndex) {
        return { label: getStepLabel(stepKey), statusKey: stepKey, status: 'active' }
      } else {
        return { label: getStepLabel(stepKey), statusKey: stepKey, status: 'pending' }
      }
    })
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

  const statusInfo = getStatusInfo(order.order_status)
  const timelineSteps = getTimelineSteps()
  const isCancelled = order.order_status?.toLowerCase() === 'order_cancelled'

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
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="text-primary font-semibold text-lg">₹{Number(order.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h5 className="font-semibold mb-4">Order Timeline</h5>
              <div className="relative">
                {timelineSteps.map((step, index) => {
                  const isCompleted = step.status === 'completed'
                  const isActive = step.status === 'active'
                  const isCancelledStatus = step.status === 'cancelled'
                  const isCancelStep = step.statusKey === 'order_cancelled'
                  
                  return (
                    <div key={index} className="relative flex mb-6 last:mb-0">
                      {/* Left side - Icon */}
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                          isCancelledStatus ? 'border-red-500 bg-red-50' :
                          isCompleted ? 'border-green-500 bg-green-50' :
                          // isActive ? 'border-yellow-500 bg-yellow-50 animate-pulse' :
                          isActive ? 'border-green-500 bg-green-50 animate-pulse' :
                          'border-gray-300 bg-gray-50'
                        }`}>
                          <span className={`text-sm ${
                            isCancelledStatus ? 'text-red-500' :
                            isCompleted ? 'text-green-500' :
                            isActive ? 'text-green-500' :
                            'text-gray-400'
                          }`}>
                            {isCompleted ? '✓' : isActive ? '⏳' : isCancelledStatus ? '✗' : index + 1}
                          </span>
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className={`w-0.5 h-12 -mt-1 ${
                            isCancelledStatus ? 'bg-red-200' :
                            isCompleted ? 'bg-green-500' :
                            isActive ? 'bg-green-500' :
                            'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      
                      {/* Right side - Content */}
                      <div className="flex-1 pb-4">
                        <h6 className={`font-semibold ${
                          isCancelledStatus ? 'text-red-600' :
                          isCompleted ? 'text-green-600' :
                          isActive ? 'text-green-600' :
                          'text-gray-500'
                        }`}>
                          {step.label}
                        </h6>
                        <p className="text-sm text-gray-400 mt-1">
                          {isCancelledStatus ? 'Cancelled' : 
                           isCompleted ? 'Completed' : 
                           isActive ? 'Completed' : 
                           'Pending'}
                        </p>
                      </div>
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


// import React, { useState, useEffect } from 'react'
// import { useParams, useSearchParams } from 'react-router-dom'
// import Sidebar from '../../components/user/Sidebar'

// const TrackOrder = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const { id } = useParams()
//   const [searchParams] = useSearchParams()
//   const type = searchParams.get('type') || 'service'
  
//   const [order, setOrder] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchOrderStatus()
//   }, [id, type])

//   const fetchOrderStatus = async () => {
//     try {
//       setLoading(true)
//       const token = localStorage.getItem('token')
      
//       let url = ''
//       if (type === 'service') {
//         url = 'https://test.reparo24.com/web/track_service_order_status'
//       } else {
//         url = 'https://test.reparo24.com/web/track_product_order_status'
//       }
      
//       const formData = new URLSearchParams()
//       formData.append(type === 'service' ? 'orderId' : 'order_id', id)
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData.toString()
//       })
      
//       const data = await response.json()
//       // console.log('Track Order Response:', data)
      
//       if (data.message === 'Order fetched successfully') {
//         setOrder(data.data)
//         // setOrder({...data.data, order_status : 'order_cancelled'})
//       } else {
//         setError(data.message || 'Order not found')
//       }
//     } catch (error) {
//       console.error('Error fetching order:', error)
//       setError('Failed to load order details')
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
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const getStatusInfo = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'order_ongoing':
//         return { text: 'Order Ongoing', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⏳' }
//       case 'order_success':
//         return { text: 'Order Success', color: 'text-blue-600', bg: 'bg-blue-100', icon: '✓' }
//       case 'order_assigned':
//         return { text: 'Order Assigned', color: 'text-purple-600', bg: 'bg-purple-100', icon: '👨‍🔧' }
//       case 'order_completed':
//         return { text: 'Order Completed', color: 'text-green-600', bg: 'bg-green-100', icon: '✅' }
//       case 'order_cancelled':
//         return { text: 'Order Cancelled', color: 'text-red-600', bg: 'bg-red-100', icon: '❌' }
//       default:
//         return { text: status || 'Order Ongoing', color: 'text-gray-600', bg: 'bg-gray-100', icon: '📦' }
//     }
//   }

//   // Get display label for timeline steps
//   const getStepLabel = (stepKey) => {
//     switch (stepKey) {
//       case 'order_ongoing':
//         return 'Order Ongoing'
//       case 'order_success':
//         return 'Order Success'
//       case 'order_assigned':
//         return 'Order Assigned'
//       case 'order_completed':
//         return 'Order Completed'
//       case 'order_cancelled':
//         return 'Order Cancelled'
//       default:
//         return stepKey
//     }
//   }

//   // Timeline steps based on order type
//   const getTimelineSteps = () => {
//     const currentStatus = order?.order_status?.toLowerCase()
    
//     if (type === 'service') {
//       // Service timeline: Order Ongoing → Order Success → Order Assigned → Order Completed
//       const allSteps = ['order_ongoing', 'order_success', 'order_assigned', 'order_completed']
      
//       return allSteps.map(stepKey => {
//         let status = 'pending'
        
//         if (currentStatus === 'order_cancelled') {
//           status = 'cancelled'
//         } else {
//           const stepIndex = allSteps.indexOf(stepKey)
//           const currentIndex = allSteps.indexOf(currentStatus)
          
//           if (currentIndex === -1) status = 'pending'
//           else if (stepIndex < currentIndex) status = 'completed'
//           else if (stepIndex === currentIndex) status = 'active'
//           else status = 'pending'
//         }
        
//         return {
//           label: getStepLabel(stepKey),
//           statusKey: stepKey,
//           status: status
//         }
//       })
//     } else {
//       // Product timeline: Order Ongoing → Order Success → Order Completed
//       const allSteps = ['order_ongoing', 'order_success', 'order_completed']
      
//       return allSteps.map(stepKey => {
//         let status = 'pending'
        
//         if (currentStatus === 'order_cancelled') {
//           status = 'cancelled'
//         } else {
//           const stepIndex = allSteps.indexOf(stepKey)
//           const currentIndex = allSteps.indexOf(currentStatus)
          
//           if (currentIndex === -1) status = 'pending'
//           else if (stepIndex < currentIndex) status = 'completed'
//           else if (stepIndex === currentIndex) status = 'active'
//           else status = 'pending'
//         }
        
//         return {
//           label: getStepLabel(stepKey),
//           statusKey: stepKey,
//           status: status
//         }
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
//         <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading order details...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !order) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
//         <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
//             <p className="text-gray-500">{error || 'Unable to find order details'}</p>
//             <button 
//               onClick={() => window.history.back()}
//               className="mt-4 gradient-animated text-white px-4 py-2 rounded-lg"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const statusInfo = getStatusInfo(order.order_status)
//   const timelineSteps = getTimelineSteps()

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
//           <h4 className="font-semibold text-lg">Track Order 📦</h4>
//         </div>

//         <div className="p-4 md:p-6">
//           <div className="max-w-3xl mx-auto space-y-4">
//             {/* Header */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
//               <h4 className="font-semibold">Track Order</h4>
//               <span className="text-sm text-gray-500">Order ID: #{id?.slice(-8)}</span>
//             </div>

//             {/* Status Badge */}
//             <div className={`${statusInfo.bg} rounded-xl p-4 text-center`}>
//               <span className={`text-lg font-semibold ${statusInfo.color}`}>
//                 {statusInfo.icon} {statusInfo.text}
//               </span>
//             </div>

//             {/* Order Details */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//               <h5 className="font-semibold mb-3">
//                 {type === 'service' ? 'Service Details' : 'Product Details'}
//               </h5>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">
//                     {type === 'service' ? 'Service' : 'Product'}
//                   </span>
//                   <span className="font-medium">
//                     {type === 'service' ? order.service_name : order.product_name}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Customer</span>
//                   <span className="font-medium">{order.user_name}</span>
//                 </div>
//                 {type === 'product' && (
//                   <>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Quantity</span>
//                       <span className="font-medium">{order.quantity}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Unit Price</span>
//                       <span className="font-medium">₹{order.price}</span>
//                     </div>
//                     {order.gst_amount && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">GST Amount</span>
//                         <span className="font-medium">₹{Number(order.gst_amount).toFixed(2)}</span>
//                       </div>
//                     )}
//                     {order.sub_total && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Subtotal</span>
//                         <span className="font-medium">₹{Number(order.sub_total).toFixed(2)}</span>
//                       </div>
//                     )}
//                   </>
//                 )}
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Date</span>
//                   <span>{formatDate(order.date)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm pt-2 border-t">
//                   <span className="text-gray-500 font-medium">Total Amount</span>
//                   <span className="text-primary font-semibold text-lg">₹{Number(order.amount).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Timeline */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//               <h5 className="font-semibold mb-4">Order Timeline</h5>
//               <div className="relative">
//                 {timelineSteps.map((step, index) => {
//                   const isCompleted = step.status === 'completed'
//                   const isActive = step.status === 'active'
//                   const isCancelled = step.status === 'cancelled'
                  
//                   return (
//                     <div key={index} className="relative flex mb-8 last:mb-0">
//                       {/* Left side - Icon */}
//                       <div className="flex flex-col items-center mr-4">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
//                           isCancelled ? 'border-red-500 bg-red-50' :
//                           isCompleted ? 'border-green-500 bg-green-50' :
//                           isActive ? 'border-yellow-500 bg-yellow-50 animate-pulse' :
//                           'border-gray-300 bg-gray-50'
//                         }`}>
//                           <span className={`text-sm ${
//                             isCancelled ? 'text-red-500' :
//                             isCompleted ? 'text-green-500' :
//                             isActive ? 'text-yellow-500' :
//                             'text-gray-400'
//                           }`}>
//                             {isCompleted ? '✓' : isActive ? '⏳' : isCancelled ? '✗' : index + 1}
//                           </span>
//                         </div>
//                         {index < timelineSteps.length - 1 && (
//                           <div className={`w-0.5 h-12 -mt-1 ${
//                             isCancelled ? 'bg-red-200' :
//                             isCompleted ? 'bg-green-500' :
//                             isActive ? 'bg-yellow-300' :
//                             'bg-gray-200'
//                           }`} />
//                         )}
//                       </div>
                      
//                       {/* Right side - Content */}
//                       <div className="flex-1 pb-6">
//                         <h6 className={`font-semibold ${
//                           isCancelled ? 'text-red-600' :
//                           isCompleted ? 'text-green-600' :
//                           isActive ? 'text-yellow-600' :
//                           'text-gray-500'
//                         }`}>
//                           {step.label}
//                         </h6>
//                         <p className="text-sm text-gray-400 mt-1">
//                           {isCompleted ? 'Completed' : isActive ? 'In Progress' : isCancelled ? 'Cancelled' : 'Pending'}
//                         </p>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>

//             {/* Cancelled Message */}
//             {order.order_status?.toLowerCase() === 'order_cancelled' && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
//                 <p className="text-red-600">
//                   This order has been cancelled. For any queries, please contact support.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TrackOrder