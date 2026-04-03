// src/pages/Services.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCart } from '../context/CartContext'
import { getAllServices } from '../services/api'
import BrandsSection from '../components/home/BrandsSection'

const Services = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { addToCart } = useCart()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Static service categories - Explore button no action
  const staticCategories = [
    {
      id: 1,
      icon: 'bi-tools',
      title: 'General Service',
      description: 'Complete EV inspection & performance optimization'
    },
    {
      id: 2,
      icon: 'bi-battery-charging',
      title: 'Battery Repair',
      description: 'BMS repair, battery diagnostics & replacement'
    },
    {
      id: 3,
      icon: 'bi-lightning-charge',
      title: 'Motor Repair',
      description: 'Motor rewinding & controller troubleshooting'
    },
    {
      id: 4,
      icon: 'bi-cart',
      title: 'Spare Parts',
      description: 'Genuine EV parts & certified accessories'
    }
  ]

  const brands = [
    { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
    { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
    { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
    { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
    { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' },
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await getAllServices()
      console.log('All Services Response:', response)
      
      if (response.success && response.data && response.data.length > 0) {
        const formattedServices = response.data.map(service => ({
          id: service._id,
          serviceId: service._id,
          title: service.title,
          price: service.offer_price || service.price,
          originalPrice: service.price,
          description: service.features?.[0]?.title || 'Professional EV service',
          features: service.features || [],
          icon: getIconForService(service.title),
          category: service.servicecategory_id?.name || 'Service',
          image: service.image || '/assets/products/shop.png'
        }))
        setServices(formattedServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconForService = (title) => {
    const titleLower = title?.toLowerCase() || ''
    if (titleLower.includes('battery')) return 'bi-battery-charging'
    if (titleLower.includes('motor')) return 'bi-lightning-charge'
    if (titleLower.includes('general') || titleLower.includes('service')) return 'bi-tools'
    if (titleLower.includes('spare') || titleLower.includes('part')) return 'bi-cart'
    return 'bi-gear'
  }

  const handleBookNow = (service) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    addToCart({
      id: service.serviceId,
      serviceId: service.serviceId,
      name: service.title,
      price: service.price,
      originalPrice: service.originalPrice,
      quantity: 1,
      image: service.image,
      type: 'service'
    })
    
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= STATIC SERVICES CATEGORIES SECTION ================= */}
      <section className="services-urban py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Our EV Services
            </h2>
            <p className="text-gray-500">
              Smart EV solutions powered by Reparo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticCategories.map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-3xl mb-4">
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                {/* Static Explore button - No action */}
                <button className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white font-semibold py-2 px-5 rounded-lg inline-flex items-center gap-1 opacity-70 cursor-default">
                  ⚡ Explore
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALL SERVICES LIST (MIDDLE SECTION) ================= */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
                All Services
              </h2>
              <p className="text-gray-500">
                Choose from our complete range of EV services
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-xl">
                      <i className={`bi ${service.icon}`}></i>
                    </div>
                    <Link to={`/service/${service.serviceId}`} className="flex-1">
                      <h5 className="text-lg font-semibold hover:text-primary transition-colors">
                        {service.title}
                      </h5>
                    </Link>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">Starting from ₹{service.price}</p>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{service.description}</p>
                  {/* <button
                    onClick={() => handleBookNow(service)}
                    className="w-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    ⚡ Book Now
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= BRANDS SECTION ================= */}
      {/* <section className="brands-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Popular EV Brands
            </h2>
            <p className="text-gray-500">
              Certified & Supported by Reparo
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 w-32 md:w-40"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <BrandsSection/>

    </div>
  )
}

export default Services

// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useCart } from '../context/CartContext'
// import { getAllServices } from '../services/api'

// const Services = () => {
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useCart()
//   const [services, setServices] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Static service categories - Explore button no action
//   const staticCategories = [
//     {
//       id: 1,
//       icon: 'bi-tools',
//       title: 'General Service',
//       description: 'Complete EV inspection & performance optimization'
//     },
//     {
//       id: 2,
//       icon: 'bi-battery-charging',
//       title: 'Battery Repair',
//       description: 'BMS repair, battery diagnostics & replacement'
//     },
//     {
//       id: 3,
//       icon: 'bi-lightning-charge',
//       title: 'Motor Repair',
//       description: 'Motor rewinding & controller troubleshooting'
//     },
//     {
//       id: 4,
//       icon: 'bi-cart',
//       title: 'Spare Parts',
//       description: 'Genuine EV parts & certified accessories'
//     }
//   ]

//   const brands = [
//     { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
//     { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
//     { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
//     { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
//     { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' },
//   ]

//   useEffect(() => {
//     fetchServices()
//   }, [])

//   const fetchServices = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServices()
//       console.log('All Services Response:', response)
      
//       if (response.success && response.data && response.data.length > 0) {
//         const formattedServices = response.data.map(service => ({
//           id: service._id,
//           serviceId: service._id,
//           title: service.title,
//           price: service.offer_price || service.price,
//           originalPrice: service.price,
//           description: service.features?.[0]?.title || 'Professional EV service',
//           features: service.features || [],
//           icon: getIconForService(service.title),
//           category: service.servicecategory_id?.name || 'Service'
//         }))
//         setServices(formattedServices)
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getIconForService = (title) => {
//     const titleLower = title?.toLowerCase() || ''
//     if (titleLower.includes('battery')) return 'bi-battery-charging'
//     if (titleLower.includes('motor')) return 'bi-lightning-charge'
//     if (titleLower.includes('general') || titleLower.includes('service')) return 'bi-tools'
//     if (titleLower.includes('spare') || titleLower.includes('part')) return 'bi-cart'
//     return 'bi-gear'
//   }

//   const handleBookNow = (service) => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     addToCart({
//       id: service.serviceId,
//       serviceId: service.serviceId,
//       name: service.title,
//       price: service.price,
//       originalPrice: service.originalPrice,
//       quantity: 1,
//       image: '/assets/products/shop.png',
//       type: 'service'
//     })
    
//     navigate('/cart')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-20 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading services...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= STATIC SERVICES CATEGORIES SECTION ================= */}
//       <section className="services-urban py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">
//               Our EV Services
//             </h2>
//             <p className="text-gray-500">
//               Smart EV solutions powered by Reparo
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {staticCategories.map((service, index) => (
//               <div
//                 key={service.id}
//                 className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-3xl mb-4">
//                   <i className={`bi ${service.icon}`}></i>
//                 </div>
//                 <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
//                 <p className="text-gray-500 text-sm mb-4">{service.description}</p>
//                 {/* Static Explore button - No action */}
//                 <button className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white font-semibold py-2 px-5 rounded-lg inline-flex items-center gap-1 opacity-70 cursor-default">
//                   ⚡ Explore
//                   <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= ALL SERVICES LIST (MIDDLE SECTION) ================= */}
//       {services.length > 0 && (
//         <section className="py-16 bg-white">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <h2 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
//                 All Services
//               </h2>
//               <p className="text-gray-500">
//                 Choose from our complete range of EV services
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {services.map((service) => (
//                 <div
//                   key={service.id}
//                   className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-xl">
//                       <i className={`bi ${service.icon}`}></i>
//                     </div>
//                     <h5 className="text-lg font-semibold">{service.title}</h5>
//                   </div>
//                   <p className="text-gray-500 text-sm mb-2">Starting from ₹{service.price}</p>
//                   <p className="text-gray-400 text-xs mb-4 line-clamp-2">{service.description}</p>
//                   <button
//                     onClick={() => handleBookNow(service)}
//                     className="w-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
//                   >
//                     ⚡ Book Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ================= BRANDS SECTION ================= */}
//       <section className="brands-section py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">
//               Popular EV Brands
//             </h2>
//             <p className="text-gray-500">
//               Certified & Supported by Reparo
//             </p>
//           </div>

//           <div className="flex flex-wrap justify-center gap-8">
//             {brands.map((brand, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 w-32 md:w-40"
//               >
//                 <img 
//                   src={brand.logo} 
//                   alt={brand.name}
//                   className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Services






// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useCart } from '../context/CartContext'
// import { getAllServices, getAllServiceCategories } from '../services/api'

// const Services = () => {
//   const [categories, setCategories] = useState([])
//   const [services, setServices] = useState([])
//   const [filteredServices, setFilteredServices] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [servicesLoading, setServicesLoading] = useState(false)
//   const navigate = useNavigate()
//   const { addToCart } = useCart()

//   useEffect(() => {
//     fetchCategoriesAndServices()
//   }, [])

//   const fetchCategoriesAndServices = async () => {
//     try {
//       setLoading(true)
//       const [categoriesRes, servicesRes] = await Promise.all([
//         getAllServiceCategories(),
//         getAllServices()
//       ])
      
//       console.log('Categories Response:', categoriesRes)
//       console.log('Services Response:', servicesRes)
      
//       if (categoriesRes.success && categoriesRes.data) {
//         setCategories(categoriesRes.data)
//       }
      
//       if (servicesRes.success && servicesRes.data) {
//         setServices(servicesRes.data)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category)
//     setServicesLoading(true)
    
//     // Filter services based on selected category
//     setTimeout(() => {
//       const filtered = services.filter(service => 
//         service.servicecategory_id?._id === category._id ||
//         service.servicecategory_id === category._id
//       )
//       setFilteredServices(filtered)
//       setServicesLoading(false)
//     }, 300)
//   }

//   const getIconForService = (title) => {
//     const titleLower = title?.toLowerCase() || ''
//     if (titleLower.includes('battery')) return 'bi-battery-charging'
//     if (titleLower.includes('motor')) return 'bi-lightning-charge'
//     if (titleLower.includes('general') || titleLower.includes('service')) return 'bi-tools'
//     if (titleLower.includes('spare') || titleLower.includes('part')) return 'bi-cart'
//     return 'bi-gear'
//   }

//   const getCategoryIcon = (name) => {
//     const nameLower = name?.toLowerCase() || ''
//     if (nameLower.includes('battery')) return 'bi-battery-charging'
//     if (nameLower.includes('motor')) return 'bi-lightning-charge'
//     if (nameLower.includes('general')) return 'bi-tools'
//     if (nameLower.includes('spare') || nameLower.includes('part')) return 'bi-cart'
//     return 'bi-gear'
//   }

//   const handleExplore = (service) => {
//     addToCart({
//       id: service._id,
//       serviceId: service._id,
//       name: service.title,
//       price: service.offer_price || service.price,
//       originalPrice: service.price,
//       quantity: 1,
//       image: service.image || '/assets/products/shop.png'
//     })
//     navigate('/cart')
//   }

//   const brands = [
//     { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
//     { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
//     { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
//     { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
//     { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' },
//   ]

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Hero Section Skeleton */}
//         <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
//           <div className="container mx-auto px-4 text-center">
//             <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
//             <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
//           </div>
//         </section>

//         {/* Categories Skeleton */}
//         <section className="py-8">
//           <div className="container mx-auto px-4">
//             <div className="flex flex-wrap justify-center gap-4">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="w-40 h-24 bg-gray-200 rounded-xl animate-pulse"></div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Services Skeleton */}
//         <section className="services-urban py-8">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center animate-pulse">
//                   <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
//                   <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
//             Our EV Services ⚡
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Professional EV repair and maintenance services at your doorstep
//           </p>
//         </div>
//       </section>

//       {/* ================= SERVICE CATEGORIES SECTION ================= */}
//       <section className="py-8">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-bold mb-2">
//               Choose Service Category
//             </h2>
//             <p className="text-gray-500">
//               Select a category to view available services
//             </p>
//           </div>

//           <div className="flex flex-wrap justify-center gap-4">
//             {categories.map((category) => (
//               <button
//                 key={category._id}
//                 onClick={() => handleCategorySelect(category)}
//                 className={`
//                   flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300
//                   ${selectedCategory?._id === category._id 
//                     ? 'bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white shadow-lg scale-105' 
//                     : 'bg-white text-gray-700 hover:shadow-md hover:scale-105 border border-gray-200'
//                   }
//                 `}
//               >
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
//                   selectedCategory?._id === category._id 
//                     ? 'bg-white/20 text-white' 
//                     : 'bg-gradient-to-r from-[#0b86d0] to-[#00c853] bg-opacity-10 text-[#0b86d0]'
//                 }`}>
//                   <i className={`bi ${getCategoryIcon(category.name)}`}></i>
//                 </div>
//                 <span className="font-medium text-sm">{category.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= SERVICES SECTION ================= */}
//       <section className="services-urban py-8 pb-16">
//         <div className="container mx-auto px-4">
//           {selectedCategory ? (
//             <>
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl md:text-3xl font-bold mb-2">
//                   {selectedCategory.name}
//                 </h2>
//                 <p className="text-gray-500">
//                   Available services under {selectedCategory.name}
//                 </p>
//               </div>

//               {servicesLoading ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center animate-pulse">
//                       <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
//                       <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                       <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
//                       <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
//                       <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredServices.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredServices.map((service, index) => (
//                     <div
//                       key={service._id}
//                       data-aos="fade-up"
//                       data-aos-delay={index * 100}
//                       className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//                     >
//                       <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-3xl mb-4">
//                         <i className={`bi ${getIconForService(service.title)}`}></i>
//                       </div>
//                       <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
//                       <p className="text-gray-500 text-sm mb-2">
//                         Starting from ₹{service.offer_price || service.price}
//                       </p>
//                       <p className="text-gray-400 text-xs mb-4">
//                         {service.features?.[0]?.title || 'Professional EV service'}
//                       </p>
//                       <button
//                         onClick={() => handleExplore(service)}
//                         className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white font-semibold py-2 px-5 rounded-lg inline-flex items-center gap-1 hover:opacity-90 transition"
//                       >
//                         ⚡ Book Now
//                         <i className="bi bi-arrow-right"></i>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4">🔧</div>
//                   <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
//                   <p className="text-gray-500">
//                     No services available in this category yet.
//                   </p>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">🔌</div>
//               <h3 className="text-xl font-semibold mb-2">Select a Category</h3>
//               <p className="text-gray-500">
//                 Please select a service category to view available services.
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ================= BRANDS SECTION ================= */}
//       <section className="brands-section py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2 brands-heading">
//               Popular EV Brands
//             </h2>
//             <p className="text-gray-500">
//               Certified & Supported by Reparo
//             </p>
//           </div>

//           <div className="flex flex-wrap justify-center gap-8">
//             {brands.map((brand, index) => (
//               <div
//                 key={index}
//                 data-aos="fade-up"
//                 data-aos-delay={index * 100}
//                 className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 w-32 md:w-40"
//               >
//                 <img 
//                   src={brand.logo} 
//                   alt={brand.name}
//                   className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Services






// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useCart } from '../context/CartContext'
// import { getAllServices } from '../services/api'

// const Services = () => {
//   const [services, setServices] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()
//   const { addToCart } = useCart()

//   useEffect(() => {
//     fetchServices()
//   }, [])

//   const fetchServices = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServices()
//       console.log('Services API Response:', response)
      
//       if (response.success && response.data && response.data.length > 0) {
//         setServices(response.data)
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getIconForService = (title) => {
//     const titleLower = title?.toLowerCase() || ''
//     if (titleLower.includes('battery')) return 'bi-battery-charging'
//     if (titleLower.includes('motor')) return 'bi-lightning-charge'
//     if (titleLower.includes('general') || titleLower.includes('service')) return 'bi-tools'
//     if (titleLower.includes('spare') || titleLower.includes('part')) return 'bi-cart'
//     return 'bi-gear'
//   }

//   const handleExplore = (service) => {
//     addToCart({
//       id: service._id,
//       serviceId: service._id,
//       name: service.title,
//       price: service.offer_price || service.price,
//       originalPrice: service.price,
//       quantity: 1,
//       image: service.image || '/assets/products/shop.png'
//     })
//     navigate('/cart')
//   }

//   const brands = [
//     { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
//     { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
//     { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
//     { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
//     { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' },
//   ]

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Hero Section Skeleton */}
//         <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
//           <div className="container mx-auto px-4 text-center">
//             <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
//             <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
//           </div>
//         </section>

//         {/* Services Section Skeleton */}
//         <section className="services-urban py-16">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
//               <div className="h-5 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center animate-pulse">
//                   <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
//                   <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Brands Section Skeleton */}
//         <section className="brands-section py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
//               <div className="h-5 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
//             </div>
//             <div className="flex flex-wrap justify-center gap-8">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="w-32 md:w-40 bg-white rounded-lg p-4 shadow-md animate-pulse">
//                   <div className="h-12 bg-gray-200 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
//             Our EV Services ⚡
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Professional EV repair and maintenance services at your doorstep
//           </p>
//         </div>
//       </section>

//       {/* ================= SERVICES SECTION ================= */}
//       <section className="services-urban py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2 services-heading">
//               Our EV Services
//             </h2>
//             <p className="text-gray-500">
//               Smart EV solutions powered by Reparo
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {services.map((service, index) => (
//               <div
//                 key={service._id}
//                 data-aos="fade-up"
//                 data-aos-delay={index * 100}
//                 className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#0b86d0] to-[#00c853] flex items-center justify-center text-white text-3xl mb-4">
//                   <i className={`bi ${getIconForService(service.title)}`}></i>
//                 </div>
//                 <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
//                 <p className="text-gray-500 text-sm mb-2">
//                   Starting from ₹{service.offer_price || service.price}
//                 </p>
//                 <p className="text-gray-400 text-xs mb-4">
//                   {service.features?.[0]?.title || 'Professional EV service'}
//                 </p>
//                 <button
//                   onClick={() => handleExplore(service)}
//                   className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white font-semibold py-2 px-5 rounded-lg inline-flex items-center gap-1 hover:opacity-90 transition"
//                 >
//                   ⚡ Book Now
//                   <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= BRANDS SECTION ================= */}
//       <section className="brands-section py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2 brands-heading">
//               Popular EV Brands
//             </h2>
//             <p className="text-gray-500">
//               Certified & Supported by Reparo
//             </p>
//           </div>

//           <div className="flex flex-wrap justify-center gap-8">
//             {brands.map((brand, index) => (
//               <div
//                 key={index}
//                 data-aos="fade-up"
//                 data-aos-delay={index * 100}
//                 className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 w-32 md:w-40"
//               >
//                 <img 
//                   src={brand.logo} 
//                   alt={brand.name}
//                   className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Services




// import React from 'react'
// import ServicesSection from '../components/home/ServicesSection'
// import BrandsSection from '../components/home/BrandsSection'

// const Services = () => {
//   return (
//     <div className="services-page">
//       {/* Hero Section for Services Page */}
//       <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
//             Our EV Services ⚡
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Professional EV repair and maintenance services at your doorstep
//           </p>
//         </div>
//       </section>

//       {/* Services Section */}
//       <ServicesSection />

//       {/* Brands Section */}
//       <BrandsSection />
//     </div>
//   )
// }

// export default Services