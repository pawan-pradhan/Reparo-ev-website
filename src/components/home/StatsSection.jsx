import React, { useState, useEffect } from 'react'

const StatsSection = () => {
  const [counters, setCounters] = useState({
    services: 0,
    technicians: 0,
    cities: 0
  })

  useEffect(() => {
    const animateCounters = () => {
      const targets = {
        services: 10000,
        technicians: 500,
        cities: 50
      }
      
      const duration = 2000
      const stepTime = 20
      
      Object.keys(targets).forEach(key => {
        const target = targets[key]
        const steps = duration / stepTime
        const increment = target / steps
        let current = 0
        
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setCounters(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }))
        }, stepTime)
      })
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters()
        observer.disconnect()
      }
    })

    const statsSection = document.querySelector('#stats-section')
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-16 gradient-animated text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div data-aos="fade-up" className="stat-card bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-3 animate-float">⚡</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{counters.services}+</h2>
            <p className="text-white/90">Services Completed</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="stat-card bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-3 animate-float">👨‍🔧</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{counters.technicians}+</h2>
            <p className="text-white/90">Verified Technicians</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200" className="stat-card bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-3 animate-float">🌍</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{counters.cities}+</h2>
            <p className="text-white/90">Cities Covered</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="300" className="stat-card bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-3 animate-float">⭐</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">4.8</h2>
            <p className="text-white/90">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection









// import React, { useState, useEffect } from 'react'

// const StatsSection = () => {
//   const [counters, setCounters] = useState({
//     services: 0,
//     technicians: 0,
//     cities: 0,
//     rating: 4.8
//   })

//   const stats = [
//     { id: 'services', label: 'Services Completed', target: 10000, icon: '⚡', suffix: '+' },
//     { id: 'technicians', label: 'Verified Technicians', target: 500, icon: '👨‍🔧', suffix: '+' },
//     { id: 'cities', label: 'Cities Covered', target: 50, icon: '🌍', suffix: '+' },
//     { id: 'rating', label: 'Average Rating', target: 4.8, icon: '⭐', suffix: '' }
//   ]

//   useEffect(() => {
//     const animateCounter = () => {
//       stats.forEach(stat => {
//         if (stat.id !== 'rating') {
//           let start = 0
//           const end = stat.target
//           const duration = 2000
//           const increment = end / (duration / 16)
          
//           const timer = setInterval(() => {
//             start += increment
//             if (start >= end) {
//               start = end
//               clearInterval(timer)
//             }
//             setCounters(prev => ({
//               ...prev,
//               [stat.id]: Math.floor(start)
//             }))
//           }, 16)
//         }
//       })
//     }

//     // Intersection Observer
//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         animateCounter()
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
//     <section id="stats-section" className="py-16 bg-gradient-to-r from-dark to-dark-light text-white">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <div
//               key={stat.id}
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//               className="stat-card text-center"
//             >
//               <div className="text-4xl mb-3">{stat.icon}</div>
//               <h2 className="text-3xl md:text-4xl font-bold mb-2">
//                 {stat.id === 'rating' ? counters[stat.id] : `${counters[stat.id]}${stat.suffix}`}
//               </h2>
//               <p className="text-gray-300">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default StatsSection