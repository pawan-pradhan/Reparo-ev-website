// src/pages/Home.jsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/home/Hero'
import ServicesSection from '../components/home/ServicesSection'
import ProductsSection from '../components/home/ProductsSection'
import BrandsSection from '../components/home/BrandsSection'
import StatsSection from '../components/home/StatsSection'
import BookingProcess from '../components/home/BookingProcess'
import FAQSection from '../components/home/FAQSection'
import ContactSection from '../components/home/ContactSection'
import { useCart } from '../context/CartContext'

const Home = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [bookingLoading, setBookingLoading] = useState(null)

  const handleSearch = (location, service, results) => {
    setSelectedLocation(location)
    setSelectedService(service)
    setSearchResults(results)
    setShowResults(results.length > 0)
    
    setTimeout(() => {
      document.getElementById('resultsSection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const handleBookService = (service) => {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    setBookingLoading(service.id)
    
    // Add to frontend cart (no API call)
    addToCart({
      id: service.serviceId,
      serviceId: service.serviceId,
      name: service.name,
      price: service.offerPrice || service.originalPrice,
      originalPrice: service.originalPrice,
      quantity: 1,
      image: '/assets/products/shop.png',
      type: 'service'
    })
    
    setTimeout(() => {
      setBookingLoading(null)
      alert(`${service.name} added to cart!`)
      navigate('/cart')
    }, 500)
  }

  return (
    <div className="home-page">
      <Hero onSearch={handleSearch} />
      
      {/* Search Results Section */}
      {showResults && (
        <section id="resultsSection" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                Available Services
              </h2>
              <div className="w-20 h-1 gradient-animated mx-auto"></div>
              <p className="text-gray-600 mt-3">
                Showing services for selected location
              </p>
            </div>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
                <p className="text-gray-600">
                  No services available for the selected location and service type.
                  Please try different options.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item, index) => (
                  <div 
                    key={index} 
                    data-aos="fade-up" 
                    data-aos-delay={index * 100}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-bold text-xl mb-2 gradient-text">{item.name}</h5>
                        {item.offerPrice && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Save ₹{item.originalPrice - item.offerPrice}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-2">
                        📍 Available in {item.location}
                      </p>
                      
                      <p className="text-gray-600 mb-3 text-sm">
                        {item.desc}
                      </p>
                      
                      {item.features && item.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-1">Features:</p>
                          {item.features.map((feature, idx) => (
                            <p key={idx} className="text-xs text-gray-500">✓ {feature.title}</p>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-primary">
                          {item.price}
                        </span>
                        {item.originalPrice && item.offerPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleBookService(item)}
                        disabled={bookingLoading === item.id}
                        className="w-full gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                      >
                        {bookingLoading === item.id ? 'Adding...' : '⚡ Book This Service'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Rest of the sections */}
      <ServicesSection />
      <ProductsSection />
      <BrandsSection />
      <StatsSection />
      <BookingProcess />
      <FAQSection />
      <ContactSection />
    </div>
  )
}

export default Home


// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import Hero from '../components/home/Hero'
// import ServicesSection from '../components/home/ServicesSection'
// import ProductsSection from '../components/home/ProductsSection'
// import BrandsSection from '../components/home/BrandsSection'
// import StatsSection from '../components/home/StatsSection'
// import BookingProcess from '../components/home/BookingProcess'
// import FAQSection from '../components/home/FAQSection'
// import ContactSection from '../components/home/ContactSection'
// import { addToCartAPI } from '../services/api'
// import { addToCart } from '../store/slices/cartSlice'

// const Home = () => {
//   const [showResults, setShowResults] = useState(false)
//   const [searchResults, setSearchResults] = useState([])
//   const [selectedLocation, setSelectedLocation] = useState('')
//   const [selectedService, setSelectedService] = useState('')
//   const [bookingLoading, setBookingLoading] = useState(null)
//   const dispatch = useDispatch()

//   const handleSearch = (location, service, results) => {
//     // Get selected location and category names
//     setSelectedLocation(location)
//     setSelectedService(service)
//     setSearchResults(results)
//     setShowResults(results.length > 0)
    
//     // Scroll to results
//     setTimeout(() => {
//       document.getElementById('resultsSection')?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//     }, 100)
//   }

//   const handleBookService = async (service) => {
//     const isAuthenticated = localStorage.getItem('token')
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       window.location.href = '/login'
//       return
//     }
    
//     setBookingLoading(service.id)
    
//     try {
//       const response = await addToCartAPI(service.serviceId, 1)
      
//       if (response.success) {
//         dispatch(addToCart({
//           id: service.serviceId,
//           name: service.name,
//           price: service.offerPrice || service.originalPrice,
//           quantity: 1,
//           image: '/assets/products/shop.png'
//         }))
//         alert(`${service.name} booked successfully!`)
//       } else {
//         alert(response.message || 'Failed to book service')
//       }
//     } catch (error) {
//       console.error('Booking error:', error)
//       alert('Failed to book service. Please try again.')
//     } finally {
//       setBookingLoading(null)
//     }
//   }

//   return (
//     <div className="home-page">
//       <Hero onSearch={handleSearch} />
      
//       {/* Search Results Section */}
//       {showResults && (
//         <section id="resultsSection" className="py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
//                 Available Services
//               </h2>
//               <div className="w-20 h-1 gradient-animated mx-auto"></div>
//               <p className="text-gray-600 mt-3">
//                 Showing services for selected location
//               </p>
//             </div>
            
//             {searchResults.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
//                 <p className="text-gray-600">
//                   No services available for the selected location and service type.
//                   Please try different options.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {searchResults.map((item, index) => (
//                   <div 
//                     key={index} 
//                     data-aos="fade-up" 
//                     data-aos-delay={index * 100}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//                   >
//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-3">
//                         <h5 className="font-bold text-xl mb-2 gradient-text">{item.name}</h5>
//                         {item.offerPrice && (
//                           <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                             Save ₹{item.originalPrice - item.offerPrice}
//                           </span>
//                         )}
//                       </div>
                      
//                       <p className="text-gray-500 text-sm mb-2">
//                         📍 Available in {item.location}
//                       </p>
                      
//                       <p className="text-gray-600 mb-3 text-sm">
//                         {item.desc}
//                       </p>
                      
//                       {item.features && item.features.length > 0 && (
//                         <div className="mb-3">
//                           <p className="text-xs text-gray-400 mb-1">Features:</p>
//                           {item.features.map((feature, idx) => (
//                             <p key={idx} className="text-xs text-gray-500">✓ {feature.title}</p>
//                           ))}
//                         </div>
//                       )}
                      
//                       <div className="flex items-center gap-2 mb-3">
//                         <span className="text-2xl font-bold text-primary">
//                           {item.price}
//                         </span>
//                         {item.originalPrice && item.offerPrice && (
//                           <span className="text-gray-400 line-through text-sm">
//                             ₹{item.originalPrice}
//                           </span>
//                         )}
//                       </div>
                      
//                       <button 
//                         onClick={() => handleBookService(item)}
//                         disabled={bookingLoading === item.id}
//                         className="w-full gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
//                       >
//                         {bookingLoading === item.id ? 'Booking...' : '⚡ Book This Service'}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       )}
      
//       {/* Rest of the sections */}
//       <ServicesSection />
//       <ProductsSection />
//       <BrandsSection />
//       <StatsSection />
//       <BookingProcess />
//       {/* FAQ Section */}
//       <FAQSection />
//       <ContactSection />
//     </div>
//   )
// }

// export default Home











// import React, { useState } from 'react'
// import Hero from '../components/home/Hero'
// import ServicesSection from '../components/home/ServicesSection'
// import ProductsSection from '../components/home/ProductsSection'
// import BrandsSection from '../components/home/BrandsSection'
// import StatsSection from '../components/home/StatsSection'
// import BookingProcess from '../components/home/BookingProcess'
// import ContactSection from '../components/home/ContactSection'

// const Home = () => {
//   const [showResults, setShowResults] = useState(false)
//   const [searchResults, setSearchResults] = useState([])
//   const [selectedLocation, setSelectedLocation] = useState('')
//   const [selectedService, setSelectedService] = useState('')

//   // This function will be passed to Hero component
//   const handleSearch = (location, service, results) => {
//     setSelectedLocation(location)
//     setSelectedService(service)
//     setSearchResults(results)
//     setShowResults(true)
    
//     // Scroll to results
//     setTimeout(() => {
//       document.getElementById('resultsSection')?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//     }, 100)
//   }

//   return (
//     <div className="home-page">
//       {/* Hero Section with Search */}
//       <Hero onSearch={handleSearch} />
      
//       {/* Search Results Section */}
//       {showResults && (
//         <section id="resultsSection" className="py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
//                 Available Services in {selectedLocation.data[0].city_id[0].name}
//               </h2>
//               <div className="w-20 h-1 gradient-animated mx-auto"></div>
//               <p className="text-gray-600 mt-3">Showing results for: {selectedService}</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {searchResults.map((item, index) => (
//                 <div 
//                   key={index} 
//                   data-aos="fade-up" 
//                   data-aos-delay={index * 100}
//                   className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//                 >
//                   <h5 className="font-bold text-xl mb-2 gradient-text">{item.name}</h5>
//                   <p className="text-gray-500 text-sm mb-2">📍 Available in {item.location}</p>
//                   <p className="text-gray-600 mb-3">{item.desc}</p>
//                   <div className="service-price text-2xl font-bold text-primary mb-3">
//                     {item.price}
//                   </div>
//                   {/* <button 
//                     onClick={() => {
//                       const isAuthenticated = localStorage.getItem('token')
//                       if (!isAuthenticated) {
//                         window.location.href = '/login'
//                         return
//                       }
//                       alert('Booking feature coming soon!')
//                     }}
//                     className="w-full gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
//                   >
//                     ⚡ Book This Service
//                   </button> */}

//                   {/* // Update the search results section in Home.jsx */}
//                   <button 
//                     onClick={async () => {
//                       const isAuthenticated = localStorage.getItem('token')
//                       if (!isAuthenticated) {
//                         sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//                         window.location.href = '/login'
//                         return
//                       }
                      
//                       try {
//                         const { addToCartAPI } = await import('../services/api')
//                         const { addToCart } = await import('../store/slices/cartSlice')
//                         const response = await addToCartAPI(item.serviceId, 1)
                        
//                         if (response.success) {
//                           dispatch(addToCart({
//                             id: item.serviceId,
//                             name: item.name,
//                             price: item.originalPrice,
//                             quantity: 1
//                           }))
//                           alert('Service booked successfully!')
//                         }
//                       } catch (error) {
//                         alert('Failed to book service')
//                       }
//                     }}
//                     className="w-full gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
//                   >
//                     ⚡ Book This Service
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
      
//       {/* Services Section */}
//       <ServicesSection />
      
//       {/* Products Section */}
//       <ProductsSection />
      
//       {/* Brands Section */}
//       <BrandsSection />
      
//       {/* Stats Section */}
//       <StatsSection />
      
//       {/* Booking Process Section */}
//       <BookingProcess />
      
//       {/* Contact Section */}
//       <ContactSection />
//     </div>
//   )
// }

// export default Home









// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import ProductCard from '../components/common/ProductCard'

// const Home = () => {
//   const [location, setLocation] = useState('')
//   const [service, setService] = useState('')
//   const [showResults, setShowResults] = useState(false)
//   const [searchResults, setSearchResults] = useState([])
//   const { isAuthenticated } = useSelector((state) => state.auth)

//   const locations = [
//     'Ahmedabad', 'Bengaluru', 'Chennai', 'Delhi', 'Ghaziabad', 'Goa',
//     'Gurugram', 'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 'Noida', 
//     'Pune', 'Surat', 'Thane'
//   ]

//   const servicesList = [
//     'General Service', 'Battery Repair', 'Motor Repair', 'Controller Repair', 'Spare Parts'
//   ]

//   const services = [
//     {
//       icon: 'bi-tools',
//       title: 'General Service',
//       description: 'Complete EV inspection & performance optimization'
//     },
//     {
//       icon: 'bi-battery-charging',
//       title: 'Battery Repair',
//       description: 'BMS repair, battery diagnostics & replacement'
//     },
//     {
//       icon: 'bi-lightning-charge',
//       title: 'Motor Repair',
//       description: 'Motor rewinding & controller troubleshooting'
//     },
//     {
//       icon: 'bi-cart',
//       title: 'Spare Parts',
//       description: 'Genuine EV parts & certified accessories'
//     }
//   ]

//   const products = [
//     { id: 1, name: 'Battery Repair', price: 1499, oldPrice: 2499, image: '/assets/products/shop.png' },
//     { id: 2, name: 'Motor Repair', price: 1299, oldPrice: 1999, image: '/assets/products/shop.png' },
//     { id: 3, name: 'Controller Repair', price: 999, oldPrice: 1499, image: '/assets/products/shop.png' },
//     { id: 4, name: 'Charger Repair', price: 799, oldPrice: 1299, image: '/assets/products/shop.png' },
//     { id: 5, name: 'BMS Repair', price: 899, oldPrice: 1499, image: '/assets/products/shop.png' },
//     { id: 6, name: 'Wiring Harness', price: 599, oldPrice: 999, image: '/assets/products/shop.png' }
//   ]

//   const brands = [
//     { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
//     { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
//     { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
//     { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
//     { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' }
//   ]

//   const processSteps = [
//     { step: 1, icon: '📍', title: 'Select Location', desc: 'Choose your city & EV service requirement.' },
//     { step: 2, icon: '🛵', title: 'Select Service', desc: 'Pick battery, motor, or general EV service.' },
//     { step: 3, icon: '📅', title: 'Schedule', desc: 'Choose convenient date & time slot.' },
//     { step: 4, icon: '⚡', title: 'Service Delivered', desc: 'Technician arrives & completes service.' }
//   ]

//   const handleSearch = () => {
//     if (!location || !service) {
//       alert('Please select both Location and Service.')
//       return
//     }

//     const results = [
//       {
//         name: `${service} - Basic Package`,
//         price: '₹999',
//         desc: 'Essential checkup & standard maintenance.',
//         location: location
//       },
//       {
//         name: `${service} - Standard Package`,
//         price: '₹1499',
//         desc: 'Advanced inspection with performance tuning.',
//         location: location
//       },
//       {
//         name: `${service} - Premium Package`,
//         price: '₹1999',
//         desc: 'Complete EV diagnostics & priority support.',
//         location: location
//       }
//     ]

//     setSearchResults(results)
//     setShowResults(true)

//     setTimeout(() => {
//       document.getElementById('resultsSection')?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//     }, 100)
//   }

//   // Counter animation
//   useEffect(() => {
//     const counters = document.querySelectorAll('.stat-counter')
//     const speed = 200

//     const animateCounters = () => {
//       counters.forEach(counter => {
//         const updateCount = () => {
//           const target = parseInt(counter.getAttribute('data-target'))
//           const count = parseInt(counter.innerText)
//           const increment = target / speed

//           if (count < target) {
//             counter.innerText = Math.ceil(count + increment)
//             setTimeout(updateCount, 10)
//           } else {
//             counter.innerText = target.toLocaleString() + '+'
//           }
//         }
//         updateCount()
//       })
//     }

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         animateCounters()
//         observer.disconnect()
//       }
//     })

//     const statsSection = document.querySelector('#stats-section')
//     if (statsSection) {
//       observer.observe(statsSection)
//     }

//     return () => observer.disconnect()
//   }, [])

//   return (
//     <div className="home-page">
//       {/* ================= HERO SECTION ================= */}
//       <section className="hero-section min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 gradient-text">
//             Reparo – Powering EV Care ⚡
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 mt-3">
//             Battery • Motor • Controller • Spare Parts • Doorstep Repair
//           </p>

//           <div className="search-box mt-10 max-w-4xl mx-auto">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-2xl shadow-2xl p-6">
//               <select
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
//               >
//                 <option value="">Select Location</option>
//                 {locations.map((loc) => (
//                   <option key={loc} value={loc}>{loc}</option>
//                 ))}
//               </select>

//               <select
//                 value={service}
//                 onChange={(e) => setService(e.target.value)}
//                 className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
//               >
//                 <option value="">Select Service</option>
//                 {servicesList.map((serv) => (
//                   <option key={serv} value={serv}>{serv}</option>
//                 ))}
//               </select>

//               <button
//                 onClick={handleSearch}
//                 className="gradient-animated text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
//               >
//                 <span>Search Now</span>
//                 <span>🔍</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= RESULTS SECTION ================= */}
//       {showResults && (
//         <section id="resultsSection" className="py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl md:text-4xl font-bold mb-2">Available Services</h2>
//               <div className="w-20 h-1 gradient-animated mx-auto"></div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {searchResults.map((item, index) => (
//                 <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//                   <h5 className="font-bold text-xl mb-2 gradient-text">{item.name}</h5>
//                   <p className="text-gray-500 text-sm mb-2">📍 Available in {item.location}</p>
//                   <p className="text-gray-600 mb-3">{item.desc}</p>
//                   <div className="text-2xl font-bold text-primary mb-3">{item.price}</div>
//                   <button 
//                     onClick={() => {
//                       if (!isAuthenticated) {
//                         window.location.href = '/login'
//                         return
//                       }
//                       alert('Booking feature coming soon!')
//                     }}
//                     className="w-full gradient-animated text-white py-2 rounded-lg font-semibold"
//                   >
//                     ⚡ Book This Service
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ================= SERVICES SECTION ================= */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Our EV Services</h2>
//             <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {services.map((service, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition hover:-translate-y-1">
//                 <div className="w-20 h-20 mx-auto rounded-full gradient-animated flex items-center justify-center text-white text-3xl mb-4">
//                   <i className={`bi ${service.icon}`}></i>
//                 </div>
//                 <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
//                 <p className="text-gray-500 text-sm mb-4">{service.description}</p>
//                 <button className="text-primary font-semibold inline-flex items-center gap-1">
//                   ⚡ Explore <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= PRODUCTS SECTION ================= */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold">
//               <Link to="/shop" className="gradient-text hover:opacity-80">
//                 Our EV Products ⚡
//               </Link>
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= BRANDS SECTION ================= */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular EV Brands</h2>
//             <p className="text-gray-600">Certified & Supported by Reparo</p>
//           </div>
//           <div className="flex flex-wrap justify-center gap-8">
//             {brands.map((brand, index) => (
//               <div key={index} className="w-32 md:w-40 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition">
//                 <img src={brand.logo} alt={brand.name} className="w-full h-auto object-contain" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= STATS SECTION ================= */}
//       <section id="stats-section" className="py-16 gradient-animated text-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
//               <div className="text-4xl mb-3">⚡</div>
//               <h2 className="stat-counter text-3xl md:text-4xl font-bold mb-2" data-target="10000">0</h2>
//               <p>Services Completed</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
//               <div className="text-4xl mb-3">👨‍🔧</div>
//               <h2 className="stat-counter text-3xl md:text-4xl font-bold mb-2" data-target="500">0</h2>
//               <p>Verified Technicians</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
//               <div className="text-4xl mb-3">🌍</div>
//               <h2 className="stat-counter text-3xl md:text-4xl font-bold mb-2" data-target="50">0</h2>
//               <p>Cities Covered</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
//               <div className="text-4xl mb-3">⭐</div>
//               <h2 className="text-3xl md:text-4xl font-bold mb-2">4.8</h2>
//               <p>Average Rating</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= BOOKING PROCESS SECTION ================= */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">How to Book with Reparo ⚡</h2>
//             <p className="text-gray-600">Simple, Fast & Smart EV Service Booking</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {processSteps.map((step, index) => (
//               <div key={index} className="relative bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition">
//                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 gradient-animated text-white rounded-full flex items-center justify-center font-bold">
//                   {step.step}
//                 </div>
//                 <div className="text-4xl mt-4 mb-3">{step.icon}</div>
//                 <h5 className="text-xl font-semibold mb-2">{step.title}</h5>
//                 <p className="text-gray-500 text-sm">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= CONTACT SECTION ================= */}
//       <section className="py-16 gradient-animated text-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Get In Touch ⚡</h2>
//             <p className="text-white/90">We're here to help you with EV services</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             <div className="space-y-6">
//               <div className="flex items-start gap-4">
//                 <div className="text-2xl">📍</div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Our Location</h6>
//                   <p className="text-white/80">Gurugram, Haryana, India</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-2xl">📞</div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Phone</h6>
//                   <p className="text-white/80">+91 80191 60606</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-2xl">📧</div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Email</h6>
//                   <p className="text-white/80">manager@reparo.care</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="text-2xl">⏰</div>
//                 <div>
//                   <h6 className="font-semibold text-lg">Working Hours</h6>
//                   <p className="text-white/80">Mon - Sat | 9:00 AM - 7:00 PM</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-8 shadow-xl">
//               <form onSubmit={(e) => {
//                 e.preventDefault()
//                 alert('Message sent successfully!')
//               }}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none" placeholder="Your Name" required />
//                   <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none" placeholder="Email Address" required />
//                   <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none" placeholder="Phone" required />
//                   <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none" placeholder="Subject" required />
//                   <div className="md:col-span-2">
//                     <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none" rows="5" placeholder="Your Message" required></textarea>
//                   </div>
//                   <div className="md:col-span-2">
//                     <button type="submit" className="w-full gradient-animated text-white py-3 rounded-lg font-semibold">
//                       ⚡ Send Message
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Home









// import React from 'react'

// const Home = () => {
//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-yellow-50">
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
//             Reparo – Powering EV Care ⚡
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 mb-10">
//             Battery • Motor • Controller • Spare Parts • Doorstep Repair
//           </p>

//           {/* Search Box */}
//           <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <select className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none">
//                 <option>Select Location</option>
//                 <option>Ahmedabad</option>
//                 <option>Mumbai</option>
//                 <option>Delhi</option>
//               </select>

//               <select className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none">
//                 <option>Select Service</option>
//                 <option>General Service</option>
//                 <option>Battery Repair</option>
//                 <option>Motor Repair</option>
//               </select>

//               <button className="bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-primary/90 transition">
//                 Search Now 🔍
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-3">Our EV Services</h2>
//             <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((item) => (
//               <div key={item} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
//                 <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl mb-4">
//                   ⚡
//                 </div>
//                 <h5 className="text-xl font-semibold mb-2">Service {item}</h5>
//                 <p className="text-gray-500 text-sm">Service description here</p>
//                 <button className="mt-4 text-primary font-semibold">Explore →</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Home