// src/pages/TermsConditions.jsx
import React, { useState, useEffect } from 'react'

const TermsConditions = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTermsConditions()
  }, [])

  const fetchTermsConditions = async () => {
    try {
      const response = await fetch('https://reparo24.com/web/api/get_terms_condition')
      const data = await response.json()
      console.log('Terms Conditions Response:', data)
      
      if (data.success && data.data) {
        setContent(data.data.content)
      }
    } catch (error) {
      console.error('Error fetching terms:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-5">
      <div className="container mx-auto px-4">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}

export default TermsConditions