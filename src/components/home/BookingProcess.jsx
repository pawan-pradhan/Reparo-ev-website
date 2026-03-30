import React from 'react'

const processSteps = [
  { step: 1, icon: '📍', title: 'Select Location', desc: 'Choose your city & EV service requirement.' },
  { step: 2, icon: '🛵', title: 'Select Service', desc: 'Pick battery, motor, or general EV service.' },
  { step: 3, icon: '📅', title: 'Schedule', desc: 'Choose convenient date & time slot.' },
  { step: 4, icon: '⚡', title: 'Service Delivered', desc: 'Technician arrives & completes service.' }
]

const BookingProcess = () => {
  return (
    <section className="how-book-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            data-aos="fade-up" 
            className="text-3xl md:text-4xl font-bold mb-2 process-title"
          >
            How to Book with Reparo ⚡
          </h2>
          <p 
            data-aos="fade-up" 
            data-aos-delay="100"
            className="text-gray-600"
          >
            Simple, Fast & Smart EV Service Booking
          </p>
        </div>

        <div className="process-wrapper relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="process-card relative bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="step-number absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 gradient-animated text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="process-icon text-4xl mt-4 mb-3 animate-float">{step.icon}</div>
                <h5 className="text-xl font-semibold mb-2">{step.title}</h5>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingProcess