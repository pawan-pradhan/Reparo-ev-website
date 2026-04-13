// src/components/layout/Navbar.jsx

// src/components/layout/Navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { useProductCart } from '../../context/ProductCartContext'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getTotalQuantity } = useProductCart()
  const productCartCount = getTotalQuantity()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('product_cart') // ✅ Clear token from localStorage
    // sessionStorage.removeItem('pendingProductAction') // ✅ Clear pending product action
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/services', label: 'Services' },
    // { path: '/partners', label: 'Partners' },
    { path: '/partners', label: 'Partner With Us' },
    // { path: '/social', label: 'Social Media' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/faqs', label: "FAQ's" },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          
          {/* Logo - Left side */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors font-medium no-underline whitespace-nowrap py-1 ${
                  isActive(link.path)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Fixed width to keep layout stable */}
          <div className="hidden lg:flex items-center space-x-5 shrink-0">
            {/* Product Cart Icon */}
            <Link to="/product-cart" className="relative">
              <i className="bi bi-bag text-2xl text-gray-700 hover:text-primary transition"></i>
              {productCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {productCartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 transition whitespace-nowrap">
                  {user?.name?.split(' ')[0] || 'Account'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
                    📊 Dashboard
                  </Link>
                  <Link to="/dashboard/product-orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    📦 My Orders
                  </Link>
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    👤 My Profile
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition shadow-md whitespace-nowrap"
              >
                Book Your Service
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-gray-700 shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 transition no-underline ${
                  isActive(link.path)
                    ? 'text-primary font-semibold'
                    : 'text-gray-700 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <hr className="my-2" />
            
            <Link 
              to="/product-cart" 
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-bag text-xl"></i>
              Cart {productCartCount > 0 && `(${productCartCount})`}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 hover:text-primary transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/dashboard/product-orders" 
                  className="block py-2 text-gray-700 hover:text-primary transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-600 hover:text-red-700 transition"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md font-semibold no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Your Service
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
// import React, { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../../store/slices/authSlice'
// import { useProductCart } from '../../context/ProductCartContext'

// const Navbar = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { getTotalQuantity } = useProductCart()
//   const productCartCount = getTotalQuantity()

//   const handleLogout = () => {
//     dispatch(logout())
//     navigate('/login')
//   }

//   const isActive = (path) => {
//     return location.pathname === path
//   }

//   const navLinks = [
//     { path: '/', label: 'Home' },
//     { path: '/shop', label: 'Shop' },
//     { path: '/services', label: 'Services' },
//     { path: '/partners', label: 'Partners' },
//     { path: '/social', label: 'Social Media' },
//     { path: '/contact', label: 'Contact Us' },
//     { path: '/faqs', label: "FAQ's" },
//   ]

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-3">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-12 w-auto" />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`transition-colors font-medium ${
//                   isActive(link.path)
//                     ? 'text-primary border-b-2 border-primary pb-1'
//                     : 'text-gray-700 hover:text-primary no-underline'
//                 }`}
//                 style={{ textDecoration: 'none' }}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Right Section */}
//           <div className="hidden lg:flex items-center space-x-5">
//             {/* Product Cart Icon */}
//             <Link to="/product-cart" className="relative">
//               <i className="bi bi-bag text-2xl text-gray-700 hover:text-primary transition"></i>
//               {productCartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {productCartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Auth Button */}
//             {isAuthenticated ? (
//               <div className="relative group">
//                 <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 transition">
//                   {user?.name?.split(' ')[0] || 'Account'}
//                 </button>
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
//                     📊 Dashboard
//                   </Link>
//                   <Link to="/dashboard/product-orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                     📦 My Orders
//                   </Link>
//                   <Link to="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                     👤 My Profile
//                   </Link>
//                   <hr className="my-1" />
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     🚪 Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition shadow-md"
//               >
//                 Book Your Service
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden text-2xl text-gray-700"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <i className="bi bi-list"></i>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden py-4 border-t space-y-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`block py-2 transition no-underline ${
//                   isActive(link.path)
//                     ? 'text-primary font-semibold'
//                     : 'text-gray-700 hover:text-primary'
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//                 style={{ textDecoration: 'none' }}
//               >
//                 {link.label}
//               </Link>
//             ))}
            
//             <hr className="my-2" />
            
//             <Link 
//               to="/product-cart" 
//               className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition no-underline"
//               onClick={() => setIsMenuOpen(false)}
//               style={{ textDecoration: 'none' }}
//             >
//               <i className="bi bi-bag text-xl"></i>
//               Cart {productCartCount > 0 && `(${productCartCount})`}
//             </Link>
            
//             {isAuthenticated ? (
//               <>
//                 <Link 
//                   to="/dashboard" 
//                   className="block py-2 text-gray-700 hover:text-primary transition no-underline"
//                   onClick={() => setIsMenuOpen(false)}
//                   style={{ textDecoration: 'none' }}
//                 >
//                   📊 Dashboard
//                 </Link>
//                 <Link 
//                   to="/dashboard/product-orders" 
//                   className="block py-2 text-gray-700 hover:text-primary transition no-underline"
//                   onClick={() => setIsMenuOpen(false)}
//                   style={{ textDecoration: 'none' }}
//                 >
//                   📦 My Orders
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left py-2 text-red-600 hover:text-red-700 transition"
//                 >
//                   🚪 Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="block text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md font-semibold no-underline"
//                 onClick={() => setIsMenuOpen(false)}
//                 style={{ textDecoration: 'none' }}
//               >
//                 Book Your Service
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar



// import React, { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../../store/slices/authSlice'
// import { useProductCart } from '../../context/ProductCartContext'

// const Navbar = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { getTotalQuantity } = useProductCart()
//   const productCartCount = getTotalQuantity()

//   const handleLogout = () => {
//     dispatch(logout())
//     navigate('/login')
//   }

//   const isActive = (path) => {
//     return location.pathname === path
//   }

//   const navLinks = [
//     { path: '/', label: 'Home' },
//     { path: '/shop', label: 'Shop' },
//     { path: '/services', label: 'Services' },
//     { path: '/partners', label: 'Partners' },
//     { path: '/social', label: 'Social Media' },
//     { path: '/contact', label: 'Contact Us' },
//     { path: '/faqs', label: "FAQ's" }, // ✅ Added FAQ's link
//   ]

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-3">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-12 w-auto" />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`transition-colors font-medium ${
//                   isActive(link.path)
//                     ? 'text-primary border-b-2 border-primary pb-1'
//                     : 'text-gray-700 hover:text-primary'
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Right Section */}
//           <div className="hidden lg:flex items-center space-x-5">
//             {/* Product Cart Icon */}
//             <Link to="/product-cart" className="relative">
//               <i className="bi bi-bag text-2xl text-gray-700 hover:text-primary transition"></i>
//               {productCartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {productCartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Auth Button */}
//             {isAuthenticated ? (
//               <div className="relative group">
//                 <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 transition">
//                   {user?.name?.split(' ')[0] || 'Account'}
//                 </button>
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
//                     📊 Dashboard
//                   </Link>
//                   <Link to="/dashboard/product-orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                     📦 My Orders
//                   </Link>
//                   <Link to="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                     👤 My Profile
//                   </Link>
//                   <hr className="my-1" />
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     🚪 Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition shadow-md"
//               >
//                 Book Your Service
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden text-2xl text-gray-700"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <i className="bi bi-list"></i>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden py-4 border-t space-y-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`block py-2 transition ${
//                   isActive(link.path)
//                     ? 'text-primary font-semibold'
//                     : 'text-gray-700 hover:text-primary'
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}
            
//             <hr className="my-2" />
            
//             <Link 
//               to="/product-cart" 
//               className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <i className="bi bi-bag text-xl"></i>
//               Cart {productCartCount > 0 && `(${productCartCount})`}
//             </Link>
            
//             {isAuthenticated ? (
//               <>
//                 <Link 
//                   to="/dashboard" 
//                   className="block py-2 text-gray-700 hover:text-primary transition"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   📊 Dashboard
//                 </Link>
//                 <Link 
//                   to="/dashboard/product-orders" 
//                   className="block py-2 text-gray-700 hover:text-primary transition"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   📦 My Orders
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left py-2 text-red-600 hover:text-red-700 transition"
//                 >
//                   🚪 Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="block text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md font-semibold"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Book Your Service
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar