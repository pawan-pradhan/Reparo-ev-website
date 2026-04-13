// src/pages/ServiceDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAllServices } from '../services/api'
import { useCart } from '../context/CartContext'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { addToCart } = useCart()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchServiceDetails()
  }, [id])

  // const fetchServiceDetails = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await getAllServices()
  //     console.log('Service Details Response:', response)
      
  //     if (response.success && response.data) {
  //       const foundService = response.data.find(s => s._id === id)
        
  //       if (foundService) {
  //         setService({
  //           id: foundService._id,
  //           serviceId: foundService._id,
  //           name: foundService.title,
  //           price: foundService.offer_price || foundService.price,
  //           originalPrice: foundService.price,
  //           description: foundService.features?.[0]?.title || 'Complete EV service with advanced diagnostics, professional repair, and quality assurance. Fast doorstep service.',
  //           features: foundService.features || [],
  //           image: foundService.image || '/assets/products/shop.png',
  //           category: foundService.servicecategory_id?.name || 'Service'
  //         })
  //       } else {
  //         navigate('/services')
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching service:', error)
  //     navigate('/services')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      const response = await getAllServices()
      console.log('Service Details Response:', response)
      
      if (response.success && response.data) {
        const foundService = response.data.find(s => s._id === id)
        
        if (foundService) {
          // ✅ Get model names from model_id array
          const modelNames = foundService.model_id?.map(model => model.name).join(', ') || ''
          
          setService({
            id: foundService._id,
            serviceId: foundService._id,
            name: foundService.title,
            price: foundService.offer_price || foundService.price,
            originalPrice: foundService.price,
            description: foundService.features?.[0]?.title || 'Complete EV service with advanced diagnostics, professional repair, and quality assurance. Fast doorstep service.',
            features: foundService.features || [],
            image: foundService.image || '/assets/products/shop.png',
            category: foundService.servicecategory_id?.name || 'Service',
            model: modelNames  // ✅ Add model to service object
          })
        } else {
          navigate('/services')
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      navigate('/services')
    } finally {
      setLoading(false)
    }
  }


  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    // ✅ Get saved city and model from localStorage
    const savedLocationId = localStorage.getItem('selected_location_id')
    const savedLocationName = localStorage.getItem('selected_location_name')
    const savedModelId = localStorage.getItem('selected_model_id')
    const savedModelName = localStorage.getItem('selected_model_name')

    addToCart({
      id: service.serviceId,
      serviceId: service.serviceId,
      name: service.name,
      price: service.price,
      originalPrice: service.originalPrice,
      quantity: quantity,
      image: service.image,
      type: 'service',

      // ✅ ADD city and model data
      locationId: savedLocationId,
      locationName: savedLocationName,
      modelId: savedModelId || service.modelId,
      modelName: savedModelName || service.model
    })
    
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <button onClick={() => navigate('/services')} className="gradient-animated text-white px-6 py-2 rounded-lg">
          Back to Services
        </button>
      </div>
    )
  }

  const discountPercent = service.originalPrice && service.price && service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0

  return (
    <section className="product-detail py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="lg:w-1/2">
            <div className="main-img-box bg-gray-100 rounded-2xl p-8 text-center">
              <img 
                src={service.image} 
                alt={service.name}
                className="img-fluid main-product-img w-full max-w-md mx-auto object-contain h-80"
              />
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          {/* <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {service.name} ⚡
            </h2>

            <div className="price-box mb-3">
              <span className="new-price text-2xl font-bold text-primary">₹{service.price}</span>
              {service.originalPrice && service.originalPrice > service.price && (
                <>
                  <span className="old-price text-gray-400 line-through text-lg ml-2">₹{service.originalPrice}</span>
                  <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            <p className="text-gray-500 mb-4">
              {service.description}
            </p>
          </div> */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {service.name} ⚡
            </h2>

            {/* ✅ Display Model if available */}
            {service.model && (
              <p className="text-gray-500 text-sm mb-2">
                🚗 Compatible Model: {service.model}
              </p>
            )}

            {/* PRICE */}
            <div className="price-box mb-3">
              <span className="new-price text-2xl font-bold text-primary">₹{service.price}</span>
              {service.originalPrice && service.originalPrice > service.price && (
                <>
                  <span className="old-price text-gray-400 line-through text-lg ml-2">₹{service.originalPrice}</span>
                  <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 mb-4">
              {service.description}
            </p>
          </div>
        </div>

        {/* SERVICE DESCRIPTION BOX */}
        <div className="product-description-box mt-4 p-4 bg-gray-50 rounded-xl">
          <h5 className="font-bold text-lg mb-3">Service Description ⚡</h5>
          <p className="text-gray-500">
            Get your EV back to peak performance with our expert {service.name.toLowerCase()} service.
            We provide advanced diagnostics, professional repair, and quality assurance using
            high-quality components. Our trained technicians ensure safe, reliable,
            and long-lasting performance with quick doorstep service.
          </p>
        </div>

        {/* WHY CHOOSE REPARO BOX */}
        <div className="product-highlights-box mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h5 className="font-bold text-lg mb-3">Why Choose Reparo?</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Expert Technicians
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Genuine Spare Parts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Fast Service
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Affordable Pricing
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetails