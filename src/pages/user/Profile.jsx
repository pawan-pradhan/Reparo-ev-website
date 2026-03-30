// src/pages/user/Profile.jsx

// src/pages/user/Profile.jsx
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/user/Sidebar'
import { getUserProfile, updateUserProfile, updateProfileImage } from '../../services/api'

const Profile = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile_number: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    mediaUrl: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await getUserProfile()
      console.log('Profile Response:', response)
      
      setProfile({
        name: response.name || '',
        email: response.email || '',
        mobile_number: response.mobile_number || '',
        city: response.city || '',
        state: response.state || '',
        address: response.address || '',
        pincode: response.pincode || '',
        mediaUrl: response.mediaUrl || ''
      })
      
      // Set image preview if exists
      if (response.mediaUrl && response.mediaUrl !== 'undefineduploads/webusers/') {
        setImagePreview(response.mediaUrl)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setMessage({ type: 'error', text: 'Failed to load profile data' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return
    
    setUploading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await updateProfileImage(imageFile)
      console.log('Image Upload Response:', response)
      
      if (response.success || response.status === true) {
        setMessage({ type: 'success', text: 'Profile photo updated successfully!' })
        setImageFile(null)
        // Refresh profile data
        await fetchProfile()
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update photo' })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setMessage({ type: 'error', text: 'Failed to upload profile photo' })
    } finally {
      setUploading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        city: profile.city,
        state: profile.state,
        address: profile.address,
        pincode: profile.pincode
      }
      
      const response = await updateUserProfile(updateData)
      console.log('Update Response:', response)
      
      if (response.success || response.status === true) {
        setMessage({ type: 'success', text: response.message || 'Profile updated successfully!' })
        await fetchProfile() // Refresh data
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b86d0] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl text-gray-600"
          >
            ☰
          </button>
          <h4 className="font-semibold text-lg">Edit Profile 👤</h4>
        </div>

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-xl mb-6">Edit Profile</h4>

            {/* Message Alert */}
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
              <div className="relative">
                <img
                  src={imagePreview || profile.mediaUrl || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#0b86d0]"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100'
                  }}
                />
                <label className="absolute bottom-0 right-0 bg-[#0b86d0] text-white p-1 rounded-full cursor-pointer hover:bg-[#0b86d0]/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              {imageFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="mt-3 text-sm bg-[#0b86d0] text-white px-4 py-1 rounded-lg hover:bg-[#0b86d0]/90 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2">Click camera icon to change photo</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={profile.mobile_number}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0] focus:ring-1 focus:ring-[#0b86d0]"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile












// import React, { useState } from 'react'
// import Sidebar from '../../components/user/Sidebar'

// const Profile = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [profile, setProfile] = useState({
//     name: 'Yashvi Soni',
//     email: 'yashvisoni123@gmail.com',
//     mobile: '9460379517',
//     city: 'Jaipur',
//     state: 'Rajasthan',
//     address: 'Manglam City',
//     pincode: '302022'
//   })
//   const [message, setMessage] = useState('')

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setMessage('Profile updated successfully!')
//     setTimeout(() => setMessage(''), 3000)
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
//       <div className="flex-1">
//         <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="md:hidden text-2xl text-gray-600"
//           >
//             ☰
//           </button>
//           <h4 className="font-semibold text-lg">Edit Profile 👤</h4>
//         </div>

//         <div className="p-4 md:p-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto">
//             <h4 className="font-semibold text-xl mb-6">Edit Profile</h4>

//             {message && (
//               <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
//                 {message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={profile.name}
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Mobile</label>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={profile.mobile}
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={profile.email}
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">City</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={profile.city}
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">State</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={profile.state}
//                     onChange={handleChange}
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Pincode</label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={profile.pincode}
//                     onChange={handleChange}
//                     maxLength="6"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="text-sm text-gray-600 block mb-1">Address</label>
//                   <textarea
//                     name="address"
//                     value={profile.address}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <button
//                   type="submit"
//                   className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
//                 >
//                   Save Profile ⚡
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile









// import React, { useState, useEffect } from 'react'
// import Sidebar from '../../components/user/Sidebar'
// import { getUserProfile, updateUserProfile, updateProfileImage } from '../../services/api'

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     city: '',
//     state: '',
//     address: '',
//     pincode: '',
//     profile_image: ''
//   })
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [message, setMessage] = useState('')
//   const [imageFile, setImageFile] = useState(null)

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await getUserProfile()
//       setProfile(response.data || {})
//     } catch (error) {
//       console.error('Error fetching profile:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     setProfile({
//       ...profile,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setImageFile(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setProfile({ ...profile, profile_image: reader.result })
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleImageUpload = async () => {
//     if (!imageFile) return
//     try {
//       await updateProfileImage(imageFile)
//       setMessage('Profile photo updated successfully!')
//       setTimeout(() => setMessage(''), 3000)
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       setMessage('Failed to update profile photo')
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       await updateUserProfile(profile)
//       setMessage('Profile updated successfully!')
//       setTimeout(() => setMessage(''), 3000)
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       setMessage('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 md:ml-64 flex items-center justify-center">
//           <div className="text-center">Loading...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 md:ml-64">
//         <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
//           <h4 className="font-semibold text-lg">Edit Profile 👤</h4>
//         </div>

//         <div className="p-4">
//           <div className="bg-white p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
//             <h4 className="font-semibold mb-6 text-lg">Edit Profile 👤</h4>

//             {message && (
//               <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
//                 {message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div className="md:col-span-2">
//                   {/* Profile Image */}
//                   <div className="flex flex-col items-center mb-6">
//                     <img
//                       src={profile.profile_image || 'https://via.placeholder.com/100'}
//                       alt="Profile"
//                       className="w-24 h-24 rounded-full object-cover border-2 border-[#0b86d0]"
//                     />
//                     <div className="mt-2 flex gap-2">
//                       <label className="cursor-pointer text-[#0b86d0] text-sm hover:underline">
//                         Change Photo
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           className="hidden"
//                         />
//                       </label>
//                       {imageFile && (
//                         <button
//                           type="button"
//                           onClick={handleImageUpload}
//                           className="text-[#00c853] text-sm hover:underline"
//                         >
//                           Upload
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Form Fields */}
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">Full Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={profile.name}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">Mobile</label>
//                       <input
//                         type="tel"
//                         name="mobile"
//                         value={profile.mobile}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg p-2 bg-gray-50"
//                         disabled
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={profile.email}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">City</label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={profile.city}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">State</label>
//                       <input
//                         type="text"
//                         name="state"
//                         value={profile.state}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600 block mb-1">Pincode</label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={profile.pincode}
//                         onChange={handleChange}
//                         maxLength="6"
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="text-sm text-gray-600 block mb-1">Address</label>
//                       <textarea
//                         name="address"
//                         value={profile.address}
//                         onChange={handleChange}
//                         rows="3"
//                         className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0b86d0]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 text-center md:text-right">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {saving ? 'Saving...' : 'Save Profile ⚡'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile