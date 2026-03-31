// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useProductCart } from '../context/ProductCartContext'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { addToCart } = useProductCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://reparo24.com/web/api/get_all_products')
      const data = await response.json()
      console.log('Product Details Response:', data)
      
      if (data.success && data.data) {
        const foundProduct = data.data.find(p => p._id === id)
        
        if (foundProduct) {
          const productImages = [
            foundProduct.image ? `https://reparo24.com/uploads/products/${foundProduct.image}` : '/assets/products/shop.png',
            foundProduct.image ? `https://reparo24.com/uploads/products/${foundProduct.image}` : '/assets/products/shop.png',
            foundProduct.image ? `https://reparo24.com/uploads/products/${foundProduct.image}` : '/assets/products/shop.png'
          ]
          
          setProduct({
            id: foundProduct._id,
            name: foundProduct.product_name || foundProduct.sku_code || 'Product',
            price: foundProduct.sale_price_after_gst || foundProduct.sale_price || 0,
            originalPrice: foundProduct.sale_price || 0,
            description: foundProduct.description || 'High-quality product',
            features: [
              { title: foundProduct.model ? `Model: ${foundProduct.model}` : 'Premium Quality' },
              { title: foundProduct.sku_code ? `SKU: ${foundProduct.sku_code}` : 'Genuine Product' },
              { title: '1 Year Warranty' },
              { title: 'Free Delivery' }
            ],
            images: productImages,
            category: foundProduct.category_id?.name || 'Product',
            sku_code: foundProduct.sku_code,
            model: foundProduct.model
          })
        } else {
          navigate('/shop')
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      type: 'product'
    }, quantity)
    
    alert(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      type: 'product'
    }, quantity)
    
    navigate('/product-cart')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="gradient-animated text-white px-6 py-2 rounded-lg">
          Back to Shop
        </button>
      </div>
    )
  }

  const discountPercent = product.originalPrice && product.price && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <section className="product-detail py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="lg:w-1/2">
            <div className="main-img-box bg-gray-100 rounded-2xl p-8 text-center">
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full max-w-md mx-auto object-contain h-80"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-3 justify-center">
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {product.name} ⚡
            </h2>

            {/* PRICE */}
            <div className="price-box mb-3">
              <span className="new-price text-2xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="old-price text-gray-400 line-through text-lg ml-2">₹{product.originalPrice}</span>
                  <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 mb-4">
              {product.description}
            </p>

            {/* FEATURES */}
            <ul className="features list-none p-0 mb-4">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700 mb-2">
                  <span className="text-primary">✔</span> {feature.title}
                </li>
              ))}
            </ul>

            {/* QTY BOX */}
            <div className="qty-box flex items-center gap-3 mt-3">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center"
              >
                -
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:gradient-animated hover:text-white transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION BOX */}
        <div className="product-description-box mt-4 p-4 bg-gray-50 rounded-xl">
          <h5 className="font-bold text-lg mb-3">Product Description ⚡</h5>
          <p className="text-gray-500">
            {product.description}
          </p>
        </div>

        {/* KEY FEATURES BOX */}
        <div className="product-features-box mt-4 p-4 bg-gray-50 rounded-xl">
          <h5 className="font-bold text-lg mb-3">Key Features</h5>
          <ul className="feature-list grid grid-cols-1 md:grid-cols-2 gap-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="text-primary">✔</span> {feature.title}
              </li>
            ))}
          </ul>
        </div>

        {/* WHY CHOOSE REPARO BOX */}
        <div className="product-highlights-box mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h5 className="font-bold text-lg mb-3">Why Choose Reparo?</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Quality Products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Genuine Parts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Fast Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span> Best Prices
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails







// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllServices, addToCartAPI } from '../services/api'
// // import { addToCart } from '../store/slices/cartSlice'
// import { useCart } from '../context/CartContext'

// const ProductDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { isAuthenticated } = useSelector((state) => state.auth)
  
//   const [product, setProduct] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)
//   const [addingToCart, setAddingToCart] = useState(false)
//   const [activeImage, setActiveImage] = useState(0)
//   const { addToCart } = useCart()

//   useEffect(() => {
//     fetchProductDetails()
//   }, [id])

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true)
//       const response = await getAllServices()
//       console.log('API Response:', response)
      
//       if (response.success && response.data) {
//         const foundProduct = response.data.find(service => service._id === id)
        
//         if (foundProduct) {
//           // Create multiple images (using same image for thumbnails)
//           const productImages = [
//             foundProduct.image || '/assets/products/shop.png',
//             foundProduct.image || '/assets/products/shop.png',
//             foundProduct.image || '/assets/products/shop.png'
//           ]
          
//           setProduct({
//             id: foundProduct._id,
//             serviceId: foundProduct._id,
//             name: foundProduct.title,
//             price: foundProduct.offer_price || foundProduct.price,
//             originalPrice: foundProduct.price,
//             description: foundProduct.features?.[0]?.title || 'Complete EV service with advanced diagnostics, professional repair, and quality assurance. Fast doorstep service.',
//             features: foundProduct.features || [],
//             images: productImages,
//             category: foundProduct.servicecategory_id?.name || 'Service',
//             city_id: foundProduct.city_id || []
//           })
//         } else {
//           console.log('Product not found with ID:', id)
//           navigate('/shop')
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error)
//       navigate('/shop')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleQuantityChange = (delta) => {
//     const newQuantity = quantity + delta
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity)
//     }
//   }

//   // const handleBuyNow = async () => {
//   //   if (!isAuthenticated) {
//   //     sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//   //     navigate('/login')
//   //     return
//   //   }

//   //   setAddingToCart(true)
//   //   try {
//   //     const response = await addToCartAPI(product.serviceId, quantity)
      
//   //     if (response.success) {
//   //       dispatch(addToCart({
//   //         id: product.serviceId,
//   //         name: product.name,
//   //         price: product.price,
//   //         quantity: quantity,
//   //         image: product.images[0]
//   //       }))
//   //       navigate('/cart')
//   //     }
//   //   } catch (error) {
//   //     console.error('Buy Now error:', error)
//   //     alert('Failed to process. Please try again.')
//   //   } finally {
//   //     setAddingToCart(false)
//   //   }
//   // }

//   // Update handleBuyNow function in ProductDetails.jsx
  
  
//   // const handleBuyNow = async () => {
//   //   if (!isAuthenticated) {
//   //     sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//   //     navigate('/login')
//   //     return
//   //   }

//   //   // Store service data in localStorage for checkout
//   //   const serviceData = {
//   //     id: product.serviceId,
//   //     serviceId: product.serviceId,
//   //     name: product.name,
//   //     price: product.price,
//   //     originalPrice: product.originalPrice,
//   //     image: product.images[0]
//   //   }
    
//   //   localStorage.setItem('checkout_service', JSON.stringify(serviceData))
//   //   navigate('/checkout')
//   // }

//   const handleBuyNow = () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     // Add to frontend cart
//     addToCart({
//       id: product.serviceId,
//       serviceId: product.serviceId,
//       name: product.name,
//       price: product.price,
//       originalPrice: product.originalPrice,
//       quantity: quantity,
//       image: product.images[0]
//     })
    
//     // Navigate to cart page
//     navigate('/cart')
//   }

//   const handleAddToCart = async () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     setAddingToCart(true)
//     try {
//       const response = await addToCartAPI(product.serviceId, quantity)
      
//       if (response.success) {
//         dispatch(addToCart({
//           id: product.serviceId,
//           name: product.name,
//           price: product.price,
//           quantity: quantity,
//           image: product.images[0]
//         }))
//         alert(`${product.name} added to cart successfully!`)
//       } else {
//         alert(response.message || 'Failed to add to cart')
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error)
//       alert('Failed to add to cart. Please try again.')
//     } finally {
//       setAddingToCart(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading product details...</p>
//       </div>
//     )
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
//         <button onClick={() => navigate('/shop')} className="gradient-animated text-white px-6 py-2 rounded-lg">
//           Back to Shop
//         </button>
//       </div>
//     )
//   }

//   const discountPercent = product.originalPrice && product.price && product.originalPrice > product.price
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0

//   return (
//     <section className="product-detail py-5">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col lg:flex-row gap-8">
          
//           {/* LEFT: IMAGE SECTION */}
//           <div className="lg:w-1/2">
//             <div className="main-img-box bg-gray-100 rounded-2xl p-8 text-center">
//               <img 
//                 src={product.images[activeImage]} 
//                 alt={product.name}
//                 className="img-fluid main-product-img w-full max-w-md mx-auto object-contain h-80"
//               />
//             </div>

//             {/* THUMBNAILS */}
//             <div className="flex gap-3 mt-3 justify-center">
//               {product.images.map((img, idx) => (
//                 <img 
//                   key={idx}
//                   src={img} 
//                   alt={`Thumbnail ${idx + 1}`}
//                   onClick={() => setActiveImage(idx)}
//                   className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
//                     activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: DETAILS SECTION */}
//           <div className="lg:w-1/2">
//             <h2 className="text-2xl md:text-3xl font-bold mb-2">
//               {product.name} ⚡
//             </h2>

//             {/* PRICE */}
//             <div className="price-box mb-3">
//               <span className="new-price text-2xl font-bold text-primary">₹{product.price}</span>
//               {product.originalPrice && product.originalPrice > product.price && (
//                 <>
//                   <span className="old-price text-gray-400 line-through text-lg ml-2">₹{product.originalPrice}</span>
//                   <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
//                 </>
//               )}
//             </div>

//             {/* DESCRIPTION */}
//             <p className="text-gray-500 mb-4">
//               {product.description}
//             </p>

//             {/* FEATURES */}
//             <ul className="features list-none p-0 mb-4">
//               {product.features && product.features.length > 0 ? (
//                 product.features.map((feature, idx) => (
//                   <li key={idx} className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> {feature.title}
//                   </li>
//                 ))
//               ) : (
//                 <>
//                   <li className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> Battery Health Check
//                   </li>
//                   <li className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> BMS Repair & Reset
//                   </li>
//                   <li className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> Cell Replacement
//                   </li>
//                   <li className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> 7 Days Warranty
//                   </li>
//                 </>
//               )}
//             </ul>

//             {/* QTY BOX */}
//             <div className="qty-box flex items-center gap-3 mt-3">
//               <button 
//                 onClick={() => handleQuantityChange(-1)}
//                 className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center"
//               >
//                 -
//               </button>
//               <span id="qty" className="text-lg font-semibold w-8 text-center">{quantity}</span>
//               <button 
//                 onClick={() => handleQuantityChange(1)}
//                 className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center"
//               >
//                 +
//               </button>
//             </div>

//             {/* BUTTONS */}
//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleBuyNow}
//                 disabled={addingToCart}
//                 className="flex-1 gradient-animated text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
//               >
//                 {addingToCart ? 'Processing...' : 'Buy Now'}
//               </button>
//               {/* <button
//                 onClick={handleAddToCart}
//                 disabled={addingToCart}
//                 className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:gradient-animated hover:text-white transition disabled:opacity-50"
//               >
//                 Add to Cart
//               </button> */}
//             </div>
//           </div>
//         </div>

//         {/* SERVICE DESCRIPTION BOX */}
//         <div className="product-description-box mt-4 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Service Description ⚡</h5>
//           <p className="text-gray-500">
//             Get your EV back to peak performance with our expert {product.name.toLowerCase()} service.
//             We provide advanced diagnostics, professional repair, and quality assurance using
//             high-quality components. Our trained technicians ensure safe, reliable,
//             and long-lasting performance with quick doorstep service.
//           </p>
//         </div>

//         {/* KEY FEATURES BOX */}
//         <div className="product-features-box mt-4 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Key Features</h5>
//           <ul className="feature-list grid grid-cols-1 md:grid-cols-2 gap-2">
//             <li className="flex items-center gap-2 text-gray-700">
//               <span className="text-primary">✔</span> Battery Diagnostics & Health Check
//             </li>
//             <li className="flex items-center gap-2 text-gray-700">
//               <span className="text-primary">✔</span> BMS Repair & Calibration
//             </li>
//             <li className="flex items-center gap-2 text-gray-700">
//               <span className="text-primary">✔</span> Cell Replacement Support
//             </li>
//             <li className="flex items-center gap-2 text-gray-700">
//               <span className="text-primary">✔</span> 7 Days Service Warranty
//             </li>
//             <li className="flex items-center gap-2 text-gray-700">
//               <span className="text-primary">✔</span> Doorstep EV Service
//             </li>
//           </ul>
//         </div>

//         {/* WHY CHOOSE REPARO BOX */}
//         <div className="product-highlights-box mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Why Choose Reparo?</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Expert Technicians
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Genuine Spare Parts
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Fast Service
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Affordable Pricing
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductDetails