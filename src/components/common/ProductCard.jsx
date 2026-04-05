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

  // ✅ Get product image with correct URL
  const getProductImage = () => {
    if (product.image && product.image !== '/assets/products/shop.png') {
      return product.image
    }
    if (product.images && product.images.length > 0 && product.stockImageUrl) {
      return `${product.stockImageUrl}${product.images[0]}`
    }
    return '/assets/products/shop.png'
  }

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(),
      images: product.images,
      stockImageUrl: product.stockImageUrl,
      type: 'product',
      action: 'add_to_cart'
    }

    if (!isAuthenticated) {
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
      image: getProductImage(),
      images: product.images,
      stockImageUrl: product.stockImageUrl,
      type: 'product',
      action: 'buy_now'
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    addToCart(productData, 1)
    navigate('/product-cart')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* ✅ Image container with fixed aspect ratio */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img 
          src={getProductImage()} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/assets/products/shop.png'
          }}
        />
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

        {/* Stock status indicator */}
        {product.quantity === 0 && (
          <span className="text-red-500 text-xs font-medium">Out of Stock</span>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.quantity === 0}
            className={`flex-1 text-center py-2 rounded-md border border-primary text-primary font-semibold transition ${
              adding || product.quantity === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:gradient-animated hover:text-white'
            }`}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.quantity === 0}
            className={`flex-1 text-center py-2 rounded-md gradient-animated text-white font-semibold transition ${
              product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
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

//   // Get the first image from images array or use placeholder
//   const getProductImage = () => {
//     if (product.images && product.images.length > 0 && product.stockImageUrl) {
//       // First image from the images array
//       return `${product.stockImageUrl}${product.images[0]}`
//     }
//     return '/assets/products/shop.png'
//   }

//   const handleAddToCart = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: getProductImage(),
//       images: product.images,
//       stockImageUrl: product.stockImageUrl,
//       type: 'product',
//       action: 'add_to_cart'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     setAdding(true)
//     addToCart(productData, 1)
//     setTimeout(() => {
//       setAdding(false)
//     }, 500)
//   }

//   const handleBuyNow = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: getProductImage(),
//       images: product.images,
//       stockImageUrl: product.stockImageUrl,
//       type: 'product',
//       action: 'buy_now'
//     }

//     if (!isAuthenticated) {
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     addToCart(productData, 1)
//     navigate('/product-cart')
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
//       <div className="relative overflow-hidden">
//         <img 
//           src={getProductImage()} 
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
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
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       // originalPrice: product.oldPrice,
//       image: product.image,
//       type: 'product',
//       action: 'add_to_cart'  // ✅ Store which action to perform
//     }

//     if (!isAuthenticated) {
//       // ✅ Save product data and intended action
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     setAdding(true)
//     addToCart(productData, 1)
//     setTimeout(() => {
//       setAdding(false)
//     }, 500)
//   }

//   const handleBuyNow = () => {
//     const productData = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       // originalPrice: product.oldPrice,
//       image: product.image,
//       type: 'product',
//       action: 'buy_now'  // ✅ Store which action to perform
//     }

//     if (!isAuthenticated) {
//       // ✅ Save product data and intended action
//       sessionStorage.setItem('pendingProductAction', JSON.stringify(productData))
//       sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
//       navigate('/login')
//       return
//     }

//     addToCart(productData, 1)
//     navigate('/product-cart')
//   }

//   // const discountPercent = product.oldPrice && product.price 
//   //   ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
//   //   : 0

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
//       <div className="relative overflow-hidden">
//         <img 
//           src={product.image || '/assets/products/shop.png'} 
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {/* {discountPercent > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//             {discountPercent}% OFF
//           </span>
//         )} */}
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
//           {/* {product.price && (
//             <span className="text-gray-400 line-through text-sm">
//               ₹{product.price}
//             </span>
//           )} */}
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