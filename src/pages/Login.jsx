// src/pages/Login.jsx



// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOTP } from '../services/api'

const Login = () => {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    // Validate mobile number
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await sendOTP(mobile)
      console.log('Send OTP Response:', response)
      
      // ✅ FIX: Check response.message instead of direct string comparison
      if (response.message === 'OTP sent successfully') {
        // Store mobile number temporarily
        sessionStorage.setItem('temp_mobile', mobile)
        
        // ✅ Store user ID if received (important for resend OTP)
        if (response.data?._id) {
          sessionStorage.setItem('temp_user_id', response.data._id)
        }
        
        // Navigate to OTP verification page
        navigate('/verify-otp', { state: { mobile } })
      } else {
        setError(response.message || 'Failed to send OTP')
      }
    } catch (err) {
      console.error('Send OTP Error:', err)
      setError(err.response?.data?.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
      <div className="w-full max-w-md bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-8 mx-4">
        
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Login with OTP ⚡
        </h2>
        <p className="text-white/80 text-center mb-6">
          Enter your mobile number to receive OTP
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSendOTP}>
          <label className="text-white mb-2 block font-medium">Mobile Number</label>
          <div className="flex items-center bg-white rounded-lg overflow-hidden mb-5">
            <span className="px-4 text-gray-600 border-r bg-gray-50 font-semibold">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0b86d0] transition-all"
              maxLength="10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Send OTP ⚡'}
          </button>
        </form>

        <p className="text-center mt-4 text-white/80 text-sm">
          By continuing, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  )
}

export default Login