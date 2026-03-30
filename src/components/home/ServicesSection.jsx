// src/components/home/ServicesSection.jsx
import React from 'react'

const ServicesSection = () => {
  const services = [
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

  return (
    <section className="services-urban py-16 bg-gray-50">
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
          {services.map((service, index) => (
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
  )
}

export default ServicesSection





// import React, { useState, useEffect } from 'react'
// import ServiceCard from '../common/ServiceCard'
// import { getAllServices } from '../../services/api'

// const ServicesSection = () => {
//   const [services, setServices] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchServices()
//   }, [])

//   const fetchServices = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServices()
//       console.log('Services API Response:', response)
      
//       if (response.success && response.data && response.data.length > 0) {
//         const formattedServices = response.data.map(service => ({
//           id: service._id,
//           serviceId: service._id,
//           title: service.title,
//           price: service.offer_price || service.price,
//           originalPrice: service.price,
//           description: service.features?.[0]?.title || 'Professional EV service with quality assurance',
//           features: service.features || [],
//           icon: getIconForService(service.title),
//           category: service.servicecategory_id?.name || 'Service',
//           image: service.image || '/assets/products/shop.png'
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

//   if (loading) {
//     return (
//       <section className="services-urban py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Our EV Services</h2>
//             <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
//                 <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
//                 <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="services-urban py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold mb-2">Our EV Services</h2>
//           <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.map((service, index) => (
//             <div key={service.id} data-aos="fade-up" data-aos-delay={index * 100}>
//               <ServiceCard service={service} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ServicesSection


// src/components/home/ServicesSection.jsx
// import React, { useState, useEffect } from 'react'  // working code for service complete flow
// import { useNavigate } from 'react-router-dom'
// import { getAllServices } from '../../services/api'
// import { useCart } from '../../context/CartContext'

// const ServicesSection = () => {
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
//         // Format services data
//         const formattedServices = response.data.map(service => ({
//           id: service._id,
//           serviceId: service._id,
//           title: service.title,
//           price: service.offer_price || service.price,
//           originalPrice: service.price,
//           description: service.features?.[0]?.title || 'Professional EV service with quality assurance',
//           features: service.features || [],
//           icon: getIconForService(service.title),
//           category: service.servicecategory_id?.name || 'Service',
//           image: service.image || '/assets/products/shop.png'
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

//   const handleExplore = (service) => {
//     // Add to cart and navigate to cart page
//     addToCart({
//       id: service.serviceId,
//       serviceId: service.serviceId,
//       name: service.title,
//       price: service.price,
//       originalPrice: service.originalPrice,
//       quantity: 1,
//       image: service.image
//     })
//     navigate('/cart')
//   }

//   if (loading) {
//     return (
//       <section className="services-urban py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Our EV Services</h2>
//             <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
//                 <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
//                 <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (services.length === 0) {
//     return (
//       <section className="services-urban py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-2">Our EV Services</h2>
//             <p className="text-gray-600">Smart EV solutions powered by Reparo</p>
//           </div>
//           <div className="text-center py-12">
//             <p className="text-gray-500">No services available at the moment.</p>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="services-urban py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 
//             data-aos="fade-up" 
//             className="text-3xl md:text-4xl font-bold mb-2 services-heading"
//           >
//             Our EV Services
//           </h2>
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="100"
//             className="text-gray-600"
//           >
//             Smart EV solutions powered by Reparo
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.map((service, index) => (
//             <div
//               key={service.id}
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//               className="urban-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="urban-icon w-20 h-20 mx-auto rounded-full gradient-animated flex items-center justify-center text-white text-3xl mb-4">
//                 <i className={`bi ${service.icon}`}></i>
//               </div>
//               <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
//               <p className="text-gray-500 text-sm mb-2">Starting from ₹{service.price}</p>
//               <p className="text-gray-500 text-xs mb-4">{service.description}</p>
//               <button 
//                 onClick={() => handleExplore(service)}
//                 className="btn-explore gradient-animated text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-1 hover:opacity-90 transition"
//               >
//                 ⚡ Book Now
//                 <i className="bi bi-arrow-right"></i>
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
// export default ServicesSection


// const services = [
//   {
//     icon: 'bi-tools',
//     title: 'General Service',
//     description: 'Complete EV inspection & performance optimization',
//     color: 'from-blue-500 to-cyan-500'
//   },
//   {
//     icon: 'bi-battery-charging',
//     title: 'Battery Repair',
//     description: 'BMS repair, battery diagnostics & replacement',
//     color: 'from-green-500 to-emerald-500'
//   },
//   {
//     icon: 'bi-lightning-charge',
//     title: 'Motor Repair',
//     description: 'Motor rewinding & controller troubleshooting',
//     color: 'from-yellow-500 to-orange-500'
//   },
//   {
//     icon: 'bi-cart',
//     title: 'Spare Parts',
//     description: 'Genuine EV parts & certified accessories',
//     color: 'from-purple-500 to-pink-500'
//   }
// ]

// const ServicesSection = () => {
//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 
//             data-aos="fade-up" 
//             className="text-3xl md:text-4xl font-bold mb-3"
//           >
//             Our EV Services
//           </h2>
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="100"
//             className="text-gray-600"
//           >
//             Smart EV solutions powered by Reparo
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.map((service, index) => (
//             <div
//               key={index}
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//               className="service-card group cursor-pointer"
//             >
//               <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                 <i className={`bi ${service.icon}`}></i>
//               </div>
//               <h5 className="text-xl font-semibold mb-2">{service.title}</h5>
//               <p className="text-gray-500 text-sm mb-4">{service.description}</p>
//               <button className="text-primary font-semibold hover:gap-2 transition-all inline-flex items-center gap-1">
//                 ⚡ Explore
//                 <i className="bi bi-arrow-right"></i>
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ServicesSection