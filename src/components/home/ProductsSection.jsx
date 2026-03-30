// src/components/home/ProductsSection.jsx
import React, { useState, useEffect } from 'react'
import ProductCard from '../common/ProductCard'

const ProductsSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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
        // Show only first 6 products on home page
        const formattedProducts = data.data.slice(0, 6).map(product => ({
          id: product._id,
          name: product.product_name || product.sku_code || 'Product',
          price: product.sale_price_after_gst || product.sale_price || 0,
          oldPrice: product.sale_price || 0,
          image: product.image ? `https://reparo24.com/uploads/products/${product.image}` : '/assets/products/shop.png',
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








// import React, { useState, useEffect } from 'react'
// import ProductCard from '../common/ProductCard'

// const ProductsSection = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('https://reparo24.com/web/api/get_all_products')
//       const data = await response.json()
//       console.log('Products API Response:', data)
      
//       if (data.success && data.data && data.data.length > 0) {
//         const formattedProducts = data.data.map(product => ({
//           id: product._id,
//           name: product.product_name || product.sku_code || 'Product',
//           price: product.sale_price_after_gst || product.sale_price || 0,
//           oldPrice: product.sale_price || 0,
//           image: product.image ? `/uploads/products/${product.image}` : '/assets/products/shop.png',
//           description: product.description || 'High-quality product',
//           sku_code: product.sku_code,
//           model: product.model
//         }))
//         setProducts(formattedProducts)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-3">Our EV Products ⚡</h2>
//             <p className="text-gray-600">High-quality EV components and accessories</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
//                 <div className="w-full h-48 bg-gray-200"></div>
//                 <div className="p-4">
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//                   <div className="flex gap-2">
//                     <div className="h-10 bg-gray-200 rounded flex-1"></div>
//                     <div className="h-10 bg-gray-200 rounded flex-1"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold mb-3">
//             Our EV Products ⚡
//           </h2>
//           <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600">
//             High-quality EV components and accessories
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product, index) => (
//             <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductsSection






// import React, { useState, useEffect } from 'react'
// import ProductCard from '../common/ProductCard'
// import { getAllServices } from '../../services/api'

// const ProductsSection = () => {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchAllServices()
//   }, [])

//   const fetchAllServices = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServices()
//       console.log('All Services Response:', response)
      
//       if (response.success && response.data && response.data.length > 0) {
//         // Format the services data for ProductCard
//         const formattedProducts = response.data.map((service) => ({
//           id: service._id,
//           serviceId: service._id,
//           name: service.title,
//           price: service.offer_price || service.price,
//           oldPrice: service.price,
//           image: service.image || '/assets/products/shop.png',
//           description: service.features?.[0]?.title || 'Professional EV service',
//           features: service.features || [],
//           category: service.servicecategory_id?.name || 'Service',
//           city_id: service.city_id || []
//         }))
//         setProducts(formattedProducts)
//       } else {
//         // If no data from API, use mock data as fallback
//         setProducts([
//           { id: 1, serviceId: 1, name: 'Battery Repair', price: 1499, oldPrice: 2499, image: '/assets/products/shop.png' },
//           { id: 2, serviceId: 2, name: 'Motor Repair', price: 1299, oldPrice: 1999, image: '/assets/products/shop.png' },
//           { id: 3, serviceId: 3, name: 'Controller Repair', price: 999, oldPrice: 1499, image: '/assets/products/shop.png' },
//           { id: 4, serviceId: 4, name: 'Charger Repair', price: 799, oldPrice: 1299, image: '/assets/products/shop.png' },
//           { id: 5, serviceId: 5, name: 'BMS Repair', price: 899, oldPrice: 1499, image: '/assets/products/shop.png' },
//           { id: 6, serviceId: 6, name: 'Wiring Harness', price: 599, oldPrice: 999, image: '/assets/products/shop.png' },
//         ])
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error)
//       // Use mock data on error
//       setProducts([
//         { id: 1, serviceId: 1, name: 'Battery Repair', price: 1499, oldPrice: 2499, image: '/assets/products/shop.png' },
//         { id: 2, serviceId: 2, name: 'Motor Repair', price: 1299, oldPrice: 1999, image: '/assets/products/shop.png' },
//         { id: 3, serviceId: 3, name: 'Controller Repair', price: 999, oldPrice: 1499, image: '/assets/products/shop.png' },
//         { id: 4, serviceId: 4, name: 'Charger Repair', price: 799, oldPrice: 1299, image: '/assets/products/shop.png' },
//         { id: 5, serviceId: 5, name: 'BMS Repair', price: 899, oldPrice: 1499, image: '/assets/products/shop.png' },
//         { id: 6, serviceId: 6, name: 'Wiring Harness', price: 599, oldPrice: 999, image: '/assets/products/shop.png' },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-3">Our EV Products ⚡</h2>
//             <p className="text-gray-600">High-quality EV components and accessories</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
//                 <div className="w-full h-48 bg-gray-200"></div>
//                 <div className="p-4">
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//                   <div className="flex gap-2">
//                     <div className="h-10 bg-gray-200 rounded flex-1"></div>
//                     <div className="h-10 bg-gray-200 rounded flex-1"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 
//             data-aos="fade-up" 
//             className="text-3xl md:text-4xl font-bold mb-3"
//           >
//             Our EV Products ⚡
//           </h2>
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="100"
//             className="text-gray-600"
//           >
//             High-quality EV components and accessories
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product, index) => (
//             <div
//               key={product.id}
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//             >
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductsSection





// import React from 'react'
// import ProductCard from '../common/ProductCard'

// const products = [
//   { id: 1, name: 'Battery Repair', price: 1499, oldPrice: 2499, image: '/assets/products/shop.png' },
//   { id: 2, name: 'Motor Repair', price: 1299, oldPrice: 1999, image: '/assets/products/shop.png' },
//   { id: 3, name: 'Controller Repair', price: 999, oldPrice: 1499, image: '/assets/products/shop.png' },
//   { id: 4, name: 'Charger Repair', price: 799, oldPrice: 1299, image: '/assets/products/shop.png' },
//   { id: 5, name: 'BMS Repair', price: 899, oldPrice: 1499, image: '/assets/products/shop.png' },
//   { id: 6, name: 'Wiring Harness', price: 599, oldPrice: 999, image: '/assets/products/shop.png' },
// ]

// const ProductsSection = () => {
//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 
//             data-aos="fade-up" 
//             className="text-3xl md:text-4xl font-bold mb-3"
//           >
//             Our EV Products ⚡
//           </h2>
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="100"
//             className="text-gray-600"
//           >
//             High-quality EV components and accessories
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product, index) => (
//             <div
//               key={product.id}
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//             >
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductsSection