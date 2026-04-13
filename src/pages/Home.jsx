// src/pages/Home.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  // const handleBookService = (service) => {
  //   const isAuthenticated = localStorage.getItem('token')
    
  //   const serviceData = {
  //     id: service.serviceId,
  //     serviceId: service.serviceId,
  //     serviceCityId:service.serviceCityId,
  //     serviceModelId:service.serviceModelId,
  //     name: service.name,
  //     price: service.offerPrice || service.originalPrice,
  //     originalPrice: service.originalPrice,
  //     quantity: 1,
  //     image: '/assets/products/shop.png',
  //     type: 'service',
  //     action: 'book_service'
  //   }

  //   if (!isAuthenticated) {
  //     sessionStorage.setItem('pendingServiceAction', JSON.stringify(serviceData))
  //     sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
  //     navigate('/login')
  //     return
  //   }
    
  //   setBookingLoading(service.id)
  //   addToCart(serviceData)
    
  //   setTimeout(() => {
  //     setBookingLoading(null)
  //     navigate('/cart')
  //   }, 500)
  // }

  const handleBookService = (service) => {
    const isAuthenticated = localStorage.getItem('token')
    
    const serviceData = {
      id: service.serviceId,
      serviceId: service.serviceId,
      name: service.name,
      price: service.offerPrice || service.originalPrice,
      originalPrice: service.originalPrice,
      quantity: 1,
      image: '/assets/products/shop.png',
      type: 'service',
      action: 'book_service',
      // ✅ ADD city and model data
      locationId: service.locationId,
      locationName: service.locationName,
      modelId: service.modelId,
      modelName: service.modelName
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingServiceAction', JSON.stringify(serviceData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    setBookingLoading(service.id)
    addToCart(serviceData)
    
    setTimeout(() => {
      setBookingLoading(null)
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
                        {/* <h5 className="font-bold text-xl mb-2 gradient-text">{item.name}</h5> */}
                        <Link 
                          to={`/service/${item?.id}`}
                          className="block hover:opacity-80 transition"
                        >
                          <h5 className="text-xl font-semibold mt-4 mb-2 hover:text-primary transition-colors">
                            {item.name}
                          </h5>
                        </Link>
                        {item.offerPrice && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Save ₹{item.originalPrice - item.offerPrice}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-2">
                        📍 Available in {item.location}
                      </p>
                      
                      {/* ✅ Display Model if available */}
                      {item.model && (
                        <p className="text-gray-500 text-sm mb-2">
                          🚗 Model: {item.model}
                        </p>
                      )}
                      
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
      
      <ServicesSection />
      <ProductsSection />
      <BrandsSection />
      <StatsSection />
      <BookingProcess />
      <FAQSection />
      <section className="py-16 bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white mb-6 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a Reparo Partner ⚡
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Join India's Fast Growing EV Service Network
          </p>
          {/* <button className="bg-white text-[#0b86d0] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Start Registration
          </button> */}
          <button
            onClick={() => window.open("http://forms.gle/2RVerPAQwj2ehBYQ9", "_blank")}
            className="bg-white text-[#0b86d0] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Become a Partner Now
          </button>
        </div>
      </section>
      <ContactSection />
    </div>
  )
}

export default Home