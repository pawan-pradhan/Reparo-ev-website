// src/pages/user/Notifications.jsx
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/user/Sidebar'

const Notifications = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('https://reparo24.com/web/get_notification', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Notifications Response:', data)
      
      if (Array.isArray(data)) {
        const formattedNotifications = data.map(notif => ({
          id: notif._id,
          title: notif.title,
          message: notif.message,
          time: formatDate(notif.created_at),
          read: notif.status === 'read',
          type: notif.type,
          data: notif.data,
          createdAt: notif.created_at
        }))
        setNotifications(formattedNotifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const markAsRead = async (id, type) => {
    try {
      const token = localStorage.getItem('token')
      
      const formData = new URLSearchParams()
      formData.append('_id', id)
      formData.append('type', type)
      
      const response = await fetch('https://reparo24.com/web/notification-mark-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
      
      const data = await response.json()
      console.log('Mark as read response:', data)
      
      if (data.success || data.status === 200) {
        // Update local state
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('https://reparo24.com/web/notifications-mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Mark all as read response:', data)
      
      if (data.success || data.status === 200) {
        // Mark all as read in local state
        setNotifications(notifications.map(notif => ({ ...notif, read: true })))
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setMarkingAll(false)
    }
  }

  const getNotificationIcon = (type) => {
    if (type?.includes('payment')) return '💰'
    if (type?.includes('order')) return '📦'
    if (type?.includes('service')) return '🔧'
    return '🔔'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-2xl text-gray-600"
            >
              ☰
            </button>
            <h4 className="font-semibold text-lg">
              Notifications 🔔
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h4>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="text-[#0b86d0] text-sm hover:underline disabled:opacity-50"
            >
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h5 className="font-semibold text-lg mb-2">No Notifications</h5>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id, notification.type)}
                  className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-all ${
                    !notification.read 
                      ? 'border-l-4 border-l-[#0b86d0] bg-gradient-to-r from-white to-blue-50/30' 
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      !notification.read 
                        ? 'bg-[#0b86d0]/10' 
                        : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className={`font-semibold ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.title}
                          </h5>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#0b86d0] rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications



// import React, { useState } from 'react'
// import Sidebar from '../../components/user/Sidebar'

// const Notifications = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [notifications, setNotifications] = useState([
//     { id: 1, title: 'Order Confirmed', message: 'Your order #101 has been confirmed', time: '2 hours ago', read: false },
//     { id: 2, title: 'Technician Assigned', message: 'Ravi Kumar has been assigned for your service', time: '5 hours ago', read: false },
//     { id: 3, title: 'Service Completed', message: 'Your service has been completed successfully', time: '1 day ago', read: true },
//     { id: 4, title: 'Payment Received', message: 'Payment of ₹1499 received successfully', time: '2 days ago', read: true },
//   ])

//   const markAsRead = (id) => {
//     setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
//   }

//   const unreadCount = notifications.filter(n => !n.read).length

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
//       <div className="flex-1 ml-0 md:ml-64">
//         <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setMobileMenuOpen(true)}
//               className="md:hidden text-2xl text-gray-600"
//             >
//               ☰
//             </button>
//             <h4 className="font-semibold text-lg">
//               Notifications 🔔
//               {unreadCount > 0 && (
//                 <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                   {unreadCount} new
//                 </span>
//               )}
//             </h4>
//           </div>
//           {unreadCount > 0 && (
//             <button
//               onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
//               className="text-[#0b86d0] text-sm hover:underline"
//             >
//               Mark all as read
//             </button>
//           )}
//         </div>

//         <div className="p-4 md:p-6">
//           <div className="max-w-2xl mx-auto space-y-3">
//             {notifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 onClick={() => markAsRead(notification.id)}
//                 className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition ${
//                   !notification.read ? 'border-l-4 border-l-[#0b86d0]' : 'border-gray-100'
//                 }`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h5 className="font-semibold">{notification.title}</h5>
//                     <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
//                     <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
//                   </div>
//                   {!notification.read && (
//                     <div className="w-2 h-2 bg-[#0b86d0] rounded-full mt-2"></div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Notifications









// import React, { useState } from 'react'
// import Sidebar from '../../components/user/Sidebar'

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: 'Order Confirmed',
//       message: 'Your order #101 has been confirmed',
//       time: '2 hours ago',
//       read: false,
//     },
//     {
//       id: 2,
//       title: 'Technician Assigned',
//       message: 'Ravi Kumar has been assigned for your service',
//       time: '5 hours ago',
//       read: false,
//     },
//     {
//       id: 3,
//       title: 'Service Completed',
//       message: 'Your service has been completed successfully',
//       time: '1 day ago',
//       read: true,
//     },
//     {
//       id: 4,
//       title: 'Payment Received',
//       message: 'Payment of ₹1499 received successfully',
//       time: '2 days ago',
//       read: true,
//     },
//   ])

//   const markAsRead = (id) => {
//     setNotifications(notifications.map(notif =>
//       notif.id === id ? { ...notif, read: true } : notif
//     ))
//   }

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(notif => ({ ...notif, read: true })))
//   }

//   const unreadCount = notifications.filter(n => !n.read).length

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 md:ml-64">
//         <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
//           <h4 className="font-semibold text-lg">
//             Notifications 🔔
//             {unreadCount > 0 && (
//               <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                 {unreadCount} new
//               </span>
//             )}
//           </h4>
//           {unreadCount > 0 && (
//             <button
//               onClick={markAllAsRead}
//               className="text-[#0b86d0] text-sm hover:underline"
//             >
//               Mark all as read
//             </button>
//           )}
//         </div>

//         <div className="p-4">
//           <div className="max-w-3xl mx-auto space-y-3">
//             {notifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
//                   !notification.read ? 'border-l-4 border-[#0b86d0]' : ''
//                 }`}
//                 onClick={() => markAsRead(notification.id)}
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h5 className="font-semibold">{notification.title}</h5>
//                     <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
//                     <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
//                   </div>
//                   {!notification.read && (
//                     <div className="w-2 h-2 bg-[#0b86d0] rounded-full mt-2"></div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Notifications