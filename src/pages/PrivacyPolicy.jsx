// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect } from 'react'

const PrivacyPolicy = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrivacyPolicy()
  }, [])

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/web/api/get_privacy_policy`)
      const data = await response.json()
      console.log('Privacy Policy Response:', data)
      
      if (data.success && data.data) {
        setContent(data.data.content)
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error)
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

export default PrivacyPolicy