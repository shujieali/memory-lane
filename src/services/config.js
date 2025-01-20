// Get API base URL in a test-friendly way
export const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000'
  }

  // In production/development, we can safely use import.meta because Vite handles it
  return import.meta.env.VITE_API_BASE_URL || window.location.origin
}
