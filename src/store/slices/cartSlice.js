// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch {
    return []
  }
}

const initialState = {
  items: loadCartFromStorage(),
  totalQuantity: 0,
  totalAmount: 0,
}

const calculateTotals = (items) => {
  let totalQuantity = 0
  let totalAmount = 0
  items.forEach(item => {
    totalQuantity += item.quantity
    totalAmount += (item.price || 0) * item.quantity
  })
  return { totalQuantity, totalAmount }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    ...calculateTotals(initialState.items)
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload
      const totals = calculateTotals(action.payload)
      state.totalQuantity = totals.totalQuantity
      state.totalAmount = totals.totalAmount
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    
    addToCart: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find(item => item.id === newItem.id)
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1
      } else {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity || 1,
          image: newItem.image
        })
      }
      
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalAmount = totals.totalAmount
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload
      state.items = state.items.filter(item => item.id !== id)
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalAmount = totals.totalAmount
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item && quantity > 0) {
        item.quantity = quantity
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalAmount = totals.totalAmount
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalAmount = 0
      localStorage.removeItem('cart')
    },
  },
})

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

// const loadCartFromStorage = () => {
//   try {
//     const savedCart = localStorage.getItem('cart')
//     return savedCart ? JSON.parse(savedCart) : []
//   } catch {
//     return []
//   }
// }

// const initialState = {
//   items: loadCartFromStorage(),
//   totalQuantity: 0,
//   totalAmount: 0,
// }

// const calculateTotals = (items) => {
//   let totalQuantity = 0
//   let totalAmount = 0
//   items.forEach(item => {
//     totalQuantity += item.quantity
//     totalAmount += item.price * item.quantity
//   })
//   return { totalQuantity, totalAmount }
// }

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     ...initialState,
//     ...calculateTotals(initialState.items)
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       const newItem = action.payload
//       const existingItem = state.items.find(item => item.id === newItem.id)
      
//       if (existingItem) {
//         existingItem.quantity += 1
//       } else {
//         state.items.push({
//           ...newItem,
//           quantity: 1,
//         })
//       }
      
//       const totals = calculateTotals(state.items)
//       state.totalQuantity = totals.totalQuantity
//       state.totalAmount = totals.totalAmount
//       localStorage.setItem('cart', JSON.stringify(state.items))
//     },
    
//     removeFromCart: (state, action) => {
//       const id = action.payload
//       state.items = state.items.filter(item => item.id !== id)
//       const totals = calculateTotals(state.items)
//       state.totalQuantity = totals.totalQuantity
//       state.totalAmount = totals.totalAmount
//       localStorage.setItem('cart', JSON.stringify(state.items))
//     },
    
//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload
//       const item = state.items.find(item => item.id === id)
      
//       if (item && quantity > 0) {
//         item.quantity = quantity
//         const totals = calculateTotals(state.items)
//         state.totalQuantity = totals.totalQuantity
//         state.totalAmount = totals.totalAmount
//         localStorage.setItem('cart', JSON.stringify(state.items))
//       }
//     },
    
//     clearCart: (state) => {
//       state.items = []
//       state.totalQuantity = 0
//       state.totalAmount = 0
//       localStorage.removeItem('cart')
//     },
//   },
// })

// export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
// export default cartSlice.reducer