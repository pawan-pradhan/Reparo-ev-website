// src/pages/Register.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from '../services/api'
import { login } from '../store/slices/authSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
    address: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const mobile = location.state?.mobile || sessionStorage.getItem('temp_mobile')
  const token = location.state?.token || sessionStorage.getItem('temp_token')

  useEffect(() => {
    if (!mobile || !token) {
      console.log('No mobile or token, redirecting to login')
      navigate('/login')
    }
    console.log('Register - Token being used:', token)
  }, [mobile, token, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.city || !formData.state || !formData.address || !formData.pincode) {
      setError('Please fill all fields')
      return
    }
    
    if (formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode')
      return
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // ✅ PASS TOKEN TO API FUNCTION
      const response = await registerUser(formData, token)
      console.log('Register Response:', response)
      
      if (response.message === 'User Register Successfully') {
        dispatch(login({
          user: { 
            name: formData.name, 
            email: formData.email,
            mobile_number: mobile,
            city: formData.city,
            state: formData.state,
            address: formData.address,
            pincode: formData.pincode
          },
          token: token
        }))
        
        localStorage.setItem('token', token)
        
        sessionStorage.removeItem('temp_mobile')
        sessionStorage.removeItem('temp_token')
        sessionStorage.removeItem('temp_user_id')
        
        navigate('/dashboard')
      } else {
        setError(response.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('Register Error:', err)
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
      <div className="w-full max-w-2xl bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-8 mx-4">
        
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Complete Your Profile ⚡
        </h2>
        <p className="text-white/80 text-center mb-6">
          Please provide your details to complete registration
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white mb-2 block font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your city"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your state"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-white mb-2 block font-medium">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                rows="3"
                placeholder="Enter your full address"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                maxLength="6"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter 6-digit pincode"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block font-medium">Mobile Number</label>
              <input
                type="tel"
                value={mobile || ''}
                className="w-full px-4 py-3 rounded-lg bg-white/50 text-gray-600 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-white text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Complete Registration ⚡'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register









// import React, { useState, useEffect } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { registerUser } from '../services/api'
// import { login } from '../store/slices/authSlice'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     city: '',
//     state: '',
//     address: '',
//     pincode: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   const navigate = useNavigate()
//   const location = useLocation()
//   const dispatch = useDispatch()
  
//   const mobile = location.state?.mobile || sessionStorage.getItem('temp_mobile')
//   const token = location.state?.token || sessionStorage.getItem('temp_token')

//   useEffect(() => {
//     if (!mobile || !token) {
//       navigate('/login')
//     }
//   }, [mobile, token, navigate])

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     // Validation
//     if (!formData.name || !formData.email || !formData.city || !formData.state || !formData.address || !formData.pincode) {
//       setError('Please fill all fields')
//       return
//     }
    
//     if (formData.pincode.length !== 6) {
//       setError('Please enter a valid 6-digit pincode')
//       return
//     }
    
//     if (!formData.email.includes('@')) {
//       setError('Please enter a valid email address')
//       return
//     }
    
//     setLoading(true)
//     setError('')
    
//     try {
//       const response = await registerUser(formData)
//       console.log('Register Response:', response)
      
//       // if (response.message === 'User Register Successfully') {
//       //   // Registration successful, login the user
//       //   dispatch(login({
//       //     user: { ...formData, mobile },
//       //     token: token
//       //   }))
        
//       //   // Clear temp data
//       //   sessionStorage.removeItem('temp_mobile')
//       //   sessionStorage.removeItem('temp_token')
        
//       //   // Redirect to home
//       //   navigate('/')
//       // } 
      
//       // src/pages/Register.jsx - Update the success section
//       if (response.message === 'User Register Successfully') {
//         // Registration successful, login the user
//         dispatch(login({
//           user: { 
//             name: formData.name, 
//             email: formData.email,
//             mobile_number: mobile,
//             city: formData.city,
//             state: formData.state,
//             address: formData.address,
//             pincode: formData.pincode
//           },
//           token: token
//         }))
        
//         // Clear temp data
//         sessionStorage.removeItem('temp_mobile')
//         sessionStorage.removeItem('temp_token')
        
//         // Redirect to home
//         navigate('/')
//       }
//       else 
//       {
//         setError(response.message || 'Registration failed. Please try again.')
//       }
//     } catch (err) {
//       console.error('Register Error:', err)
//       setError(err.response?.data?.message || 'Network error. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen py-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
//       <div className="w-full max-w-2xl bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-8 mx-4">
        
//         <h2 className="text-3xl font-bold text-center text-white mb-2">
//           Complete Your Profile ⚡
//         </h2>
//         <p className="text-white/80 text-center mb-6">
//           Please provide your details to complete registration
//         </p>

//         {error && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-white mb-2 block font-medium">Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 placeholder="Enter your full name"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-white mb-2 block font-medium">Email Address *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-white mb-2 block font-medium">City *</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 placeholder="Enter your city"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-white mb-2 block font-medium">State *</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 placeholder="Enter your state"
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="text-white mb-2 block font-medium">Address *</label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 rows="3"
//                 placeholder="Enter your full address"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-white mb-2 block font-medium">Pincode *</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 maxLength="6"
//                 className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 placeholder="Enter 6-digit pincode"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-white mb-2 block font-medium">Mobile Number</label>
//               <input
//                 type="tel"
//                 value={mobile || ''}
//                 className="w-full px-4 py-3 rounded-lg bg-white/50 text-gray-600 cursor-not-allowed"
//                 disabled
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-6 bg-white text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Registering...' : 'Complete Registration ⚡'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Register









// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { register } from '../store/slices/authSlice'

// const Register = () => {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     dispatch(register({
//       user: { name, email },
//       token: 'mock-token'
//     }))
//     navigate('/')
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-dark">Create Account</h2>
//           <p className="text-gray-600 mt-2">Join Reparo today</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-primary text-dark font-semibold py-2 rounded-lg hover:bg-primary/90 transition"
//           >
//             Register
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-primary hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Register