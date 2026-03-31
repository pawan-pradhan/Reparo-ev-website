// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: !!token  // ✅ token hai to authenticated true
    }
  } catch (error) {
    console.error('Error loading user from storage:', error)
    return {
      user: null,
      token: null,
      isAuthenticated: false
    }
  }
}

const initialState = loadUserFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
    
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.clear()
    },
    
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer