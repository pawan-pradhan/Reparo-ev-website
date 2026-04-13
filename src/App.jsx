// src/App.jsx
import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Services from './pages/Services'
import Partners from './pages/Partners'
import SocialMedia from './pages/SocialMedia'
import ContactUs from './pages/ContactUs'
import ProductDetails from './pages/ProductDetails'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
import OtpVerification from './pages/OtpVerification'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import FAQs from './pages/FAQs'

// New Product Pages
import ProductCart from './pages/ProductCart'
import ProductCheckout from './pages/ProductCheckout'

// User Panel Pages
import Dashboard from './pages/user/Dashboard'
import ServiceOrders from './pages/user/ServiceOrders'
import ProductOrders from './pages/user/ProductOrders'
import TrackOrder from './pages/user/TrackOrder'
import Profile from './pages/user/Profile'
import Support from './pages/user/Support'
import Notifications from './pages/user/Notifications'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import RefundPolicy from './pages/RefundPolicy'


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }, [])

  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  
  const isUserPanelRoute = location.pathname.startsWith('/dashboard')
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/verify-otp' || location.pathname === '/register'
  
  const hideNavbar = isUserPanelRoute || isAuthRoute
  const hideFooter = isUserPanelRoute || isAuthRoute

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/services" element={<Services />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/social" element={<SocialMedia />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

     
        {/* Service Order Routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        {/* Product Order Routes */}
        <Route path="/product-cart" element={
          <ProtectedRoute>
            <ProductCart />
          </ProtectedRoute>
        } />
        <Route path="/product-checkout" element={
          <ProtectedRoute>
            <ProductCheckout />
          </ProtectedRoute>
        } />
        
        {/* User Panel Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/service-orders" element={
          <ProtectedRoute>
            <ServiceOrders />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/product-orders" element={
          <ProtectedRoute>
            <ProductOrders />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/track-order/:id" element={
          <ProtectedRoute>
            <TrackOrder />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  )
}

export default App