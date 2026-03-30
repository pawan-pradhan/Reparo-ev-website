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
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/services', label: 'Services' },
    { path: '/partners', label: 'Partners' },
    { path: '/social', label: 'Social Media' },
    { path: '/contact', label: 'Contact US' },
    { path: '/faqs', label: "FAQ's" }, // ✅ Added FAQ's link
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors font-medium ${
                  isActive(link.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-5">
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
                <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 transition">
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
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition shadow-md"
              >
                Book Your Service
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-gray-700"
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
                className={`block py-2 transition ${
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
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-bag text-xl"></i>
              Cart {productCartCount > 0 && `(${productCartCount})`}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/dashboard/product-orders" 
                  className="block py-2 text-gray-700 hover:text-primary transition"
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
                className="block text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md font-semibold"
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
//     { path: '/contact', label: 'Contact US' },
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







// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../../store/slices/authSlice'
// // import { useCart } from '../../context/CartContext'
// import { useProductCart } from '../../context/ProductCartContext'

// const Navbar = () => {

//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   // const { cartCount } = useCart()

//   const { getTotalQuantity } = useProductCart()
//   const productCartCount = getTotalQuantity()

//   const handleLogout = () => {
//     dispatch(logout())
//     navigate('/login')
//   }

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
//             <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Home
//             </Link>
//             <Link to="/shop" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Shop
//             </Link>
//             <Link to="/services" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Services
//             </Link>
//             <Link to="/partners" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Partners
//             </Link>
//             <Link to="/social" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Social Media
//             </Link>
//             <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors font-medium">
//               Contact US
//             </Link>
//           </div>

//           {/* Right Section */}
//           <div className="hidden lg:flex items-center space-x-5">
//             {/* Cart Icon */}
//             {/* <Link to="/cart" className="relative">
//               <i className="bi bi-cart3 text-2xl text-gray-700 hover:text-primary transition"></i>
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link> */}

//             {/* Product Cart Icon */}
//             <Link to="/product-cart" className="relative ml-4">
//               <i className="bi bi-bag text-2xl"></i>
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
//             <Link 
//               to="/" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link 
//               to="/shop" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Shop
//             </Link>
//             <Link 
//               to="/services" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Services
//             </Link>
//             <Link 
//               to="/partners" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Partners
//             </Link>
//             <Link 
//               to="/social" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Social Media
//             </Link>
//             <Link 
//               to="/contact" 
//               className="block py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Contact US
//             </Link>
            
//             <hr className="my-2" />
            
//             <Link 
//               to="/cart" 
//               className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <i className="bi bi-cart3 text-xl"></i>
//               Cart {cartCount > 0 && `(${cartCount})`}
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
//                   to="/dashboard/orders" 
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



// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../../store/slices/authSlice'
// import { useCart } from '../../context/CartContext'

// const Navbar = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const { totalQuantity } = useSelector((state) => state.cart)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { cartCount } = useCart()

//   const handleLogout = () => {
//     dispatch(logout())
//     navigate('/')
//   }

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4">

//         <div className="flex justify-between items-center py-3">

//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img src="/assets/logo/logo.png" alt="Reparo Logo" className="h-12 w-auto" />
//           </Link>

//           {/* Mobile Toggle */}
//           <button
//             className="lg:hidden text-2xl text-dark"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <i className="bi bi-list"></i>
//           </button>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-6">

//             <Link to="/" className="hover:text-primary">Home</Link>
//             <Link to="/shop" className="hover:text-primary">Shop</Link>
//             <Link to="/services" className="hover:text-primary">Services</Link>
//             <Link to="/partners" className="hover:text-primary">Partners</Link>
//             <Link to="/social" className="hover:text-primary">Social Media</Link>
//             <Link to="/contact" className="hover:text-primary">Contact US</Link>

//             {/* Cart */}
            
//             {/* <Link to="/cart" className="relative ml-2">
//               <i className="bi bi-cart3 text-2xl"></i>
//               {totalQuantity > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                   {totalQuantity}
//                 </span>
//               )}
//             </Link> */}


//             <Link to="/cart" className="relative">
//               <i className="bi bi-cart3 text-2xl"></i>
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Auth Button */}
//             {isAuthenticated ? (
//               <div className="relative group ml-3">
//                 <button className="bg-secondary text-white px-4 py-2 rounded-md font-semibold">
//                   {user?.name || 'Account'}
//                 </button>

//                 {/* Dropdown */}
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                   <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
//                     My Profile
//                   </Link>
//                   <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
//                     My Orders
//                   </Link>
//                   <hr />
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="ml-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-md font-semibold shadow-md hover:opacity-90 transition"
//               >
//                 Book Your Service
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden border-t py-4 space-y-3">

//             <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
//             <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
//             <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
//             <Link to="/partners" onClick={() => setIsMenuOpen(false)}>Partners</Link>
//             <Link to="/social" onClick={() => setIsMenuOpen(false)}>Social Media</Link>
//             <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>

//             <Link to="/cart" className="flex items-center gap-2">
//               <i className="bi bi-cart3"></i>
//               Cart {totalQuantity > 0 && `(${totalQuantity})`}
//             </Link>

//             {isAuthenticated ? (
//               <button
//                 onClick={handleLogout}
//                 className="w-full bg-secondary text-white py-2 rounded-md"
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 className="block text-center bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-md"
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