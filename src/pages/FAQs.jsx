// src/pages/FAQs.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const FAQs = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/web/api/get_all_faqs`)
      const data = await response.json()
      console.log('FAQs Response:', data)
      
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
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Frequently Asked Questions ❓
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Reparo services
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">No FAQs Available</h3>
              <p className="text-gray-500">
                Check back later for frequently asked questions.
              </p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div
                key={faq._id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'shadow-md' : 'hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-lg">
                    {faq.title}
                  </span>
                  <span className={`text-2xl text-primary transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                
                <div className={`px-6 overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'pb-4 max-h-96' : 'max-h-0'
                }`}>
                  <p className="text-gray-600 leading-relaxed border-t pt-4">
                    {faq.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions? */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 gradient-text">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQs