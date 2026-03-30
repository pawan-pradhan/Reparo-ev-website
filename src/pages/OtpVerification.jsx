import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { verifyOTP, sendOTP, getUserProfile } from '../services/api'
import { login } from '../store/slices/authSlice'

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [userId, setUserId] = useState(null)
  
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const mobile = location.state?.mobile || sessionStorage.getItem('temp_mobile')

  useEffect(() => {
    if (!mobile) {
      navigate('/login')
      return
    }
    
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [mobile, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('')
    
    if (otpValue.length !== 4) {
      setError('Please enter complete 4-digit OTP')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await verifyOTP(mobile, otpValue)
      console.log('Verify Response:', response)
      
      if (response.message === 'Otp verified successfully') {
        const { token, is_registered } = response.data
        
        // Store user ID for resend OTP
        if (response.data?._id) {
          setUserId(response.data._id)
          sessionStorage.setItem('temp_user_id', response.data._id)
        }
        
        if (is_registered === 0) {
          // User not registered, go to registration
          sessionStorage.setItem('temp_token', token)
          sessionStorage.setItem('temp_mobile', mobile)
          navigate('/register', { state: { mobile, token } })
        } else {
          // User already registered, fetch profile first then login
          try {
            const profileResponse = await getUserProfile()
            
            dispatch(login({
              user: {
                name: profileResponse.name,
                email: profileResponse.email,
                mobile_number: profileResponse.mobile_number,
                city: profileResponse.city,
                state: profileResponse.state,
                address: profileResponse.address,
                pincode: profileResponse.pincode,
                _id: profileResponse._id || response.data._id
              },
              token: token
            }))
          } catch (err) {
            // If profile fetch fails, login with basic info
            dispatch(login({
              user: { 
                mobile_number: mobile,
                _id: response.data._id
              },
              token: token
            }))
          }
          
          const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
          sessionStorage.removeItem('redirectAfterLogin')
          navigate(redirectTo)
        }
      } else {
        setError(response.message || 'Invalid OTP. Please try again.')
      }
    } catch (err) {
      console.error('Verify OTP Error:', err)
      setError(err.response?.data?.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return
    
    setCanResend(false)
    setResendTimer(30)
    
    // Restart timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    try {
      // Get user ID from storage or use from state
      let userIdToSend = userId || sessionStorage.getItem('temp_user_id')
      
      // If no user ID, try to get from verify response or use mobile
      if (!userIdToSend) {
        // First try to get user ID by sending OTP again
        const sendResponse = await sendOTP(mobile)
        if (sendResponse.data?._id) {
          userIdToSend = sendResponse.data._id
          setUserId(userIdToSend)
          sessionStorage.setItem('temp_user_id', userIdToSend)
        }
      }
      
      // Call resend OTP API with user ID
      const resendResponse = await fetch('https://reparo24.com/web/user/resend_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          _id: userIdToSend || ''
        })
      })
      
      const data = await resendResponse.json()
      console.log('Resend OTP Response:', data)
      
      if (data.message === 'OTP sent successfully') {
        setError('')
        // Store user ID if received
        if (data.data?._id) {
          setUserId(data.data._id)
          sessionStorage.setItem('temp_user_id', data.data._id)
        }
      } else {
        setError(data.message || 'Failed to resend OTP')
        // If failed, try sending OTP again with mobile number
        try {
          await sendOTP(mobile)
          setError('OTP resent successfully!')
        } catch (sendErr) {
          console.log("sendErr",sendErr)
          setError('Failed to resend OTP. Please try again.')
        }
      }
    } catch (err) {
      console.error('Resend OTP Error:', err)
      // Fallback: Try sending OTP with mobile number
      try {
        const { sendOTP } = await import('../services/api')
        await sendOTP(mobile)
        setError('OTP resent successfully!')
      } catch (fallbackErr) {
        console.log("fallbackErr",fallbackErr)
        setError('Failed to resend OTP. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
      <div className="w-full max-w-md bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-8 mx-4">
        
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Verify OTP ⚡
        </h2>
        <p className="text-white/80 text-center mb-6">
          Enter the 4-digit OTP sent to +91 {mobile}
        </p>

        {error && (
          <div className={`mb-4 p-3 rounded-lg text-white text-sm ${
            error.includes('successfully') 
              ? 'bg-green-500/20 border border-green-500' 
              : 'bg-red-500/20 border border-red-500'
          }`}>
            {error}
          </div>
        )}

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 border-white/30 bg-white/20 text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className="w-full bg-white text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center mt-4">
          <p className="text-white/80 text-sm">
            Didn't receive OTP?{' '}
            <button
              onClick={handleResendOTP}
              disabled={!canResend}
              className={`font-semibold ${canResend ? 'text-white hover:underline' : 'text-white/50 cursor-not-allowed'}`}
            >
              {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification









// import React, { useState, useEffect, useRef } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { verifyOTP } from '../services/api'
// import { login } from '../store/slices/authSlice'

// const OtpVerification = () => {
//   const [otp, setOtp] = useState(['', '', '', ''])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [resendTimer, setResendTimer] = useState(30)
//   const [canResend, setCanResend] = useState(false)
  
//   const inputRefs = useRef([])
//   const navigate = useNavigate()
//   const location = useLocation()
//   const dispatch = useDispatch()
  
//   const mobile = location.state?.mobile || sessionStorage.getItem('temp_mobile')

//   useEffect(() => {
//     if (!mobile) {
//       navigate('/login')
//       return
//     }
    
//     // Start resend timer
//     const timer = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           setCanResend(true)
//           clearInterval(timer)
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)
    
//     return () => clearInterval(timer)
//   }, [mobile, navigate])

//   const handleOtpChange = (index, value) => {
//     if (value.length > 1) return
    
//     const newOtp = [...otp]
//     newOtp[index] = value
//     setOtp(newOtp)
    
//     // Auto focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1].focus()
//     }
//   }

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus()
//     }
//   }

//   const handleVerifyOTP = async () => {
//     const otpValue = otp.join('')
    
//     if (otpValue.length !== 4) {
//       setError('Please enter complete 4-digit OTP')
//       return
//     }
    
//     setLoading(true)
//     setError('')
    
//     try {
//       const response = await verifyOTP(mobile, otpValue)
//       console.log('Verify Response:', response)
      
//         //   if (response.message === 'Otp verified successfully') {
//         //     const { token, is_registered } = response.data
            
//         //     if (is_registered === 0) {
//         //       // User not registered, go to registration
//         //       sessionStorage.setItem('temp_token', token)
//         //       sessionStorage.setItem('temp_mobile', mobile)
//         //       navigate('/register', { state: { mobile, token } })
//         //     } else {
//         //       // User already registered, login directly
//         //       dispatch(login({
//         //         user: { mobile },
//         //         token: token
//         //       }))
            
//         //       // Redirect to previous page or home
//         //       const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/'
//         //       sessionStorage.removeItem('redirectAfterLogin')
//         //       navigate(redirectTo)
//         //     }
//         //   } 
      
//         // src/pages/OtpVerification.jsx - Update the verified section
//         if (response.message === 'Otp verified successfully') {
//             const { token, is_registered } = response.data
            
//             if (is_registered === 0) {
//                 // User not registered, go to registration
//                 sessionStorage.setItem('temp_token', token)
//                 sessionStorage.setItem('temp_mobile', mobile)
//                 navigate('/register', { state: { mobile, token } })
//             } else {
//                 // User already registered, fetch profile first then login
//                 try {
//                 const { getUserProfile } = await import('../services/api')
//                 const profileResponse = await getUserProfile()
                
//                 dispatch(login({
//                     user: {
//                     name: profileResponse.name,
//                     email: profileResponse.email,
//                     mobile_number: profileResponse.mobile_number,
//                     city: profileResponse.city,
//                     state: profileResponse.state,
//                     address: profileResponse.address,
//                     pincode: profileResponse.pincode
//                     },
//                     token: token
//                 }))
//                 } catch (err) {
//                     // If profile fetch fails, login with basic info
//                     dispatch(login({
//                         user: { mobile_number: mobile },
//                         token: token
//                     }))
//                 }
                
//                 const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
//                 sessionStorage.removeItem('redirectAfterLogin')
//                 navigate(redirectTo)
//             }
//         }
      
//       else {
//         setError(response.message || 'Invalid OTP. Please try again.')
//       }
//     } catch (err) {
//       console.error('Verify OTP Error:', err)
//       setError(err.response?.data?.message || 'Network error. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResendOTP = async () => {
//     if (!canResend) return
    
//     setCanResend(false)
//     setResendTimer(30)
    
//     // Restart timer
//     const timer = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           setCanResend(true)
//           clearInterval(timer)
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)
    
//     try {
//       // Resend OTP API call
//       const { sendOTP } = await import('../services/api')
//       await sendOTP(mobile)
//       setError('')
//     } catch (err) {
//       console.error('Resend OTP Error:', err)
//       setError('Failed to resend OTP')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
//       <div className="w-full max-w-md bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-8 mx-4">
        
//         <h2 className="text-3xl font-bold text-center text-white mb-2">
//           Verify OTP ⚡
//         </h2>
//         <p className="text-white/80 text-center mb-6">
//           Enter the 4-digit OTP sent to +91 {mobile}
//         </p>

//         {error && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
//             {error}
//           </div>
//         )}

//         {/* OTP Input Boxes */}
//         <div className="flex justify-center gap-3 mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               type="text"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => handleOtpChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 border-white/30 bg-white/20 text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
//             />
//           ))}
//         </div>

//         <button
//           onClick={handleVerifyOTP}
//           disabled={loading}
//           className="w-full bg-white text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Verifying...' : 'Verify OTP'}
//         </button>

//         <div className="text-center mt-4">
//           <p className="text-white/80 text-sm">
//             Didn't receive OTP?{' '}
//             <button
//               onClick={handleResendOTP}
//               disabled={!canResend}
//               className={`font-semibold ${canResend ? 'text-white hover:underline' : 'text-white/50 cursor-not-allowed'}`}
//             >
//               {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OtpVerification