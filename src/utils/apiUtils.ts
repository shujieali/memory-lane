export const handleUnauthorized = async (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    // Clear auth state
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return response
}

export const withAuth = (headers: HeadersInit = {}) => {
  const token = localStorage.getItem('token')
  return {
    ...headers,
    Authorization: token ? `Bearer ${token}` : '',
  }
}
