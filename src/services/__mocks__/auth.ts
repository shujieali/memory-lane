import { User, LoginCredentials, RegisterCredentials } from '../types'

// Mock implementation of auth service
export const auth = {
  async login({ email }: LoginCredentials): Promise<User> {
    return {
      id: '1',
      email,
      name: 'Test User',
    }
  },

  async register({ email, name }: RegisterCredentials): Promise<User> {
    return {
      id: '1',
      email,
      name,
    }
  },

  logout: () => Promise.resolve(),
}

// Mock API base URL
const API_BASE_URL = 'http://localhost:3000'
export { API_BASE_URL }
