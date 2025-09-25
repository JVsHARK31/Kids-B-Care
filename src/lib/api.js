import axios from 'axios'

// API base configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message)
    
    // Handle common error cases
    if (error.response?.status === 413) {
      throw new Error('Image file is too large. Please try a smaller image.')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.')
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const apiEndpoints = {
  // Object detection
  detectObjects: '/api/infer',
  
  // Analytics and stats
  getStats: '/api/stats',
  getLeaderboard: '/api/leaderboard',
  getRecentDetections: '/api/recent-detections',
  
  // Logging
  logDetection: '/api/log-detection'
}

// API functions
export const detectObjects = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  
  const response = await api.post(apiEndpoints.detectObjects, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  return response.data
}

export const detectObjectsFromUrl = async (imageUrl) => {
  const formData = new FormData()
  formData.append('image_url', imageUrl)
  
  const response = await api.post(apiEndpoints.detectObjects, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  return response.data
}

export const getStats = async (period = 'week') => {
  const response = await api.get(`${apiEndpoints.getStats}?period=${period}`)
  return response.data
}

export const getLeaderboard = async (period = 'week', limit = 10) => {
  const response = await api.get(`${apiEndpoints.getLeaderboard}?period=${period}&limit=${limit}`)
  return response.data
}

export const getRecentDetections = async (limit = 20) => {
  const response = await api.get(`${apiEndpoints.getRecentDetections}?limit=${limit}`)
  return response.data
}

export const logDetection = async (detectionData) => {
  const response = await api.post(apiEndpoints.logDetection, detectionData)
  return response.data
}

// Utility functions
export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type })
}

export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

export const resizeImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Resize
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to blob
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default api
