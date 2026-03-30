// src/components/home/ContactSection.jsx
import React, { useState } from 'react'
import axios from 'axios'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setError('')
    setSuccessMsg('')
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setError('❌ Please fill all fields')
      setTimeout(() => setError(''), 4000)
      return
    }
    
    if (formData.phone.length !== 10) {
      setError('❌ Please enter a valid 10-digit mobile number')
      setTimeout(() => setError(''), 4000)
      return
    }
    
    if (!formData.email.includes('@')) {
      setError('❌ Please enter a valid email address')
      setTimeout(() => setError(''), 4000)
      return
    }
    
    setLoading(true)
    
    try {
      const formBody = new URLSearchParams()
      formBody.append('name', formData.name)
      formBody.append('email', formData.email)
      formBody.append('phone', formData.phone)
      formBody.append('subject', formData.subject)
      formBody.append('message', formData.message)
      
      const response = await axios.post(
        'https://reparo24.com/web/api/contactus',
        formBody.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      )
      
      console.log('Response:', response.data)
      
      if (response.data.message === 'Thank you for contacting us!! We will get back to you soon.') {
        setSuccessMsg('✅ Message sent successfully! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        
        // Auto clear success message after 4 seconds
        setTimeout(() => setSuccessMsg(''), 4000)
      } else {
        setError('❌ ' + (response.data.message || 'Something went wrong. Please try again.'))
        setTimeout(() => setError(''), 4000)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      if (error.response) {
        setError('❌ ' + (error.response.data?.message || 'Server error. Please try again.'))
      } else if (error.request) {
        setError('❌ No response from server. Please check your connection.')
      } else {
        setError('❌ Network error. Please try again.')
      }
      setTimeout(() => setError(''), 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear messages when user starts typing
    if (error) setError('')
    if (successMsg) setSuccessMsg('')
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite] text-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 
              data-aos="fade-up" 
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Get In Touch ⚡
            </h2>
            <p 
              data-aos="fade-up" 
              data-aos-delay="100"
              className="text-white/90"
            >
              We're here to help you with EV services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT CONTACT INFO */}
            <div 
              data-aos="fade-right" 
              className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
                    📍
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Our Location</h6>
                    <p className="text-white/80">Gurugram, Haryana, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
                    📞
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Phone</h6>
                    <p className="text-white/80">+91 80191 60606</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
                    📧
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Email</h6>
                    <p className="text-white/80">manager@reparo.care</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
                    ⏰
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Working Hours</h6>
                    <p className="text-white/80">Mon - Sat | 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CONTACT FORM */}
            <div 
              data-aos="fade-left" 
              className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
                    placeholder="Email Address"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
                    placeholder="Phone"
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
                    placeholder="Subject"
                    required
                  />
                  <div className="md:col-span-2">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
                      rows="5"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>
                  
                  {/* ✅ Message Display - Just above the button */}
                  {error && (
                    <div className="md:col-span-2">
                      <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm text-center">
                        {error}
                      </div>
                    </div>
                  )}
                  
                  {successMsg && (
                    <div className="md:col-span-2">
                      <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg text-white text-sm text-center">
                        {successMsg}
                      </div>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-white via-[#d4f8e8] to-white bg-[length:300%_300%] animate-[gradientMove_6s_ease_infinite] text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:translate-y-[-4px] hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-[#0b86d0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        '⚡ Send Message'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal (Optional - Keep if you still want modal) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center transform animate-scale-up shadow-2xl">
            <div className="w-16 h-16 bg-[#00c853] text-white text-3xl rounded-full flex items-center justify-center mx-auto mb-4 animate-pop-scale">
              ✓
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Message Sent Successfully!
            </h4>
            <p className="text-gray-500 mb-6">
              Thank you for contacting Reparo. Our team will reach you shortly.
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pop-scale {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.3s ease-out; }
        .animate-pop-scale { animation: pop-scale 0.5s ease-out; }
      `}</style>
    </>
  )
}

export default ContactSection










// import React, { useState } from 'react'

// const ContactSection = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   })
//   const [showModal, setShowModal] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
    
//     // Simulate API call
//     setTimeout(() => {
//       setShowModal(true)
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         message: ''
//       })
//       setLoading(false)
//     }, 500)
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const closeModal = () => {
//     setShowModal(false)
//   }

//   return (
//     <>
//       <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite] text-white">
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="text-center mb-12">
//             <h2 
//               data-aos="fade-up" 
//               className="text-3xl md:text-4xl font-bold mb-2"
//             >
//               Get In Touch ⚡
//             </h2>
//             <p 
//               data-aos="fade-up" 
//               data-aos-delay="100"
//               className="text-white/90"
//             >
//               We're here to help you with EV services
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             {/* LEFT CONTACT INFO */}
//             <div 
//               data-aos="fade-right" 
//               className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
//             >
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                     📍
//                   </div>
//                   <div>
//                     <h6 className="font-semibold text-lg">Our Location</h6>
//                     <p className="text-white/80">Gurugram, Haryana, India</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                     📞
//                   </div>
//                   <div>
//                     <h6 className="font-semibold text-lg">Phone</h6>
//                     <p className="text-white/80">+91 80191 60606</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                     📧
//                   </div>
//                   <div>
//                     <h6 className="font-semibold text-lg">Email</h6>
//                     <p className="text-white/80">manager@reparo.care</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                     ⏰
//                   </div>
//                   <div>
//                     <h6 className="font-semibold text-lg">Working Hours</h6>
//                     <p className="text-white/80">Mon - Sat | 9:00 AM - 7:00 PM</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT CONTACT FORM */}
//             <div 
//               data-aos="fade-left" 
//               className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
//             >
//               <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                     placeholder="Your Name"
//                     required
//                   />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                     placeholder="Email Address"
//                     required
//                   />
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                     placeholder="Phone"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                     placeholder="Subject"
//                     required
//                   />
//                   <div className="md:col-span-2">
//                     <textarea
//                       name="message"
//                       value={formData.message}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                       rows="5"
//                       placeholder="Your Message"
//                       required
//                     ></textarea>
//                   </div>
//                   <div className="md:col-span-2">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="w-full bg-gradient-to-r from-white via-[#d4f8e8] to-white bg-[length:300%_300%] animate-[gradientMove_6s_ease_infinite] text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:translate-y-[-4px] hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
//                     >
//                       {loading ? 'Sending...' : '⚡ Send Message'}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Success Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center transform animate-scale-up shadow-2xl">
//             {/* Success Icon */}
//             <div className="success-icon w-16 h-16 bg-[#00c853] text-white text-3xl rounded-full flex items-center justify-center mx-auto mb-4 animate-pop-scale">
//               ✓
//             </div>
            
//             <h4 className="text-2xl font-bold text-gray-800 mb-2">
//               Message Sent Successfully!
//             </h4>
            
//             <p className="text-gray-500 mb-6">
//               Thank you for contacting Reparo. Our team will reach you shortly.
//             </p>
            
//             <button
//               onClick={closeModal}
//               className="w-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
        
//         @keyframes scale-up {
//           from {
//             transform: scale(0.9);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
        
//         @keyframes pop-scale {
//           0% {
//             transform: scale(0);
//           }
//           80% {
//             transform: scale(1.2);
//           }
//           100% {
//             transform: scale(1);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
        
//         .animate-scale-up {
//           animation: scale-up 0.3s ease-out;
//         }
        
//         .animate-pop-scale {
//           animation: pop-scale 0.5s ease-out;
//         }
//       `}</style>
//     </>
//   )
// }

// export default ContactSection





// import React, { useState } from 'react'

// const ContactSection = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     alert('Thank you for contacting Reparo! Our team will reach you shortly.')
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       subject: '',
//       message: ''
//     })
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   return (
//     <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite] text-white">
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="text-center mb-12">
//           <h2 
//             data-aos="fade-up" 
//             className="text-3xl md:text-4xl font-bold mb-2"
//           >
//             Get In Touch ⚡
//           </h2>
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="100"
//             className="text-white/90"
//           >
//             We're here to help you with EV services
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//           {/* LEFT CONTACT INFO */}
//           <div 
//             data-aos="fade-right" 
//             className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
//           >
//             <div className="space-y-6">
//               <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                   📍
//                 </div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Our Location</h6>
//                   <p className="text-white/80">Gurugram, Haryana, India</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                   📞
//                 </div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Phone</h6>
//                   <p className="text-white/80">+91 80191 60606</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                   📧
//                 </div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Email</h6>
//                   <p className="text-white/80">manager@reparo.care</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
//                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-[#0b86d0] group-hover:scale-110 transition">
//                   ⏰
//                 </div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Working Hours</h6>
//                   <p className="text-white/80">Mon - Sat | 9:00 AM - 7:00 PM</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT CONTACT FORM */}
//           <div 
//             data-aos="fade-left" 
//             className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-xl"
//           >
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                   placeholder="Your Name"
//                   required
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                   placeholder="Email Address"
//                   required
//                 />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                   placeholder="Phone"
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                   placeholder="Subject"
//                   required
//                 />
//                 <div className="md:col-span-2">
//                   <textarea
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-[#0b86d0] focus:outline-none focus:ring-2 focus:ring-[#0b86d0]/20 transition-all"
//                     rows="5"
//                     placeholder="Your Message"
//                     required
//                   ></textarea>
//                 </div>
//                 <div className="md:col-span-2">
//                   <button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-white via-[#d4f8e8] to-white bg-[length:300%_300%] animate-[gradientMove_6s_ease_infinite] text-[#0b86d0] font-bold py-3 rounded-lg transition-all hover:translate-y-[-4px] hover:shadow-lg cursor-pointer"
//                   >
//                     ⚡ Send Message
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ContactSection