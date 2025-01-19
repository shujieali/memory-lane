import { User, LoginCredentials, RegisterCredentials } from './types'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin

export const auth = {
  async login({ email, password }: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to login')
    }

    const { user, token } = await response.json()
    localStorage.setItem('token', token)
    return user
  },

  async register({
    email,
    password,
    name,
  }: RegisterCredentials): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to register')
    }

    const { user, token } = await response.json()
    localStorage.setItem('token', token)
    return user
  },
}
