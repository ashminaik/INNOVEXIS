import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const api = axios.create({
    baseURL: apiUrl,
  })

  // Add token to every request (checks localStorage each time)
  api.interceptors.request.use((config) => {
    if (process.client) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('[API DEBUG] Token added to request:', config.url)
      } else {
        console.log('[API DEBUG] No token found for request:', config.url)
      }
    } else {
      console.log('[API DEBUG] Server-side request, skipping token:', config.url)
    }
    return config
  })

  return { api, apiUrl }
}
