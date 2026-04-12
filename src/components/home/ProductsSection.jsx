// src/components/home/ProductsSection.jsx
import React, { useState, useEffect } from 'react'
import ProductCard from '../common/ProductCard'

const ProductsSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stockImageUrl, setStockImageUrl] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://reparo24.com/web/api/get_all_products')
      const data = await response.json()
      console.log('Products Response:', data)
      
      if (data.success && data.data && data.data.length > 0) {
        // Store the stock_image_url from response
        if (data.stock_image_url) {
          setStockImageUrl(data.stock_image_url)
        }
        
        // Show only first 6 products on home page
        const formattedProducts = data.data.slice(0, 6).map(product => ({
          id: product._id,
          name: product.product_name || product.sku_code || 'Product',
          price: product.sale_price || 0,
          images: product.images || [], // Store all images
          stockImageUrl: data.stock_image_url || '',
          description: product.description || 'High-quality product'
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our EV Products ⚡</h2>
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
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold mb-3">
            Our EV Products ⚡
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600">
            High-quality EV components and accessories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection