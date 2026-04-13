// src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react'
import { getAllCities, getAllServiceCategories, getAllModels, getFilteredServices } from '../../services/api'

const Hero = ({ onSearch }) => {
  const [locationId, setLocationId] = useState('')
  const [locationName, setLocationName] = useState('')
  const [service, setService] = useState('')
  const [model, setModel] = useState('')
  const [cities, setCities] = useState([])
  const [models, setModels] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCitiesCategoriesAndModels()
    // loadSavedSelections()
  }, [])

  // ✅ Load saved selections from localStorage
  const loadSavedSelections = () => {
    const savedLocationId = localStorage.getItem('selected_location_id')
    const savedLocationName = localStorage.getItem('selected_location_name')
    const savedService = localStorage.getItem('selected_service')
    const savedModelId = localStorage.getItem('selected_model_id')
    const savedModelName = localStorage.getItem('selected_model_name')
    
    if (savedLocationId) {
      setLocationId(savedLocationId)
      setLocationName(savedLocationName || '')
    }
    if (savedService) {
      setService(savedService)
    }
    if (savedModelId) {
      setModel(savedModelId)
    }
  }

  const fetchCitiesCategoriesAndModels = async () => {
    try {
      const [citiesRes, categoriesRes, modelsRes] = await Promise.all([
        getAllCities(),
        getAllServiceCategories(),
        getAllModels()
      ])
      
      if (citiesRes.success) {
        setCities(citiesRes.data)
      }
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data)
      }
      
      if (modelsRes.success) {
        setModels(modelsRes.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // ✅ Save location to localStorage
  const handleLocationChange = (e) => {
    const selectedId = e.target.value
    const selectedCity = cities.find(city => city._id === selectedId)
    
    if (selectedCity) {
      setLocationId(selectedId)
      setLocationName(selectedCity.name)
      
      localStorage.setItem('selected_location_name', selectedCity.name)
      localStorage.setItem('selected_location_id', selectedId)
    } else {
      setLocationId('')
      setLocationName('')
      localStorage.removeItem('selected_location_name')
      localStorage.removeItem('selected_location_id')
    }
  }

  // ✅ Save model to localStorage
  const handleModelChange = (e) => {
    const selectedId = e.target.value
    const selectedModel = models.find(model => model._id === selectedId)
    
    if (selectedModel) {
      setModel(selectedId)
      
      localStorage.setItem('selected_model_name', selectedModel.name)
      localStorage.setItem('selected_model_id', selectedId)
    } else {
      setModel('')
      localStorage.removeItem('selected_model_name')
      localStorage.removeItem('selected_model_id')
    }
  }

  // ✅ Save service to localStorage
  const handleServiceChange = (e) => {
    const value = e.target.value
    setService(value)
    if (value) {
      localStorage.setItem('selected_service', value)
    } else {
      localStorage.removeItem('selected_service')
    }
  }

  // const handleSearch = async () => {
  //   if (!locationId || !service || !model) {
  //     alert('Please select all Location, Service, and Model.')
  //     return
  //   }

  //   setLoading(true)
    
  //   try {
  //     const response = await getFilteredServices(locationId, service, model)
      
  //     if (response.success && response.data && response.data.length > 0) {
  //       const results = response.data.map((serviceItem) => {
  //         const cityNames = serviceItem.city_id?.map(city => city.name).join(', ') || locationName || 'Selected City'
          
  //         // ✅ Get model name from model_id array
  //         const modelNames = serviceItem.model_id?.map(model => model.name).join(', ') || ''
          
  //         return {
  //           id: serviceItem._id,
  //           name: serviceItem.title,
  //           price: serviceItem.offer_price ? `₹${serviceItem.offer_price}` : `₹${serviceItem.price}`,
  //           originalPrice: serviceItem.price,
  //           offerPrice: serviceItem.offer_price,
  //           desc: serviceItem.features?.[0]?.title || 'Professional EV service with quality assurance',
  //           location: cityNames,
  //           model: modelNames,  // ✅ Add model to result
  //           serviceId: serviceItem._id,
  //           features: serviceItem.features || [],
  //           category: serviceItem.servicecategory_id?.name || 'Service'
  //         }
  //       })
        
  //       if (onSearch) {
  //         onSearch(locationId, service, results)
  //       }
  //     } else {
  //       if (onSearch) {
  //         onSearch(locationId, service, [])
  //       }
  //       alert('No services available for selected location, model and service type')
  //     }
  //   } catch (error) {
  //     console.error('Search error:', error)
  //     alert('Failed to fetch services. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // src/components/home/Hero.jsx - handleSearch function mein changes

  const handleSearch = async () => {
    if (!locationId || !service || !model) {
      alert('Please select all Location, Service, and Model.')
      return
    }

    setLoading(true)
    
    try {
      const response = await getFilteredServices(locationId, service, model)
      
      if (response.success && response.data && response.data.length > 0) {
        const results = response.data.map((serviceItem) => {
          const cityNames = serviceItem.city_id?.map(city => city.name).join(', ') || locationName || 'Selected City'
          const modelNames = serviceItem.model_id?.map(model => model.name).join(', ') || ''
          
          // ✅ Get city ID and model ID from the response
          const cityId = serviceItem.city_id?.[0]?._id || locationId
          const modelId = serviceItem.model_id?.[0]?._id || model
          
          return {
            id: serviceItem._id,
            name: serviceItem.title,
            price: serviceItem.offer_price ? `₹${serviceItem.offer_price}` : `₹${serviceItem.price}`,
            originalPrice: serviceItem.price,
            offerPrice: serviceItem.offer_price,
            desc: serviceItem.features?.[0]?.title || 'Professional EV service',
            location: cityNames,
            locationId: cityId,        // ✅ ADD city ID
            locationName: cityNames,    // ✅ ADD city name
            model: modelNames,
            modelId: modelId,           // ✅ ADD model ID
            modelName: modelNames,      // ✅ ADD model name
            serviceId: serviceItem._id,
            features: serviceItem.features || [],
            category: serviceItem.servicecategory_id?.name || 'Service'
          }
        })
        
        if (onSearch) {
          onSearch(locationId, service, results)
        }
      } else {
        if (onSearch) {
          onSearch(locationId, service, [])
        }
        alert('No services available')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to fetch services. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="hero-section min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <h1 
          data-aos="fade-up" 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
        >
          Reparo - Book Your EV Service ⚡
        </h1>
        <p 
          data-aos="fade-up" 
          data-aos-delay="100"
          className="text-lg md:text-xl text-white/90 mb-10"
        >
          Battery • Motor • Controller • Spare Parts • Doorstep Repair
        </p>

        {/* Search Box */}
        <div 
          data-aos="fade-up" 
          data-aos-delay="200"
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Dropdown */}
            <select
              value={locationId}
              onChange={handleLocationChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Location</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>{city.name}</option>
              ))}
            </select>

            {/* Model Dropdown */}
            <select
              value={model}
              onChange={handleModelChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Model</option>
              {models.map((modelItem) => (
                <option key={modelItem._id} value={modelItem._id}>{modelItem.name}</option>
              ))}
            </select>

            {/* Service Dropdown */}
            <select
              value={service}
              onChange={handleServiceChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Service</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="gradient-animated text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search Now</span>
                  <span>🔍</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero




// import React, { useState, useEffect } from 'react'
// import { getAllCities, getAllServiceCategories, getFilteredServices } from '../../services/api'

// const Hero = ({ onSearch }) => {
//   const [location, setLocation] = useState('')
//   const [service, setService] = useState('')
//   const [cities, setCities] = useState([])
//   const [models, setModels] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetchCitiesAndCategories()
//   }, [])


//   // ✅ Load saved selections from localStorage
//   const loadSavedSelections = () => {
//     const savedLocation = localStorage.getItem('selected_location')
//     const savedService = localStorage.getItem('selected_service')
    
//     if (savedLocation) {
//       setLocation(savedLocation)
//     }
//     if (savedService) {
//       setService(savedService)
//     }
//   }


//   // ✅ Save to localStorage when selection changes
//   const handleLocationChange = (e) => {
//     const selectedId = e.target.value
//     const selectedCity = cities.find(city => city._id === selectedId)
    
//     if (selectedCity) {
//       setLocation(selectedId)
//       // setLocationName(selectedCity.name)
      
//       // Store city name for checkout/address page
//       localStorage.setItem('selected_location_name', selectedCity.name)
//       localStorage.setItem('selected_location_id', selectedId)
//     } else {
//       setLocation('')
//       // setLocationName('')
//       localStorage.removeItem('selected_location_name')
//       localStorage.removeItem('selected_location_id')
//     }
//   }


//   const handleModelChange = (e) => {
//     const selectedId = e.target.value
//     const selectedModel = models.find(model => model._id === selectedId)
    
//     if (selectedModel) {
//       setModels(selectedId)
      
//       // Store model name for checkout/address page
//       localStorage.setItem('selected_model_name', selectedModel.name)
//       localStorage.setItem('selected_model_id', selectedId)
//     } else {
//       setModels('')
//       localStorage.removeItem('selected_model_name')
//       localStorage.removeItem('selected_model_id')
//     }
//   }



//   const handleServiceChange = (e) => {
//     const value = e.target.value
//     setService(value)
//     if (value) {
//       localStorage.setItem('selected_service', value)
//     } else {
//       localStorage.removeItem('selected_service')
//     }
//   }

    

//   const fetchCitiesAndCategories = async () => {
//     try {
//       const [citiesRes, categoriesRes] = await Promise.all([
//         getAllCities(),
//         getAllServiceCategories()
//       ])
      
//       if (citiesRes.success) {
//         setCities(citiesRes.data)
//       }
      
//       if (categoriesRes.success) {
//         setCategories(categoriesRes.data)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     }
//   }

//   const handleSearch = async () => {
//     if (!location || !service) {
//       alert('Please select both Location and Service.')
//       return
//     }

//     setLoading(true)
    
//     try {
//       // Get services with filters (backend will handle filtering)
//       const response = await getFilteredServices(location, service)
      
//       if (response.success && response.data && response.data.length > 0) {
//         // Format results for display
//         const results = response.data.map((serviceItem) => {
//           // Get city name from city_id array
//           const cityNames = serviceItem.city_id?.map(city => city.name).join(', ') || 'Selected City'
          
//           return {
//             id: serviceItem._id,
//             name: serviceItem.title,
//             price: serviceItem.offer_price ? `₹${serviceItem.offer_price}` : `₹${serviceItem.price}`,
//             originalPrice: serviceItem.price,
//             offerPrice: serviceItem.offer_price,
//             desc: serviceItem.features?.[0]?.title || 'Professional EV service with quality assurance',
//             location: cityNames,
//             serviceId: serviceItem._id,
//             features: serviceItem.features || [],
//             category: serviceItem.servicecategory_id?.name || 'Service'
//           }
//         })
        
//         if (onSearch) {
//           onSearch(location, service, results)
//         }
//       } else {
//         // No services found
//         if (onSearch) {
//           onSearch(location, service, [])
//         }
//         alert('No services available for selected location and service type')
//       }
//     } catch (error) {
//       console.error('Search error:', error)
//       alert('Failed to fetch services. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="hero-section min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#0b86d0] via-[#00c853] to-[#0b86d0] bg-[length:400%_400%] animate-[gradientMove_12s_ease_infinite]">
//       {/* Overlay for better text readability */}
//       <div className="absolute inset-0 bg-black/30"></div>
      
//       <div className="container mx-auto px-4 py-20 text-center relative z-10">
//         <h1 
//           data-aos="fade-up" 
//           className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
//         >
//           Reparo - Book Your Service ⚡
//         </h1>
//         <p 
//           data-aos="fade-up" 
//           data-aos-delay="100"
//           className="text-lg md:text-xl text-white/90 mb-10"
//         >
//           Battery • Motor • Controller • Spare Parts • Doorstep Repair
//         </p>

//         {/* Search Box */}
//         <div 
//           data-aos="fade-up" 
//           data-aos-delay="200"
//           className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <select
//               value={location}
//               onChange={handleLocationChange}
//               className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//             >
//               <option value="">Select Location</option>
//               {cities.map((city) => (
//                 <option key={city._id} value={city._id}>{city.name}</option>
//               ))}
//             </select>

//             {/* model dropdown */}
//             <select
//               value={model}
//               onChange={handleModelChange}
//               className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//             >
//               <option value="">Select Model</option>
//               {models.map((model) => (
//                 <option key={model._id} value={model._id}>{model.name}</option>
//               ))}
//             </select>

//             <select
//               value={service}
//               onChange={(e) => setService(e.target.value)}
//               className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//             >
//               <option value="">Select Service</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </select>

//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               className="gradient-animated text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   <span>Searching...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Search Now</span>
//                   <span>🔍</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Hero