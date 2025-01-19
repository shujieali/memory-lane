import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider } from '../authContext'
import { useAuth } from '../../hooks/useAuth'
import { auth } from '../../services/auth'

// Mock the auth service
jest.mock('../../services/auth')
const mockAuth = auth as jest.Mocked<typeof auth>

// Test component that uses auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth()
  return (
    <div>
      <div data-testid='auth-status'>
        {isAuthenticated ? 'Logged In' : 'Logged Out'}
      </div>
      {user && <div data-testid='user-name'>{user.name}</div>}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('provides authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
  })

  it('handles successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    mockAuth.login.mockResolvedValueOnce(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })

  it('handles logout', async () => {
    // Set initial authenticated state
    const mockUser = { name: 'Test User' }
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('token', 'fake-token')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'))
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('handles login error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockAuth.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Login'))
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
    expect(consoleSpy).toHaveBeenCalled()
    expect(localStorage.getItem('user')).toBeNull()

    consoleSpy.mockRestore()
  })

  it('initializes from localStorage', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('token', 'fake-token')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
  })
})
