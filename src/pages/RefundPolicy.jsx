// src/pages/RefundPolicy.jsx
import React, { useState, useEffect } from 'react'

const RefundPolicy = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRefundPolicy()
  }, [])

  const fetchRefundPolicy = async () => {
    try {
      const response = await fetch('https://test.reparo24.com/web/api/get_refund_policy')
      const data = await response.json()
      console.log('Refund Policy Response:', data)
      
      if (data.success && data.data && data.data[0]) {
        setContent(data.data[0].content)
      }
    } catch (error) {
      console.error('Error fetching refund policy:', error)
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

export default RefundPolicy