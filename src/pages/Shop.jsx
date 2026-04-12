// src/pages/Shop.jsx
import React, { useState, useEffect } from 'react'
import ProductCard from '../components/common/ProductCard'

const Shop = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stockImageUrl, setStockImageUrl] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/web/api/get_all_products`)
      const data = await response.json()
      console.log('All Products Response:', data)
      
      if (data.success && data.data && data.data.length > 0) {
        // ✅ Get stock image URL from response
        const baseImageUrl = data.stock_image_url || ''
        setStockImageUrl(baseImageUrl)
        
        const formattedProducts = data.data.map(product => ({
          id: product._id,
          name: product.product_name || product.sku_code || 'Product',
          price: product.sale_price || 0,
          oldPrice: product.sale_price || 0,
          image: product.images && product.images.length > 0 
            ? `${baseImageUrl}${product.images[0]}` 
            : '/assets/products/shop.png',
          images: product.images || [],
          stockImageUrl: baseImageUrl,
          description: product.description || 'High-quality product',
          quantity: product.quantity || 0,
          model: product.model,
          sku_code: product.sku_code
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Our EV Products ⚡</h1>
          <p className="text-gray-600">High-quality EV components and accessories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">Our EV Products ⚡</h1>
        <p className="text-gray-600">High-quality EV components and accessories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Shop