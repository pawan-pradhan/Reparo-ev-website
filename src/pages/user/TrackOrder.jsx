// src/pages/user/TrackOrder.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const TrackOrder = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { id } = useParams()

  const order = {
    id: id,
    service: 'Battery Repair',
    amount: 1499,
    date: '12 Mar 2026',
    technician: { name: 'Ravi Kumar', phone: '9876543210', role: 'EV Technician' },
    timeline: [
      { step: 'Order Placed', time: '12 Mar, 10:30 AM', status: 'completed' },
      { step: 'Technician Assigned', time: '12 Mar, 11:00 AM', status: 'completed' },
      { step: 'Service In Progress', time: 'Ongoing', status: 'in-progress' },
      { step: 'Service Completed', time: 'Pending', status: 'pending' },
    ]
  }

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '⏳'
      default:
        return '○'
    }
  }

  const getTimelineColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'in-progress':
        return 'text-yellow-500'
      default:
        return 'text-gray-400'
    }
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
          <h4 className="font-semibold text-lg">Track Order 📦</h4>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
              <h4 className="font-semibold">Track Order</h4>
              <span className="text-sm text-gray-500">Order ID: #{order.id}</span>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="h-48 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                📍 Live Map Tracking (Coming Soon)
              </div>
            </div>

            {/* Technician Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <img
                src="https://via.placeholder.com/60"
                alt="Technician"
                className="rounded-full w-14 h-14 object-cover"
              />
              <div className="flex-1">
                <h5 className="font-semibold">{order.technician.name}</h5>
                <p className="text-sm text-gray-500">{order.technician.role}</p>
              </div>
              <a
                href={`tel:${order.technician.phone}`}
                className="bg-[#00c853] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00c853]/90 transition"
              >
                Call
              </a>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h5 className="font-semibold mb-3">Service Details</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{order.service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span>{order.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-[#0b86d0] font-semibold">₹{order.amount}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h5 className="font-semibold mb-4">Order Timeline</h5>
              <div className="space-y-4">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'completed' ? 'border-green-500 bg-green-500 text-white' :
                      step.status === 'in-progress' ? 'border-yellow-500 bg-yellow-500 text-white' :
                      'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {getTimelineIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <h6 className={`font-medium ${getTimelineColor(step.status)}`}>
                        {step.step}
                      </h6>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                  </div>
                ))}
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
// import { useParams } from 'react-router-dom'
// import Sidebar from '../../components/user/Sidebar'
// import { getUserOrders } from '../../services/api'

// const TrackOrder = () => {
//   const { id } = useParams()
//   const [order, setOrder] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchOrderDetails()
//   }, [id])

//   const fetchOrderDetails = async () => {
//     try {
//       const response = await getUserOrders()
//       const foundOrder = response.data.find(o => o.id === parseInt(id))
//       setOrder(foundOrder)
//     } catch (error) {
//       console.error('Error fetching order:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getTimelineStatus = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'text-green-600'
//       case 'in-progress':
//         return 'text-yellow-500 animate-pulse'
//       case 'pending':
//         return 'text-gray-400'
//       default:
//         return 'text-gray-400'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 md:ml-64 flex items-center justify-center">
//           <div className="text-center">Loading...</div>
//         </div>
//       </div>
//     )
//   }

//   if (!order) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 md:ml-64 flex items-center justify-center">
//           <div className="text-center">Order not found</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 md:ml-64">
//         <div className="bg-white shadow-sm p-4">
//           <h4 className="font-semibold text-lg">Track Order 📦</h4>
//         </div>

//         <div className="p-4">
//           <div className="max-w-4xl mx-auto">
//             {/* Header */}
//             <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex justify-between items-center">
//               <h4 className="font-semibold">Track Order 📦</h4>
//               <span className="text-sm text-gray-500">Order ID: #{order.id}</span>
//             </div>

//             {/* Map */}
//             <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
//               <div className="h-56 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
//                 📍 Live Map Tracking (Coming Soon)
//               </div>
//             </div>

//             {/* Technician Info */}
//             <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-4">
//               <img
//                 src="https://via.placeholder.com/60"
//                 alt="Technician"
//                 className="rounded-full w-14 h-14"
//               />
//               <div className="flex-1">
//                 <h5 className="font-semibold">Ravi Kumar</h5>
//                 <p className="text-sm text-gray-500">EV Technician</p>
//               </div>
//               <a
//                 href="tel:9876543210"
//                 className="bg-[#00c853] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00c853]/90 transition"
//               >
//                 Call
//               </a>
//             </div>

//             {/* Order Details */}
//             <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
//               <h5 className="font-semibold mb-3">Service Details</h5>
//               <div className="flex justify-between text-sm mb-2">
//                 <span>Service</span>
//                 <span className="font-medium">{order.service}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-2">
//                 <span>Date</span>
//                 <span>{order.date}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Amount</span>
//                 <span className="text-[#0b86d0] font-semibold">₹{order.amount}</span>
//               </div>
//             </div>

//             {/* Timeline */}
//             <div className="bg-white p-5 rounded-xl shadow-sm">
//               <h5 className="font-semibold mb-4">Order Timeline</h5>
//               <div className="relative border-l-2 border-gray-200 pl-6 space-y-6">
//                 {order.timeline?.map((step, index) => (
//                   <div key={index} className="relative">
//                     <div className={`absolute -left-8 w-4 h-4 rounded-full ${
//                       step.status === 'completed' ? 'bg-green-500' :
//                       step.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' :
//                       'bg-gray-300'
//                     }`} />
//                     <h6 className={`font-medium ${getTimelineStatus(step.status)}`}>
//                       {step.step}
//                     </h6>
//                     <p className="text-sm text-gray-500">{step.time}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TrackOrder