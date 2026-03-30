// src/components/user/Sidebar.jsx
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { logoutUser } from '../../services/api'

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard', end: true },
    { path: '/dashboard/service-orders', icon: '🔧', label: 'Service Orders', end: false },
    { path: '/dashboard/product-orders', icon: '🛍️', label: 'Product Orders', end: false },
    { path: '/dashboard/notifications', icon: '🔔', label: 'Notifications', end: false },
    { path: '/dashboard/profile', icon: '👤', label: 'Profile', end: false },
    { path: '/dashboard/support', icon: '🎫', label: 'Support', end: false },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed md:fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r flex flex-col
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto no-scrollbar
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#0b86d0] to-[#00c853] bg-clip-text text-transparent">
            Reparo ⚡
          </h2>
        </div>

        <ul className="p-4 space-y-1 flex-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar

// import React from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { logout } from '../../store/slices/authSlice'
// import { logoutUser } from '../../services/api'

// const Sidebar = ({ isOpen, onClose }) => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const handleLogout = async () => {
//     try {
//       await logoutUser()
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       dispatch(logout())
//       navigate('/login')
//     }
//   }

//   const menuItems = [
//     { path: '/dashboard', icon: '🏠', label: 'Dashboard', end: true },
//     { path: '/dashboard/orders', icon: '📦', label: 'Orders', end: false },
//     { path: '/dashboard/notifications', icon: '🔔', label: 'Notifications', end: false },
//     { path: '/dashboard/profile', icon: '👤', label: 'Profile', end: false },
//     { path: '/dashboard/support', icon: '🎫', label: 'Support', end: false },
//   ]

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={onClose}
//         />
//       )}
      
//       {/* Sidebar - Fixed position, no scroll */}
//       <div className={`
//         fixed md:fixed inset-y-0 left-0 z-50
//         w-64 bg-white border-r flex flex-col
//         transform transition-transform duration-300 ease-in-out
//         overflow-y-auto no-scrollbar
//         ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//       `}>
//         <div className="p-5 border-b sticky top-0 bg-white z-10">
//           <h2 className="text-xl font-bold bg-gradient-to-r from-[#0b86d0] to-[#00c853] bg-clip-text text-transparent">
//             Reparo ⚡
//           </h2>
//         </div>

//         <ul className="p-4 space-y-1 flex-1">
//           {menuItems.map((item) => (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 onClick={onClose}
//                 end={item.end}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
//                     isActive
//                       ? 'bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white shadow-md'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`
//                 }
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </NavLink>
//             </li>
//           ))}
//         </ul>

//         <div className="p-4 border-t sticky bottom-0 bg-white">
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-300 font-medium"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Sidebar