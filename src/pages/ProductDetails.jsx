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
  const [stockImageUrl, setStockImageUrl] = useState('')

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://test.reparo24.com/web/api/get_all_products')
      const data = await response.json()
      console.log('Product Details Response:', data)
      
      if (data.success && data.data) {
        const foundProduct = data.data.find(p => p._id === id)
        
        if (foundProduct) {
          if (data.stock_image_url) {
            setStockImageUrl(data.stock_image_url)
          }
          
          const productImages = foundProduct.images && foundProduct.images.length > 0
            ? foundProduct.images.map(img => {
                const baseUrl = data.stock_image_url || 'https://test.reparo24.com/uploads/stock/'
                const cleanBaseUrl = baseUrl.replace('//uploads', '/uploads')
                return `${cleanBaseUrl}${img}`
              })
            : ['/assets/products/shop.png']

          setProduct({
            id: foundProduct._id,
            name: foundProduct.product_name || foundProduct.sku_code || 'Product',
            price: foundProduct.sale_price || 0,
            originalPrice: foundProduct.sale_price_after_gst || foundProduct.sale_price || 0,
            description: foundProduct.description || 'High-quality product',
            shortDescription: foundProduct.short_description || '',
            features: [
              foundProduct.model && { title: `Model: ${foundProduct.model}` },
              foundProduct.sku_code && { title: `SKU: ${foundProduct.sku_code}` },
              foundProduct.hsn_code && { title: `HSN Code: ${foundProduct.hsn_code}` },
              foundProduct.business && { title: `Business: ${foundProduct.business}` },
            ].filter(Boolean),
            images: productImages,
            allImages: foundProduct.images || [],
            category: foundProduct.category_id?.name || 'Product',
            subcategory: foundProduct.subcategory_id?.name || '',
            sku_code: foundProduct.sku_code,
            model: foundProduct.model,
            hsn_code: foundProduct.hsn_code,
            business: foundProduct.business,
            quantity: foundProduct.quantity || 0,
            purchase_price: foundProduct.purchase_price,
          })
        } else {
          navigate('/products')
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = () => {
    if (product?.images && product.images.length > 0 && product.images[activeImage]) {
      return product.images[activeImage]
    }
    return '/assets/products/shop.png'
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 999)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      images: product.allImages,
      stockImageUrl: stockImageUrl,
      type: 'product',
      action: 'add_to_cart'
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    addToCart(productData, quantity)
    
    const toast = document.createElement('div')
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up'
    toast.textContent = `${product.name} added to cart!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const handleBuyNow = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      images: product.allImages,
      stockImageUrl: stockImageUrl,
      type: 'product',
      action: 'buy_now'
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    
    addToCart(productData, quantity)
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
        <div className="text-6xl mb-4">🔍</div>
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

  const isOutOfStock = product.quantity === 0

  return (
    <section className="product-detail py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: IMAGE SECTION - FULL STRETCH */}
          <div className="lg:w-5/12">
            {/* ✅ Fixed size container with full stretch image */}
            <div className="relative overflow-hidden bg-gray-100 rounded-xl w-full">
              <div className="w-full h-[280px] md:h-[320px]">
                <img 
                  src={getProductImage()} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/products/shop.png'
                  }}
                />
              </div>
            </div>

            {/* THUMBNAILS */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative overflow-hidden rounded-lg cursor-pointer border-2 transition-all w-14 h-14 md:w-16 md:h-16 ${
                      activeImage === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/products/shop.png'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:w-7/12">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {product.name} ⚡
            </h2>

            {/* PRICE */}
            <div className="price-box mb-3">
              <span className="new-price text-2xl font-bold text-primary">₹{product.price}</span>
              {/* {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="old-price text-gray-400 line-through text-lg ml-2">₹{product.originalPrice}</span>
                  <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
                </>
              )} */}
            </div>

            {/* Stock Status */}
            <div className="mb-3">
              {isOutOfStock ? (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              ) : (
                <span className="text-green-500 font-semibold">In Stock ({product.quantity} available)</span>
              )}
            </div>

            {/* DESCRIPTION */}
            {/* <p className="text-gray-600 text-sm mb-3">
              {product.description}
            </p> */}

            {/* FEATURES */}
            {/* {product.features.length > 0 && (
              <ul className="features list-none p-0 mb-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm mb-1">
                    <span className="text-primary text-sm">✔</span> {feature.title}
                  </li>
                ))}
              </ul>
            )} */}

            {/* QTY BOX */}
            {!isOutOfStock && (
              <div className="qty-box flex items-center gap-3 mt-3">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-base font-semibold w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 border-2 border-primary text-primary py-2 px-4 rounded-lg font-semibold transition text-sm ${
                  isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:gradient-animated hover:text-white'
                }`}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 gradient-animated text-white py-2 px-4 rounded-lg font-semibold transition text-sm ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION BOX */}
        <div className="product-description-box mt-6 p-4 bg-gray-50 rounded-xl">
          <h5 className="font-bold text-base mb-2">Product Description ⚡</h5>
          <p className="text-gray-600 text-sm">
            {product.description}
          </p>
        </div>

        {/* PRODUCT SPECIFICATIONS */}
        <div className="product-specifications-box mt-3 p-4 bg-gray-50 rounded-xl">
          <h5 className="font-bold text-base mb-2">Product Specifications</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {product.model && (
              <div className="flex">
                <span className="w-28 text-gray-500">Model:</span>
                <span>{product.model}</span>
              </div>
            )}
            {product.sku_code && (
              <div className="flex">
                <span className="w-28 text-gray-500">SKU Code:</span>
                <span>{product.sku_code}</span>
              </div>
            )}
            {product.hsn_code && (
              <div className="flex">
                <span className="w-28 text-gray-500">HSN Code:</span>
                <span>{product.hsn_code}</span>
              </div>
            )}
            {product.business && (
              <div className="flex">
                <span className="w-28 text-gray-500">Business:</span>
                <span>{product.business}</span>
              </div>
            )}
            {product.category && (
              <div className="flex">
                <span className="w-28 text-gray-500">Category:</span>
                <span>{product.category}</span>
              </div>
            )}
            {product.subcategory && (
              <div className="flex">
                <span className="w-28 text-gray-500">Subcategory:</span>
                <span>{product.subcategory}</span>
              </div>
            )}
          </div>
        </div>

        {/* WHY CHOOSE REPARO BOX */}
        <div className="product-highlights-box mt-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h5 className="font-bold text-base mb-2">Why Choose Reparo?</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-base">⚡</span> Quality Products
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-base">⚡</span> Genuine Parts
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-base">⚡</span> Fast Delivery
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-base">⚡</span> Best Prices
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
// import { useSelector } from 'react-redux'
// import { useProductCart } from '../context/ProductCartContext'

// const ProductDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useProductCart()
  
//   const [product, setProduct] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)
//   const [activeImage, setActiveImage] = useState(0)
//   const [stockImageUrl, setStockImageUrl] = useState('')

//   useEffect(() => {
//     fetchProductDetails()
//   }, [id])

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('https://test.reparo24.com/web/api/get_all_products')
//       const data = await response.json()
//       console.log('Product Details Response:', data)
      
//       if (data.success && data.data) {
//         const foundProduct = data.data.find(p => p._id === id)
        
//         if (foundProduct) {
//           if (data.stock_image_url) {
//             setStockImageUrl(data.stock_image_url)
//           }
          
//           const productImages = foundProduct.images && foundProduct.images.length > 0
//             ? foundProduct.images.map(img => {
//                 const baseUrl = data.stock_image_url || 'https://test.reparo24.com/uploads/stock/'
//                 const cleanBaseUrl = baseUrl.replace('//uploads', '/uploads')
//                 return `${cleanBaseUrl}${img}`
//               })
//             : ['/assets/products/shop.png']

//           setProduct({
//             id: foundProduct._id,
//             name: foundProduct.product_name || foundProduct.sku_code || 'Product',
//             price: foundProduct.sale_price || 0,
//             // originalPrice: foundProduct.sale_price_after_gst || foundProduct.sale_price || 0,
//             description: foundProduct.description || 'High-quality product',
//             shortDescription: foundProduct.short_description || '',
//             features: [
//               foundProduct.model && { title: `Model: ${foundProduct.model}` },
//               foundProduct.sku_code && { title: `SKU: ${foundProduct.sku_code}` },
//               foundProduct.hsn_code && { title: `HSN Code: ${foundProduct.hsn_code}` },
//               foundProduct.business && { title: `Business: ${foundProduct.business}` },
//             ].filter(Boolean),
//             images: productImages,
//             allImages: foundProduct.images || [],
//             category: foundProduct.category_id?.name || 'Product',
//             subcategory: foundProduct.subcategory_id?.name || '',
//             sku_code: foundProduct.sku_code,
//             model: foundProduct.model,
//             hsn_code: foundProduct.hsn_code,
//             business: foundProduct.business,
//             quantity: foundProduct.quantity || 0,
//             purchase_price: foundProduct.purchase_price,
//           })
//         } else {
//           navigate('/products')
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
//     if (newQuantity >= 1 && newQuantity <= (product?.quantity || 999)) {
//       setQuantity(newQuantity)
//     }
//   }

//   const handleAddToCart = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       // originalPrice: product.originalPrice,
//       image: product.images[0],
//       images: product.allImages,
//       stockImageUrl: stockImageUrl,
//       type: 'product',
//       action: 'add_to_cart'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     addToCart(productData, quantity)
    
//     const toast = document.createElement('div')
//     toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up'
//     toast.textContent = `${product.name} added to cart!`
//     document.body.appendChild(toast)
//     setTimeout(() => toast.remove(), 3000)
//   }

//   const handleBuyNow = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       // originalPrice: product.originalPrice,
//       image: product.images[0],
//       images: product.allImages,
//       stockImageUrl: stockImageUrl,
//       type: 'product',
//       action: 'buy_now'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     addToCart(productData, quantity)
//     navigate('/product-cart')
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
//         <div className="text-6xl mb-4">🔍</div>
//         <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
//         <button onClick={() => navigate('/shop')} className="gradient-animated text-white px-6 py-2 rounded-lg">
//           Back to Shop
//         </button>
//       </div>
//     )
//   }

//   // const discountPercent = product.originalPrice && product.price && product.originalPrice > product.price
//   //   ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//   //   : 0

//   const isOutOfStock = product.quantity === 0

//   return (
//     <section className="product-detail py-5">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col lg:flex-row gap-6">
          
//           {/* LEFT: IMAGE SECTION - REDUCED SIZE */}
//           <div className="lg:w-5/12">
//             <div className="main-img-box bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center aspect-square">
//               <img 
//                 src={product.images[activeImage] || '/assets/products/shop.png'} 
//                 alt={product.name}
//                 className="w-full h-full object-contain p-3"
//                 onError={(e) => {
//                   e.target.src = '/assets/products/shop.png'
//                 }}
//               />
//             </div>

//             {/* THUMBNAILS */}
//             {product.images.length > 1 && (
//               <div className="flex gap-2 mt-3 justify-center flex-wrap">
//                 {product.images.map((img, idx) => (
//                   <div 
//                     key={idx}
//                     onClick={() => setActiveImage(idx)}
//                     className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
//                       activeImage === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300'
//                     }`}
//                   >
//                     <img 
//                       src={img} 
//                       alt={`Thumbnail ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = '/assets/products/shop.png'
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT: DETAILS SECTION - INCREASED SIZE */}
//           <div className="lg:w-7/12">
//             <h2 className="text-xl md:text-2xl font-bold mb-2">
//               {product.name} ⚡
//             </h2>

//             {/* PRICE */}
//             <div className="price-box mb-3">
//               <span className="new-price text-2xl font-bold text-primary">₹{product.price}</span>
//               {/* {product.originalPrice && product.originalPrice > product.price && (
//                 <>
//                   <span className="old-price text-gray-400 line-through text-lg ml-2">₹{product.originalPrice}</span>
//                   <span className="off bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{discountPercent}% OFF</span>
//                 </>
//               )} */}
//             </div>

//             {/* Stock Status */}
//             <div className="mb-3">
//               {isOutOfStock ? (
//                 <span className="text-red-500 font-semibold">Out of Stock</span>
//               ) : (
//                 <span className="text-green-500 font-semibold">In Stock ({product.quantity} available)</span>
//               )}
//             </div>

//             {/* QTY BOX */}
//             {!isOutOfStock && (
//               <div className="qty-box flex items-center gap-3 mt-3">
//                 <button 
//                   onClick={() => handleQuantityChange(-1)}
//                   disabled={quantity <= 1}
//                   className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   -
//                 </button>
//                 <span className="text-base font-semibold w-8 text-center">{quantity}</span>
//                 <button 
//                   onClick={() => handleQuantityChange(1)}
//                   disabled={quantity >= product.quantity}
//                   className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   +
//                 </button>
//               </div>
//             )}

//             {/* BUTTONS */}
//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={isOutOfStock}
//                 className={`flex-1 border-2 border-primary text-primary py-2 px-4 rounded-lg font-semibold transition text-sm ${
//                   isOutOfStock 
//                     ? 'opacity-50 cursor-not-allowed' 
//                     : 'hover:gradient-animated hover:text-white'
//                 }`}
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={isOutOfStock}
//                 className={`flex-1 gradient-animated text-white py-2 px-4 rounded-lg font-semibold transition text-sm ${
//                   isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
//                 }`}
//               >
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCT DESCRIPTION BOX */}
//         <div className="product-description-box mt-6 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-base mb-2">Product Description ⚡</h5>
//           <p className="text-gray-600 text-sm">
//             {product.description}
//           </p>
//         </div>

//         {/* PRODUCT SPECIFICATIONS */}
//         <div className="product-specifications-box mt-3 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-base mb-2">Product Specifications</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//             {product.model && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">Model:</span>
//                 <span>{product.model}</span>
//               </div>
//             )}
//             {product.sku_code && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">SKU Code:</span>
//                 <span>{product.sku_code}</span>
//               </div>
//             )}
//             {product.hsn_code && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">HSN Code:</span>
//                 <span>{product.hsn_code}</span>
//               </div>
//             )}
//             {product.business && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">Business:</span>
//                 <span>{product.business}</span>
//               </div>
//             )}
//             {product.category && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">Category:</span>
//                 <span>{product.category}</span>
//               </div>
//             )}
//             {product.subcategory && (
//               <div className="flex">
//                 <span className="w-28 text-gray-500">Subcategory:</span>
//                 <span>{product.subcategory}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* WHY CHOOSE REPARO BOX */}
//         <div className="product-highlights-box mt-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
//           <h5 className="font-bold text-base mb-2">Why Choose Reparo?</h5>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             <div className="flex items-center gap-1 text-sm">
//               <span className="text-base">⚡</span> Quality Products
//             </div>
//             <div className="flex items-center gap-1 text-sm">
//               <span className="text-base">⚡</span> Genuine Parts
//             </div>
//             <div className="flex items-center gap-1 text-sm">
//               <span className="text-base">⚡</span> Fast Delivery
//             </div>
//             <div className="flex items-center gap-1 text-sm">
//               <span className="text-base">⚡</span> Best Prices
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductDetails


// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useProductCart } from '../context/ProductCartContext'

// const ProductDetails = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useProductCart()
  
//   const [product, setProduct] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)
//   const [activeImage, setActiveImage] = useState(0)
//   const [stockImageUrl, setStockImageUrl] = useState('')

//   useEffect(() => {
//     fetchProductDetails()
//   }, [id])

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('https://test.reparo24.com/web/api/get_all_products')
//       const data = await response.json()
//       console.log('Product Details Response:', data)
      
//       if (data.success && data.data) {
//         const foundProduct = data.data.find(p => p._id === id)
        
//         if (foundProduct) {
//           // Set stock image URL from response
//           if (data.stock_image_url) {
//             setStockImageUrl(data.stock_image_url)
//           }
          
//           // Get all images from the product's images array
//           // const productImages = foundProduct.images && foundProduct.images.length > 0
//           //   ? foundProduct.images.map(img => `${data.stock_image_url || 'https://test.reparo24.com//uploads/stock/'}${img}`)
//           //   : ['/assets/products/shop.png']

//             const productImages = foundProduct.images && foundProduct.images.length > 0
//         ? foundProduct.images.map(img => {
//             // ✅ Fix double slash issue
//             const baseUrl = data.stock_image_url || 'https://test.reparo24.com/uploads/stock/'
//             const cleanBaseUrl = baseUrl.replace('//uploads', '/uploads')
//             return `${cleanBaseUrl}${img}`
//           })
//         : ['/assets/products/shop.png']

          
//           setProduct({
//             id: foundProduct._id,
//             name: foundProduct.product_name || foundProduct.sku_code || 'Product',
//             price: foundProduct.sale_price || 0,
//             originalPrice: foundProduct.sale_price_after_gst || foundProduct.sale_price || 0,
//             description: foundProduct.description || 'High-quality product',
//             shortDescription: foundProduct.short_description || '',
//             features: [
//               foundProduct.model && { title: `Model: ${foundProduct.model}` },
//               foundProduct.sku_code && { title: `SKU: ${foundProduct.sku_code}` },
//               foundProduct.hsn_code && { title: `HSN Code: ${foundProduct.hsn_code}` },
//               foundProduct.business && { title: `Business: ${foundProduct.business}` },
//               // { title: '1 Year Warranty' },
//               // { title: 'Free Delivery' }
//             ].filter(Boolean),
//             images: productImages,
//             allImages: foundProduct.images || [],
//             category: foundProduct.category_id?.name || 'Product',
//             subcategory: foundProduct.subcategory_id?.name || '',
//             sku_code: foundProduct.sku_code,
//             model: foundProduct.model,
//             hsn_code: foundProduct.hsn_code,
//             business: foundProduct.business,
//             quantity: foundProduct.quantity || 0,
//             purchase_price: foundProduct.purchase_price,
//             // margin: foundProduct.margin
//           })
//         } else {
//           navigate('/products')
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
//     if (newQuantity >= 1 && newQuantity <= (product?.quantity || 999)) {
//       setQuantity(newQuantity)
//     }
//   }

//   const handleAddToCart = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       originalPrice: product.originalPrice,
//       image: product.images[0],
//       images: product.allImages,
//       stockImageUrl: stockImageUrl,
//       type: 'product',
//       action: 'add_to_cart'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     addToCart(productData, quantity)
    
//     // Show success message
//     const toast = document.createElement('div')
//     toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up'
//     toast.textContent = `${product.name} added to cart!`
//     document.body.appendChild(toast)
//     setTimeout(() => toast.remove(), 3000)
//   }

//   const handleBuyNow = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       originalPrice: product.originalPrice,
//       image: product.images[0],
//       images: product.allImages,
//       stockImageUrl: stockImageUrl,
//       type: 'product',
//       action: 'buy_now'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     addToCart(productData, quantity)
//     navigate('/product-cart')
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
//         <div className="text-6xl mb-4">🔍</div>
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

//   const isOutOfStock = product.quantity === 0

//   return (
//     <section className="product-detail py-5">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col lg:flex-row gap-8">
          
//           {/* LEFT: IMAGE SECTION */}
//           {/* <div className="lg:w-1/2">
//             <div className="main-img-box bg-gray-100 rounded-2xl p-8 text-center max-h-[350px] flex items-center justify-center">
//               <img 
//                 src={product.images[activeImage] || '/assets/products/shop.png'} 
//                 alt={product.name}
//                 className="w-full max-w-md mx-auto object-contain "
//                 onError={(e) => {
//                   e.target.src = '/assets/products/shop.png'
//                 }}
//               />
//             </div> */}
//             <div className="lg:w-1/2">
//               <div className="main-img-box bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center aspect-square">
//                 <img 
//                   src={product.images[activeImage] || '/assets/products/shop.png'} 
//                   alt={product.name}
//                   className="w-full h-full object-contain p-4"
//                   onError={(e) => {
//                     e.target.src = '/assets/products/shop.png'
//                   }}
//                 />
//               </div>

//             {/* THUMBNAILS */}
//             {product.images.length > 1 && (
//               <div className="flex gap-3 mt-3 justify-center flex-wrap">
//                 {product.images.map((img, idx) => (
//                   <img 
//                     key={idx}
//                     src={img} 
//                     alt={`Thumbnail ${idx + 1}`}
//                     onClick={() => setActiveImage(idx)}
//                     className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
//                       activeImage === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300'
//                     }`}
//                     onError={(e) => {
//                       e.target.src = '/assets/products/shop.png'
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT: DETAILS SECTION */}
//           <div className="lg:w-1/2">
//             <h2 className="text-2xl md:text-3xl font-bold mb-2">
//               {product.name} ⚡
//             </h2>

//             {/* SKU and Category */}
//             {/* <div className="flex flex-wrap gap-3 mb-3 text-sm">
//               {product.sku_code && (
//                 <span className="text-gray-500">SKU: {product.sku_code}</span>
//               )}
//               {product.category && (
//                 <span className="text-gray-500">Category: {product.category}</span>
//               )}
//               {product.subcategory && (
//                 <span className="text-gray-500">Subcategory: {product.subcategory}</span>
//               )}
//             </div> */}

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

//             {/* Stock Status */}
//             <div className="mb-3">
//               {isOutOfStock ? (
//                 <span className="text-red-500 font-semibold">Out of Stock</span>
//               ) : (
//                 <span className="text-green-500 font-semibold">In Stock ({product.quantity} available)</span>
//               )}
//             </div>

//             {/* Short Description */}
//             {/* {product.shortDescription && (
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">{product.shortDescription}</p>
//               </div>
//             )} */}

//             {/* DESCRIPTION */}
//             {/* <p className="text-gray-600 mb-4">
//               {product.description}
//             </p> */}

//             {/* FEATURES */}
//             {/* {product.features.length > 0 && (
//               <ul className="features list-none p-0 mb-4">
//                 {product.features.map((feature, idx) => (
//                   <li key={idx} className="flex items-center gap-2 text-gray-700 mb-2">
//                     <span className="text-primary">✔</span> {feature.title}
//                   </li>
//                 ))}
//               </ul>
//             )} */}

//             {/* QTY BOX */}
//             {!isOutOfStock && (
//               <div className="qty-box flex items-center gap-3 mt-3">
//                 <button 
//                   onClick={() => handleQuantityChange(-1)}
//                   disabled={quantity <= 1}
//                   className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
//                 <button 
//                   onClick={() => handleQuantityChange(1)}
//                   disabled={quantity >= product.quantity}
//                   className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   +
//                 </button>
//               </div>
//             )}

//             {/* BUTTONS */}
//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={isOutOfStock}
//                 className={`flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold transition ${
//                   isOutOfStock 
//                     ? 'opacity-50 cursor-not-allowed' 
//                     : 'hover:gradient-animated hover:text-white'
//                 }`}
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={isOutOfStock}
//                 className={`flex-1 gradient-animated text-white py-2 rounded-lg font-semibold transition ${
//                   isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
//                 }`}
//               >
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCT DESCRIPTION BOX */}
//         <div className="product-description-box mt-8 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Product Description ⚡</h5>
//           <p className="text-gray-600">
//             {product.description}
//           </p>
//         </div>

//         {/* PRODUCT SPECIFICATIONS */}
//         <div className="product-specifications-box mt-4 p-4 bg-gray-50 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Product Specifications</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {product.model && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">Model:</span>
//                 <span>{product.model}</span>
//               </div>
//             )}
//             {product.sku_code && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">SKU Code:</span>
//                 <span>{product.sku_code}</span>
//               </div>
//             )}
//             {product.hsn_code && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">HSN Code:</span>
//                 <span>{product.hsn_code}</span>
//               </div>
//             )}
//             {product.business && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">Business:</span>
//                 <span>{product.business}</span>
//               </div>
//             )}
//             {product.category && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">Category:</span>
//                 <span>{product.category}</span>
//               </div>
//             )}
//             {product.subcategory && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">Subcategory:</span>
//                 <span>{product.subcategory}</span>
//               </div>
//             )}
//             {product.margin && (
//               <div className="flex">
//                 <span className="w-32 text-gray-500 font-medium">Margin:</span>
//                 <span>{product.margin}%</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* WHY CHOOSE REPARO BOX */}
//         <div className="product-highlights-box mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
//           <h5 className="font-bold text-lg mb-3">Why Choose Reparo?</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Quality Products
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Genuine Parts
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Fast Delivery
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xl">⚡</span> Best Prices
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductDetails