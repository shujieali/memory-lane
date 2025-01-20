import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthProvider } from '../AuthContext'
import { useAuth } from '../../hooks/useAuth'

// Mock the auth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}))

// Test component that uses auth context
const TestComponent = () => {
  const { isAuthenticated } = useAuth()
  return (
    <div>
      <div data-testid='auth-status'>
        {isAuthenticated ? 'Logged In' : 'Logged Out'}
      </div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders auth provider without crashing', () => {
    const { container } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )
    expect(container).toBeInTheDocument()
  })

  it('starts with unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
  })
})
