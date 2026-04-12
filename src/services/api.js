// src/services/api.js
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 30000, // 30 seconds timeout
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH APIs ====================

export const sendOTP = async (mobile_number) => {
  try {
    const formData = new URLSearchParams()
    formData.append('mobile_number', mobile_number)
    const response = await api.post('/web/user/login', formData)
    return response.data
  } catch (error) {
    console.error('Send OTP Error:', error)
    throw error.response?.data || { message: 'Network error. Please try again.' }
  }
}

export const verifyOTP = async (mobile_number, otp) => {
  try {
    const formData = new URLSearchParams()
    formData.append('mobile_number', mobile_number)
    formData.append('otp', otp)
    const response = await api.post('/web/user/otp-verify', formData)
    return response.data
  } catch (error) {
    console.error('Verify OTP Error:', error)
    throw error.response?.data || { message: 'Invalid OTP. Please try again.' }
  }
}

export const registerUser = async (userData, token) => {
  try {
    const formData = new URLSearchParams()
    formData.append('name', userData.name)
    formData.append('email', userData.email)
    formData.append('city', userData.city)
    formData.append('state', userData.state)
    formData.append('address', userData.address)
    formData.append('pincode', userData.pincode)
    
    // ✅ ADD TOKEN IN HEADERS
    const response = await api.post('/web/user/register', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`  // 👈 YAHAN TOKEN BHEJ RAHE HAIN
      }
    })
    return response.data
  } catch (error) {
    console.error('Register Error:', error)
    throw error.response?.data || { message: 'Registration failed. Please try again.' }
  }
}


export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('temp_token')
    const formData = new URLSearchParams()
    formData.append('token', token)
    
    const response = await api.get('/web/user/get_profile', formData)
    return response.data
  } catch (error) {
    console.error('Get Profile Error:', error)
    throw error.response?.data || { message: 'Failed to load profile' }
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    const formData = new URLSearchParams()
    formData.append('name', profileData.name || '')
    formData.append('email', profileData.email || '')
    formData.append('city', profileData.city || '')
    formData.append('state', profileData.state || '')
    formData.append('address', profileData.address || '')
    formData.append('pincode', profileData.pincode || '')
    const response = await api.post('/web/user/profile-update', formData)
    return response.data
  } catch (error) {
    console.error('Update Profile Error:', error)
    throw error.response?.data || { message: 'Failed to update profile' }
  }
}

export const updateProfileImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('profile_image', imageFile)
    const response = await api.post('/web/user/profile-update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Update Profile Image Error:', error)
    throw error.response?.data || { message: 'Failed to upload image' }
  }
}

export const logoutUser = async () => {
  try {
    const response = await api.get('/web/user/logout')
    return response.data
  } catch (error) {
    console.error('Logout Error:', error)
    throw error.response?.data || { message: 'Logout failed' }
  }
}

// ==================== ORDER APIs ====================


// Download invoice
export const downloadInvoice = async (orderId) => {
  try {
    // Replace with actual API endpoint when available
    // const response = await api.get(`/web/user/invoice/${orderId}`, {
    //   responseType: 'blob'
    // })
    // return response.data
    
    // Mock - create dummy PDF
    return { success: true, message: 'Invoice download started' }
  } catch (error) {
    console.error('Download Invoice Error:', error)
    throw error.response?.data || { message: 'Failed to download invoice' }
  }
}


// ==================== NOTIFICATION APIs ====================

export const getNotifications = async () => {
  try {
    // Replace with actual API endpoint when available
    // const response = await api.get('/web/user/notifications')
    // return response.data
    
    // Mock data for now
    return {
      success: true,
      data: [
        { id: 1, title: 'Order Confirmed', message: 'Your order #101 has been confirmed', time: '2 hours ago', read: false, type: 'order' },
        { id: 2, title: 'Technician Assigned', message: 'Ravi Kumar has been assigned for your service', time: '5 hours ago', read: false, type: 'service' },
        { id: 3, title: 'Service Completed', message: 'Your service has been completed successfully', time: '1 day ago', read: true, type: 'service' },
        { id: 4, title: 'Payment Received', message: 'Payment of ₹1499 received successfully', time: '2 days ago', read: true, type: 'payment' },
        { id: 5, title: 'Special Offer', message: 'Get 20% off on your next service', time: '3 days ago', read: true, type: 'promotion' },
      ]
    }
  } catch (error) {
    console.error('Get Notifications Error:', error)
    throw error.response?.data || { message: 'Failed to load notifications' }
  }
}

export const markNotificationAsRead = async (notificationId) => {
  try {
    // Replace with actual API endpoint when available
    // const response = await api.post('/web/user/notification/read', { notification_id: notificationId })
    // return response.data
    
    return { success: true, message: 'Notification marked as read' }
  } catch (error) {
    console.error('Mark Notification Error:', error)
    throw error.response?.data || { message: 'Failed to update notification' }
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    // Replace with actual API endpoint when available
    // const response = await api.post('/web/user/notifications/read-all')
    // return response.data
    
    return { success: true, message: 'All notifications marked as read' }
  } catch (error) {
    console.error('Mark All Notifications Error:', error)
    throw error.response?.data || { message: 'Failed to update notifications' }
  }
}

// ==================== DASHBOARD APIs ====================

export const getDashboardStats = async () => {
  try {
    // Replace with actual API endpoint when available
    // const response = await api.get('/web/user/dashboard-stats')
    // return response.data
    
    // Mock data for now
    return {
      success: true,
      data: {
        totalOrders: 12,
        totalSpend: 8500,
        activeServices: 2,
        completedOrders: 8,
        pendingOrders: 2,
        cancelledOrders: 2
      }
    }
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error)
    throw error.response?.data || { message: 'Failed to load dashboard stats' }
  }
}

// ==================== HELPER FUNCTIONS ====================

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-600'
    case 'in progress':
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-600'
    case 'pending':
      return 'bg-orange-100 text-orange-600'
    case 'cancelled':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const getStatusBadge = (status) => {
  const color = getStatusColor(status)
  return `px-2 py-1 text-xs rounded-full ${color}`
}



// ==================== CITIES & CATEGORIES APIs ====================

export const getAllCities = async () => {
  try {
    const response = await api.get('/web/api/get_all_cities')
    return response.data
  } catch (error) {
    console.error('Get Cities Error:', error)
    throw error.response?.data || { message: 'Failed to load cities' }
  }
}

export const getAllServiceCategories = async () => {
  try {
    const response = await api.get('/web/api/get_all_servicesCategories')
    return response.data
  } catch (error) {
    console.error('Get Categories Error:', error)
    throw error.response?.data || { message: 'Failed to load service categories' }
  }
}

// ==================== SERVICES APIs ====================

export const getServicesByCityAndCategory = async (cityId, categoryId) => {
  try {
    // Replace with actual API endpoint
    const response = await api.get(`/web/api/get_services?city_id=${cityId}&category_id=${categoryId}`)
    return response.data
  } catch (error) {
    console.error('Get Services Error:', error)
    throw error.response?.data || { message: 'Failed to load services' }
  }
}


// ==================== CART APIs ====================

export const addToCartAPI = async (serviceId, quantity = 1) => {
  try {
    const formData = new URLSearchParams()
    formData.append('service_id', serviceId)
    formData.append('quantity', quantity)
    const response = await api.post('/web/api/add_to_cart', formData)
    return response.data
  } catch (error) {
    console.error('Add to Cart Error:', error)
    throw error.response?.data || { message: 'Failed to add to cart' }
  }
}

export const getCartItems = async () => {
  try {
    const response = await api.get('/web/api/get_cart_items')
    return response.data
  } catch (error) {
    console.error('Get Cart Error:', error)
    throw error.response?.data || { message: 'Failed to load cart' }
  }
}

export const updateCartQuantity = async (cartItemId, quantity) => {
  try {
    const formData = new URLSearchParams()
    formData.append('_id', cartItemId)
    formData.append('quantity', quantity)
    const response = await api.post('/web/api/update_cart_quantity', formData)
    return response.data
  } catch (error) {
    console.error('Update Cart Error:', error)
    throw error.response?.data || { message: 'Failed to update cart' }
  }
}

// Updated remove cart item API
export const removeCartItem = async (cartItemId) => {
  try {
    const formData = new URLSearchParams()
    formData.append('_id', cartItemId)
    const response = await api.post('/web/api/remove_cart_item', formData)
    return response.data
  } catch (error) {
    console.error('Remove Cart Item Error:', error)
    throw error.response?.data || { message: 'Failed to remove from cart' }
  }
}

// Keep old function for backward compatibility
export const removeFromCartAPI = removeCartItem




// ==================== SERVICES APIs ====================

// export const getFilteredServices = async (cityId = '', categoryId = '') => {
//   try {
//     // Build query params
//     const params = new URLSearchParams()
//     if (cityId) params.append('city_id', cityId)
//     if (categoryId) params.append('servicecategory_id', categoryId)
    
//     const queryString = params.toString()
//     const url = `/web/api/get_filtered_services${queryString ? `?${queryString}` : ''}`
    
//     const response = await api.get(url)
//     console.log('Services API Response:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('Get Services Error:', error)
//     throw error.response?.data || { message: 'Failed to load services' }
//   }
// }


// src/services/api.js - Update getFilteredServices function

export const getFilteredServices = async (cityId = '', categoryId = '', modelId = '') => {
  try {
    // Build query params
    const params = new URLSearchParams()
    if (cityId) params.append('city_id', cityId)
    if (categoryId) params.append('servicecategory_id', categoryId)
    if (modelId) params.append('model_id', modelId)
    
    const queryString = params.toString()
    const url = `/web/api/get_filtered_services${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    console.log('Filtered Services API Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Get Filtered Services Error:', error)
    throw error.response?.data || { message: 'Failed to load services' }
  }
}


export const getAllServices = async (cityId = '', categoryId = '') => {
  try {
    // Build query params
    const params = new URLSearchParams()
    if (cityId) params.append('city_id', cityId)
    if (categoryId) params.append('servicecategory_id', categoryId)
    
    const queryString = params.toString()
    const url = `/web/api/get_all_services${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    console.log('Services API Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Get Services Error:', error)
    throw error.response?.data || { message: 'Failed to load services' }
  }
}


// src/services/api.js - Add this function

// ==================== MODELS APIs ====================

export const getAllModels = async () => {
  try {
    const response = await api.get('/web/api/get_all_models')
    return response.data
  } catch (error) {
    console.error('Get Models Error:', error)
    throw error.response?.data || { message: 'Failed to load models' }
  }
}






// Get all support tickets (REAL API)
export const getSupportTickets = async () => {
  try {
    const response = await api.get('/web/api/get_support_ticket')
    console.log('Get Support Tickets Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Get Support Tickets Error:', error)
    throw error.response?.data || { message: 'Failed to load tickets' }
  }
}

// Create new support ticket
export const createSupportTicket = async (ticketData) => {
  try {
    const formData = new URLSearchParams()
    formData.append('subject', ticketData.subject)
    formData.append('mobile_number', ticketData.mobile_number)
    formData.append('category', ticketData.category)
    formData.append('description', ticketData.message)
    
    const response = await api.post('/web/api/create-support-ticket', formData)
    console.log('Create Ticket Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Create Ticket Error:', error)
    throw error.response?.data || { message: 'Failed to create ticket' }
  }
}

// Reply to support ticket
export const replyToTicket = async (ticketId, comment) => {
  try {
    const formData = new URLSearchParams()
    formData.append('ticket_id', ticketId)
    formData.append('comment', comment)
    
    const response = await api.post('/web/api/support-ticket-reply', formData)
    console.log('Reply to Ticket Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Reply to Ticket Error:', error)
    throw error.response?.data || { message: 'Failed to send reply' }
  }
}




// ---------------------======================================================================
// Track Service Order
export const trackServiceOrder = async (orderId) => {
  try {
    const formData = new URLSearchParams()
    formData.append('orderId', orderId)
    const response = await api.post('/web/track_service_order_status', formData)
    return response.data
  } catch (error) {
    console.error('Track Service Order Error:', error)
    throw error.response?.data || { message: 'Failed to track order' }
  }
}

// Track Product Order
export const trackProductOrder = async (orderId) => {
  try {
    const formData = new URLSearchParams()
    formData.append('order_id', orderId)
    const response = await api.post('/web/track_product_order_status', formData)
    return response.data
  } catch (error) {
    console.error('Track Product Order Error:', error)
    throw error.response?.data || { message: 'Failed to track order' }
  }
}

// Get Product Order Items
export const getProductOrderItems = async () => {
  try {
    const response = await api.get('/web/get_product_orderItems')
    return response.data
  } catch (error) {
    console.error('Get Product Order Items Error:', error)
    throw error.response?.data || { message: 'Failed to load product orders' }
  }
}

// Download Service Invoice
export const downloadServiceInvoice = async (orderId) => {
  try {
    const response = await api.get(`/web/download_invoice?id=${orderId}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Download Service Invoice Error:', error)
    throw error.response?.data || { message: 'Failed to download invoice' }
  }
}

// Download Product Invoice
export const downloadProductInvoice = async (orderId) => {
  try {
    const response = await api.get(`/web/download_product_invoice?_id=${orderId}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Download Product Invoice Error:', error)
    throw error.response?.data || { message: 'Failed to download invoice' }
  }
}


export default api