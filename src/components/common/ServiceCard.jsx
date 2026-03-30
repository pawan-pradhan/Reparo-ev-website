// src/components/common/ServiceCard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCart } from '../../context/CartContext'

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { addToCart } = useCart()

  const handleBookNow = () => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-20 h-20 mx-auto rounded-full gradient-animated flex items-center justify-center text-white text-3xl mb-4">
        <i className={`bi ${service.icon}`}></i>
      </div>
      <h5 className="text-xl font-semibold mt-4 mb-2">{service.title}</h5>
      <p className="text-gray-500 text-sm mb-2">Starting from ₹{service.price}</p>
      <p className="text-gray-500 text-xs mb-4">{service.description}</p>
      <button 
        onClick={handleBookNow}
        className="btn-explore gradient-animated text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-1 hover:opacity-90 transition"
      >
        ⚡ Book Now
        <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  )
}

export default ServiceCard