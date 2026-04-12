// src/pages/user/Dashboard.jsx

// src/pages/user/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const Dashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [serviceOrders, setServiceOrders] = useState([])
  const [productOrders, setProductOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpend: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // ✅ Fetch Dashboard Stats
      const statsResponse = await fetch(`${API_BASE_URL}/web/api/get_dashboard-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const statsData = await statsResponse.json()
      console.log('Dashboard Stats Response:', statsData)
      
      if (statsData.success) {
        setStats({
          totalOrders: statsData.data.totalOrders || 0,
          totalSpend: statsData.data.totalSpend || 0
        })
      }
      
      // ✅ Fetch Service Orders (last 5)
      const serviceResponse = await fetch(`${API_BASE_URL}/web/get_service_order`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const serviceData = await serviceResponse.json()
      console.log('Service Orders Response:', serviceData)
      
      if (serviceData.status === 200 && serviceData.data) {
        const formattedServiceOrders = serviceData.data.slice(0, 5).map(order => ({
          id: order.order_id || order._id,
          service: order.service_id?.title || 'Service',
          amount: order.order_total_amount || 0,
          status: order.status || 'pending',
          date: formatDate(order.created_at),
          orderId: order._id
        }))
        setServiceOrders(formattedServiceOrders)
      }
      
      // ✅ Fetch Product Orders (last 5)
      const productResponse = await fetch(`${API_BASE_URL}/web/get_product_orderItems`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const productData = await productResponse.json()
      console.log('Product Orders Response:', productData)
      
      if (productData.success && productData.data) {
        const formattedProductOrders = productData.data.slice(0, 5).map(order => ({
          id: order._id,
          product: order.product_name || order.product_id?.product_name || 'Product',
          amount: order.sub_total + (order.sub_total * 0.18),
          status: order.status || 'pending',
          date: formatDate(order.created_at),
          orderId: order._id
        }))
        setProductOrders(formattedProductOrders)
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-600'
      case 'in-progress':
      case 'processing':
        return 'bg-yellow-100 text-yellow-600'
      case 'pending':
        return 'bg-orange-100 text-orange-600'
      case 'cancelled':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status || 'Pending'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl text-gray-600"
          >
            ☰
          </button>
          <h4 className="font-semibold text-lg">Dashboard 👋</h4>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm mb-1">Total Orders</p>
              <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.totalOrders}</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm mb-1">Total Spend</p>
              <h2 className="text-3xl font-bold text-[#00c853]">₹{stats.totalSpend.toLocaleString()}</h2>
            </div>
          </div>

          {/* Recent Service Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h5 className="font-semibold text-lg">Recent Service Orders</h5>
            </div>
            <div className="overflow-x-auto">
              {serviceOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No service orders found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{order.service}</td>
                        <td className="px-4 py-3 text-sm">₹{order.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{order.date}</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/dashboard/track-order/${order.orderId}?type=service`}
                            className="text-[#0b86d0] text-sm hover:underline"
                          >
                            Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Product Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h5 className="font-semibold text-lg">Recent Product Orders</h5>
            </div>
            <div className="overflow-x-auto">
              {productOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No product orders found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{order.product}</td>
                        <td className="px-4 py-3 text-sm">₹{order.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{order.date}</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/dashboard/track-order/${order.orderId}?type=product`}
                            className="text-[#0b86d0] text-sm hover:underline"
                          >
                            Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import Sidebar from '../../components/user/Sidebar'

// const Dashboard = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [orders, setOrders] = useState([
//     { id: 101, service: 'Battery Repair', amount: 1499, status: 'Completed', date: '12 Mar 2026' },
//     { id: 102, service: 'Motor Repair', amount: 1299, status: 'In Progress', date: '15 Mar 2026' },
//     { id: 103, service: 'General Service', amount: 799, status: 'Cancelled', date: '18 Mar 2026' },
//   ])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('All Status')

//   const stats = {
//     totalOrders: 12,
//     totalSpend: 8500,
//     activeServices: 2,
//   }

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch = order.service.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'bg-green-100 text-green-600'
//       case 'In Progress':
//         return 'bg-yellow-100 text-yellow-600'
//       case 'Pending':
//         return 'bg-yellow-100 text-yellow-600'
//       case 'Cancelled':
//         return 'bg-red-100 text-red-600'
//       default:
//         return 'bg-gray-100 text-gray-600'
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
//       <div className="flex-1 ml-0 md:ml-64">
//         {/* Header */}
//         <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="md:hidden text-2xl text-gray-600"
//           >
//             ☰
//           </button>
//           <h4 className="font-semibold text-lg">Dashboard 👋</h4>
//         </div>

//         <div className="p-4 md:p-6 space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//               <p className="text-gray-500 text-sm mb-1">Total Orders</p>
//               <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.totalOrders}</h2>
//             </div>
//             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//               <p className="text-gray-500 text-sm mb-1">Total Spend</p>
//               <h2 className="text-3xl font-bold text-[#00c853]">₹{stats.totalSpend.toLocaleString()}</h2>
//             </div>
//             {/* <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//               <p className="text-gray-500 text-sm mb-1">Active Services</p>
//               <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.activeServices}</h2>
//             </div> */}
//           </div>

//           {/* Search and Filter */}
//           {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
//               />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-40 focus:outline-none focus:border-[#0b86d0]"
//               >
//                 <option>All Status</option>
//                 <option>Completed</option>
//                 <option>In Progress</option>
//                 <option>Pending</option>
//                 <option>Cancelled</option>
//               </select>
//             </div>
//           </div> */}

//           {/* Recent Orders Table */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-5 border-b border-gray-100">
//               <h5 className="font-semibold text-lg">Recent Service Orders</h5>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-100">
//                   <tr>
//                     {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th> */}
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                     {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
//                       {/* <td className="px-4 py-3 text-sm">#{order.id}</td> */}
//                       <td className="px-4 py-3 text-sm font-medium">{order.service}</td>
//                       <td className="px-4 py-3 text-sm">₹{order.amount}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       {/* <td className="px-4 py-3">
//                         <div className="flex gap-3">
//                           <Link
//                             to={`/dashboard/track-order/${order.id}`}
//                             className="text-[#0b86d0] text-sm hover:underline"
//                           >
//                             Track
//                           </Link>
//                           <button className="text-[#00c853] text-sm hover:underline">
//                             Invoice
//                           </button>
//                         </div>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           {/* Product table */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-5 border-b border-gray-100">
//               <h5 className="font-semibold text-lg">Recent Product Orders</h5>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-100">
//                   <tr>
//                     {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th> */}
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                     {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
//                       {/* <td className="px-4 py-3 text-sm">#{order.id}</td> */}
//                       <td className="px-4 py-3 text-sm font-medium">{order.service}</td>
//                       <td className="px-4 py-3 text-sm">₹{order.amount}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       {/* <td className="px-4 py-3">
//                         <div className="flex gap-3">
//                           <Link
//                             to={`/dashboard/track-order/${order.id}`}
//                             className="text-[#0b86d0] text-sm hover:underline"
//                           >
//                             Track
//                           </Link>
//                           <button className="text-[#00c853] text-sm hover:underline">
//                             Invoice
//                           </button>
//                         </div>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Order Timeline */}
//           {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//             <h5 className="font-semibold text-lg mb-4">Order Timeline</h5>
//             <div className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <span className="text-green-600">✔</span>
//                 <span>Order Placed</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-green-600">✔</span>
//                 <span>Service Assigned</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-yellow-500">⏳</span>
//                 <span className="text-yellow-600">In Progress</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-gray-400">•</span>
//                 <span className="text-gray-400">Completion Pending</span>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard