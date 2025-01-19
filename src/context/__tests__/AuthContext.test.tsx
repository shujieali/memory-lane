import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../authContext'
import { useAuth } from '../../hooks/useAuth'
import { ReactNode } from 'react'

// Test component that uses the auth context
function TestComponent() {
  const { isAuthenticated, login, logout, user } = useAuth()

  return (
    <div>
      <div data-testid='auth-status'>
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      {user && <div data-testid='user-email'>{user.email}</div>}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

// Wrapper component for testing
function TestWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  it('should provide initial unauthenticated state', () => {
    render(<TestComponent />, { wrapper: TestWrapper })
    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'Not Authenticated',
    )
  })

  it('should update state on successful login', async () => {
    render(<TestComponent />, { wrapper: TestWrapper })

    fireEvent.click(screen.getByText('Login'))

    await waitFor(
      () => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated',
        )
      },
      { timeout: 2000 },
    )

    await waitFor(
      () => {
        const emailElement = screen.getByTestId('user-email')
        expect(emailElement).toBeInTheDocument()
        expect(emailElement).toHaveTextContent('test@example.com')
      },
      { timeout: 2000 },
    )
  })

  it('should update state on logout', async () => {
    render(<TestComponent />, { wrapper: TestWrapper })

    // Login first
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      )
    })

    // Then logout
    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated',
      )
      expect(screen.queryByTestId('user-email')).not.toBeInTheDocument()
    })
  })

  it('should maintain authentication state across rerenders', async () => {
    const { rerender } = render(<TestComponent />, { wrapper: TestWrapper })

    // Login
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      )
    })

    // Rerender component
    rerender(<TestComponent />)
    await waitFor(
      () => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated',
        )
      },
      { timeout: 2000 },
    )

    await waitFor(
      () => {
        const emailElement = screen.getByTestId('user-email')
        expect(emailElement).toBeInTheDocument()
        expect(emailElement).toHaveTextContent('test@example.com')
      },
      { timeout: 2000 },
    )
  })

  it('should handle multiple login/logout cycles', async () => {
    render(<TestComponent />, { wrapper: TestWrapper })

    // First cycle
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      )
    })

    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated',
      )
    })

    // Second cycle
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      )
    })

    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated',
      )
    })
  })
})
