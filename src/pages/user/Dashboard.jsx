// src/pages/user/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/user/Sidebar'

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState([
    { id: 101, service: 'Battery Repair', amount: 1499, status: 'Completed', date: '12 Mar 2026' },
    { id: 102, service: 'Motor Repair', amount: 1299, status: 'In Progress', date: '15 Mar 2026' },
    { id: 103, service: 'General Service', amount: 799, status: 'Cancelled', date: '18 Mar 2026' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const stats = {
    totalOrders: 12,
    totalSpend: 8500,
    activeServices: 2,
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-600'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600'
      case 'Cancelled':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm mb-1">Total Orders</p>
              <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.totalOrders}</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm mb-1">Total Spend</p>
              <h2 className="text-3xl font-bold text-[#00c853]">₹{stats.totalSpend.toLocaleString()}</h2>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm mb-1">Active Services</p>
              <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.activeServices}</h2>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-40 focus:outline-none focus:border-[#0b86d0]"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h5 className="font-semibold text-lg">Recent Orders</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">#{order.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{order.service}</td>
                      <td className="px-4 py-3 text-sm">₹{order.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <Link
                            to={`/dashboard/track-order/${order.id}`}
                            className="text-[#0b86d0] text-sm hover:underline"
                          >
                            Track
                          </Link>
                          <button className="text-[#00c853] text-sm hover:underline">
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h5 className="font-semibold text-lg mb-4">Order Timeline</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✔</span>
                <span>Order Placed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✔</span>
                <span>Service Assigned</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500">⏳</span>
                <span className="text-yellow-600">In Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Completion Pending</span>
              </div>
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
// import { getUserOrders } from '../../services/api'

// const Dashboard = () => {
//   const [orders, setOrders] = useState([])
//   const [stats, setStats] = useState({
//     totalOrders: 12,
//     totalSpend: 8500,
//     activeServices: 2,
//   })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('All Status')
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const fetchOrders = async () => {
//     try {
//       const response = await getUserOrders()
//       setOrders(response.data)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch = order.service.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'text-green-600'
//       case 'In Progress':
//         return 'text-yellow-500'
//       case 'Pending':
//         return 'text-yellow-500'
//       case 'Cancelled':
//         return 'text-red-600'
//       default:
//         return 'text-gray-600'
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 md:ml-64">
//         {/* Header */}
//         <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
//           <h4 className="font-semibold text-lg">Dashboard 👋</h4>
//         </div>

//         <div className="p-4 space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm">Total Orders</p>
//               <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.totalOrders}</h2>
//             </div>
//             <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm">Total Spend</p>
//               <h2 className="text-3xl font-bold text-[#00c853]">₹{stats.totalSpend.toLocaleString()}</h2>
//             </div>
//             <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm">Active Services</p>
//               <h2 className="text-3xl font-bold text-[#0b86d0]">{stats.activeServices}</h2>
//             </div>
//           </div>

//           {/* Search and Filter */}
//           <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border rounded-lg p-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//             />
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border rounded-lg p-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//             >
//               <option>All Status</option>
//               <option>Completed</option>
//               <option>In Progress</option>
//               <option>Pending</option>
//               <option>Cancelled</option>
//             </select>
//           </div>

//           {/* Orders Table */}
//           <div className="bg-white p-5 rounded-xl shadow-sm overflow-x-auto">
//             <h5 className="font-semibold mb-4">Recent Orders</h5>
            
//             {loading ? (
//               <div className="text-center py-8">Loading...</div>
//             ) : (
//               <table className="w-full text-sm">
//                 <thead className="border-b text-gray-500">
//                   <tr>
//                     <th className="py-2 text-left">Order ID</th>
//                     <th className="py-2 text-left">Service</th>
//                     <th className="py-2 text-left">Amount</th>
//                     <th className="py-2 text-left">Status</th>
//                     <th className="py-2 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id} className="border-b hover:bg-gray-50">
//                       <td className="py-3">#{order.id}</td>
//                       <td className="py-3">{order.service}</td>
//                       <td className="py-3">₹{order.amount}</td>
//                       <td className={`py-3 font-medium ${getStatusColor(order.status)}`}>
//                         {order.status}
//                       </td>
//                       <td className="py-3">
//                         <div className="flex gap-2">
//                           <Link
//                             to={`/dashboard/track-order/${order.id}`}
//                             className="text-[#0b86d0] hover:underline text-sm"
//                           >
//                             Track
//                           </Link>
//                           <button
//                             onClick={() => alert('Invoice feature coming soon')}
//                             className="text-[#00c853] hover:underline text-sm"
//                           >
//                             Invoice
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Order Timeline */}
//           <div className="bg-white p-5 rounded-xl shadow-sm">
//             <h5 className="font-semibold mb-4">Order Timeline</h5>
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 text-green-600">
//                 <span>✔</span> Order Placed
//               </div>
//               <div className="flex items-center gap-3 text-green-600">
//                 <span>✔</span> Service Assigned
//               </div>
//               <div className="flex items-center gap-3 text-yellow-500">
//                 <span>⏳</span> In Progress
//               </div>
//               <div className="flex items-center gap-3 text-gray-400">
//                 <span>•</span> Completion Pending
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard