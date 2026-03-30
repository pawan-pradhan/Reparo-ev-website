// src/pages/user/Notifications.jsx
import React, { useState } from 'react'
import Sidebar from '../../components/user/Sidebar'

const Notifications = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Confirmed', message: 'Your order #101 has been confirmed', time: '2 hours ago', read: false },
    { id: 2, title: 'Technician Assigned', message: 'Ravi Kumar has been assigned for your service', time: '5 hours ago', read: false },
    { id: 3, title: 'Service Completed', message: 'Your service has been completed successfully', time: '1 day ago', read: true },
    { id: 4, title: 'Payment Received', message: 'Payment of ₹1499 received successfully', time: '2 days ago', read: true },
  ])

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
              onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
              className="text-[#0b86d0] text-sm hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition ${
                  !notification.read ? 'border-l-4 border-l-[#0b86d0]' : 'border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold">{notification.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#0b86d0] rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
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