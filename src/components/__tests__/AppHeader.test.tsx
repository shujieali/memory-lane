import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import AppHeader from '../AppHeader'
import { AuthProvider } from '../../context/AuthContext'

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { name: 'Test User' },
    logout: jest.fn(),
  }),
}))

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>,
  )
}

describe('AppHeader', () => {
  it('renders the logo', () => {
    renderWithRouter(<AppHeader />)
    const logo = screen.getByAltText('Memory Lane')
    expect(logo).toBeInTheDocument()
  })

  it('displays user name when authenticated', () => {
    renderWithRouter(<AppHeader />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<AppHeader />)
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/memories/i)).toBeInTheDocument()
  })

  it('opens navigation drawer on menu click', () => {
    renderWithRouter(<AppHeader />)
    const menuButton = screen.getByLabelText(/menu/i)
    fireEvent.click(menuButton)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
