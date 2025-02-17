import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import AppHeader from '../AppHeader'
import { AuthProvider } from '../../context/AuthContext'
import { SettingsProvider } from '../../context/SettingsContext'

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { name: 'Test User' },
    logout: jest.fn(),
  }),
}))

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>{component}</AuthProvider>
      </SettingsProvider>
    </BrowserRouter>,
  )
}

describe('AppHeader', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<AppHeader />)
    expect(container).toBeInTheDocument()
  })
})
