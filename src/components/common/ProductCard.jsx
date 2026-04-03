// src/components/common/ProductCard.jsx

// src/components/common/ProductCard.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useProductCart } from '../../context/ProductCartContext'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { addToCart } = useProductCart()
  const [adding, setAdding] = React.useState(false)

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.oldPrice,
      image: product.image,
      type: 'product',
      action: 'add_to_cart'  // ✅ Store which action to perform
    }

    if (!isAuthenticated) {
      // ✅ Save product data and intended action
      sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    setAdding(true)
    addToCart(productData, 1)
    setTimeout(() => {
      setAdding(false)
    }, 500)
  }

  const handleBuyNow = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.oldPrice,
      image: product.image,
      type: 'product',
      action: 'buy_now'  // ✅ Store which action to perform
    }

    if (!isAuthenticated) {
      // ✅ Save product data and intended action
      sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    addToCart(productData, 1)
    navigate('/product-cart')
  }

  const discountPercent = product.oldPrice && product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image || '/assets/products/shop.png'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h6>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold text-xl">
            ₹{product.price}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-gray-400 line-through text-sm">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 text-center py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard









// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useProductCart } from '../../context/ProductCartContext'

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useProductCart()
//   const [adding, setAdding] = React.useState(false)

//   const handleAddToCart = () => {

//     const data = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       originalPrice: product.oldPrice,
//       image: product.image,
//       type: 'product'
//     }


//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       sessionStorage.setItem('carProductRedirectAfterLogin', data)
//       navigate('/login')
//       return
//     }

//     setAdding(true)
//     addToCart(data, 1)
    
    
    
//     setTimeout(() => {
//       setAdding(false)
//       // alert(`${product.name} added to cart!`)
//     }, 500)
//   }

//   const handleBuyNow = () => {
//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       originalPrice: product.oldPrice,
//       image: product.image,
//       type: 'product'
//     }, 1)
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
    
//     navigate('/product-cart')
//   }

//   const discountPercent = product.oldPrice && product.price 
//     ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//     : 0

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
//       <div className="relative overflow-hidden">
//         <img 
//           src={product.image || '/assets/products/shop.png'} 
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {discountPercent > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//             {discountPercent}% OFF
//           </span>
//         )}
//       </div>
      
//       <div className="p-4">
//         {/* Title with link to product details */}
//         <Link to={`/product/${product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">
//             ₹{product.price}
//           </span>
//           {product.oldPrice && product.oldPrice > product.price && (
//             <span className="text-gray-400 line-through text-sm">
//               ₹{product.oldPrice}
//             </span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <button
//             onClick={handleAddToCart}
//             disabled={adding}
//             className="flex-1 text-center py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition disabled:opacity-50"
//           >
//             {adding ? 'Adding...' : 'Add to Cart'}
//           </button>
//           <button
//             onClick={handleBuyNow}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard





// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useProductCart } from '../../context/ProductCartContext'

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useProductCart()
//   const [adding, setAdding] = React.useState(false)

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     setAdding(true)
//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.sale_price_after_gst || product.price,
//       originalPrice: product.sale_price || product.oldPrice,
//       image: product.image || '/assets/products/shop.png',
//       type: 'product'
//     }, 1)
    
//     setTimeout(() => {
//       setAdding(false)
//       alert(`${product.name} added to cart!`)
//     }, 500)
//   }

//   const discountPercent = product.oldPrice && product.price 
//     ? Math.round(((product.oldPrice - (product.price)) / product.oldPrice) * 100)
//     : 0

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
//       <div className="relative overflow-hidden">
//         <img 
//           src={product.image || '/assets/products/shop.png'} 
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {discountPercent > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//             {discountPercent}% OFF
//           </span>
//         )}
//       </div>
      
//       <div className="p-4">
//         <Link to={`/product/${product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">
//             ₹{product.price}
//           </span>
//           {product.oldPrice && product.oldPrice > product.price && (
//             <span className="text-gray-400 line-through text-sm">
//               ₹{product.oldPrice}
//             </span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <button
//             onClick={handleAddToCart}
//             disabled={adding}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
//           >
//             {adding ? 'Adding...' : 'Add to Cart'}
//           </button>
          
//           <Link
//             to={`/product/${product.id}`}
//             className="flex-1 text-center py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard


// commented while work for product // its working for service
// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useCart } from '../../context/CartContext'

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const { addToCart } = useCart()
//   const [loading, setLoading] = React.useState(false)

//   const handleBuyNow = () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }
    
//     // Add to frontend cart
//     addToCart({
//       id: product.serviceId || product.id,
//       serviceId: product.serviceId || product.id,
//       name: product.name,
//       price: product.offerPrice || product.price,
//       originalPrice: product.oldPrice || product.price,
//       quantity: 1,
//       image: product.image
//     })
    
//     // Navigate to cart page
//     navigate('/cart')
//   }

//   const discountPercent = product.oldPrice && product.price 
//     ? Math.round(((product.oldPrice - (product.offerPrice || product.price)) / product.oldPrice) * 100)
//     : 0

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
//       <div className="relative overflow-hidden">
//         <img 
//           src={product.image || '/assets/products/shop.png'} 
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {discountPercent > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//             {discountPercent}% OFF
//           </span>
//         )}
//       </div>
      
//       <div className="p-4">
//         <Link to={`/product/${product.serviceId || product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">
//             ₹{product.offerPrice || product.price}
//           </span>
//           {(product.oldPrice || product.price) && (product.offerPrice) && (
//             <span className="text-gray-400 line-through text-sm">
//               ₹{product.oldPrice || product.price}
//             </span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <button
//             onClick={handleBuyNow}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </button>
          
//           <Link
//             to={`/product/${product.serviceId || product.id}`}
//             className="flex-1 text-center py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard










// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { addToCartAPI } from '../../services/api'
// import { addToCart as addToCartAction } from '../../store/slices/cartSlice'

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch()
//   const { isAuthenticated } = useSelector((state) => state.auth)
//   const [loading, setLoading] = React.useState(false)

//   const handleAddToCart = async () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       window.location.href = '/login'
//       return
//     }
    
//     setLoading(true)
//     try {
//       const response = await addToCartAPI(product.serviceId || product.id, 1)
      
//       if (response.success) {
//         dispatch(addToCartAction({
//           id: product.serviceId || product.id,
//           name: product.name,
//           price: product.offerPrice || product.price,
//           quantity: 1,
//           image: product.image
//         }))
//         alert(`${product.name} added to cart successfully!`)
//       } else {
//         alert(response.message || 'Failed to add to cart')
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error)
//       alert('Failed to add to cart. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
//       <img 
//         src={product.image || '/assets/products/shop.png'} 
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
      
//       <div className="p-4">
//         <Link to={`/product/${product.serviceId || product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">
//             ₹{product.offerPrice || product.price}
//           </span>
//           {product.offerPrice && (
//             <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <Link 
//             to={`/product/${product.serviceId || product.id}`}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </Link>
//           <button
//             onClick={handleAddToCart}
//             disabled={loading}
//             className="flex-1 py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition disabled:opacity-50"
//           >
//             {loading ? 'Adding...' : 'View Details'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard








// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { addToCartAPI } from '../../services/api'
// import { addToCart as addToCartAction } from '../../store/slices/cartSlice'

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch()
//   const { isAuthenticated } = useSelector((state) => state.auth)

//   const handleAddToCart = async () => {
//     if (!isAuthenticated) {
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       window.location.href = '/login'
//       return
//     }
    
//     try {
//       // Call API to add to cart
//       const response = await addToCartAPI(product.serviceId || product.id, 1)
      
//       if (response.success) {
//         // Update Redux store
//         dispatch(addToCartAction({
//           id: product.serviceId || product.id,
//           name: product.name,
//           price: product.originalPrice || product.price,
//           quantity: 1,
//           image: product.image
//         }))
//         alert(`${product.name} added to cart successfully!`)
//       } else {
//         alert(response.message || 'Failed to add to cart')
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error)
//       alert('Failed to add to cart. Please try again.')
//     }
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
//       <img 
//         src={product.image || '/assets/products/shop.png'} 
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
      
//       <div className="p-4">
//         <Link to={`/product/${product.serviceId || product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">₹{product.price}</span>
//           {product.oldPrice && (
//             <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <Link 
//             to={`/product/${product.serviceId || product.id}`}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </Link>
//           <button
//             onClick={handleAddToCart}
//             className="flex-1 py-2 rounded-md border border-primary text-primary font-semibold hover:gradient-animated hover:text-white transition"
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard







// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { addToCart } from '../../store/slices/cartSlice'

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch()
//   const { isAuthenticated } = useSelector((state) => state.auth)

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       alert('Please login first to add items to cart')
//       window.location.href = '/login'
//       return
//     }
//     dispatch(addToCart(product))
//     alert(`${product.name} added to cart!`)
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
//       <img 
//         src={product.image || '/assets/products/shop.png'} 
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
      
//       <div className="p-4">
//         <Link to={`/product/${product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">₹{product.price}</span>
//           {product.oldPrice && (
//             <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <Link 
//             to={`/product/${product.id}`}
//             className="flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </Link>
//           <button
//             onClick={handleAddToCart}
//             className="flex-1 py-2 rounded-md gradient-animated text-white font-semibold hover:opacity-90 transition"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard






// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { addToCart } from '../../store/slices/cartSlice'

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch()
//   const { isAuthenticated } = useSelector((state) => state.auth)

//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       alert('Please login first to add items to cart')
//       window.location.href = '/login'
//       return
//     }
//     dispatch(addToCart(product))
//     alert(`${product.name} added to cart!`)
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
//       <img 
//         src={product.image || '/assets/products/shop.png'} 
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
      
//       <div className="p-4">
//         <Link to={`/product/${product.id}`}>
//           <h6 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
//             {product.name}
//           </h6>
//         </Link>

//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-primary font-bold text-xl">₹{product.price}</span>
//           {product.oldPrice && (
//             <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
//           )}
//         </div>

//         <div className="flex gap-2 mt-2">
//           <Link 
//             to={`/product/${product.id}`}
//             className="flex-1 text-center py-2 rounded-md bg-gradient-to-r from-primary to-yellow-400 text-dark font-semibold hover:opacity-90 transition"
//           >
//             Buy Now
//           </Link>
//           <button
//             onClick={handleAddToCart}
//             className="flex-1 py-2 rounded-md bg-gradient-to-r from-primary to-yellow-400 text-dark font-semibold hover:opacity-90 transition"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard