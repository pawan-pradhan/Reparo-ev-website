// src/components/home/ServicesSection.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: 'bi-tools',
      title: 'General Service',
      description: 'Complete EV inspection & performance optimization',
      slug: 'general-service'
    },
    {
      id: 2,
      icon: 'bi-battery-charging',
      title: 'Battery Repair',
      description: 'BMS repair, battery diagnostics & replacement',
      slug: 'battery-repair'
    },
    {
      id: 3,
      icon: 'bi-lightning-charge',
      title: 'Motor Repair',
      description: 'Motor rewinding & controller troubleshooting',
      slug: 'motor-repair'
    },
    {
      id: 4,
      icon: 'bi-cart',
      title: 'Spare Parts',
      description: 'Genuine EV parts & certified accessories',
      slug: 'spare-parts'
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
              {/* ✅ Title with link to services page (since these are categories) */}
              <Link to="/services">
                <h5 className="text-xl font-semibold mt-4 mb-2 hover:text-primary transition-colors">
                  {service.title}
                </h5>
              </Link>
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