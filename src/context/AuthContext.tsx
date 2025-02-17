import { useReducer, ReactNode, useEffect } from 'react'
import { auth } from '../services/auth'
import { authReducer, initialState } from './authReducer'
import { AuthContext } from './contexts'
import { clearSettings } from './settingsUtils'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } catch {
        // If stored data is invalid, clear it
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const user = await auth.login({ email, password })
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      throw error
    }
  }

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Clear auth data
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // Clear user settings
    clearSettings()
    dispatch({ type: 'LOGOUT' })
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      const user = await auth.register({ email, password, name })
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'REGISTER_SUCCESS', payload: user })
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE' })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
