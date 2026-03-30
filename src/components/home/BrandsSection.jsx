import React from 'react'

const brands = [
  { name: 'Ola Electric', logo: '/assets/icons/ola.png' },
  { name: 'Ather Energy', logo: '/assets/icons/toppng.png' },
  { name: 'Hero Electric', logo: '/assets/icons/Hero_MotoCorp_Logo.png' },
  { name: 'TVS Motor', logo: '/assets/icons/tvs.png' },
  { name: 'Bajaj Auto', logo: '/assets/icons/bajaj.png' },
]

const BrandsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            data-aos="fade-up" 
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Popular EV Brands
          </h2>
          <p 
            data-aos="fade-up" 
            data-aos-delay="100"
            className="text-gray-600"
          >
            Certified & Supported by Reparo
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="brand-card w-32 md:w-40"
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
    </section>
  )
}

export default BrandsSection