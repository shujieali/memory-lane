import { createContext, useContext, useReducer, ReactNode } from 'react'
import { AuthContextType, AuthState, User } from '../types/auth'
import { auth } from '../services/auth'

const AuthContext = createContext<AuthContextType | null>(null)

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE' }

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  const savedUser = localStorage.getItem('user')
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    isLoading: false,
  }
}

const initialState: AuthState = loadInitialState()

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
      }
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

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
    localStorage.removeItem('user')
    localStorage.removeItem('token')
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
