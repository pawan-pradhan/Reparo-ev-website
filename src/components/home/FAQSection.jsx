// src/components/home/FAQSection.jsx
import React, { useState, useEffect } from 'react'

const FAQSection = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('https://test.reparo24.com/web/api/get_all_faqs')
      const data = await response.json()
      // console.log('FAQs Response:', data)
      
      if (data.success && data.data) {
        setFaqs(data.data)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  if (loading) {
    return (
      <section className="faq-section py-5 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold">Frequently Asked Questions ❓</h2>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="faq-section py-5 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold">Frequently Asked Questions ❓</h2>
          <p className="text-gray-500">Everything you need to know about Reparo services</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-800">{faq.title}</span>
                <span className={`text-xl text-primary transition-transform duration-300 ${activeIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div className={`px-5 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'pb-4 max-h-40' : 'max-h-0'}`}>
                <p className="text-gray-600 text-sm">{faq.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection