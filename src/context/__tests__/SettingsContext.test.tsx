import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsProvider } from '../SettingsContext'
import { useSettings } from '../../hooks/useSettings'
import { defaultSettings } from '../types'
import { ReactNode } from 'react'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Test component that uses the settings context
function TestComponent() {
  const { settings, updateSettings, resetSettings } = useSettings()

  return (
    <div>
      <div data-testid='theme-mode'>{settings.theme.mode}</div>
      <div data-testid='compact-view'>
        {settings.theme.compactView.toString()}
      </div>
      <button
        onClick={() =>
          updateSettings({
            theme: { mode: 'dark' },
          })
        }
      >
        Toggle Dark Mode
      </button>
      <button
        onClick={() =>
          updateSettings({
            theme: { compactView: true },
          })
        }
      >
        Toggle Compact View
      </button>
      <button onClick={resetSettings}>Reset Settings</button>
    </div>
  )
}

// Wrapper component for testing
function TestWrapper({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>
}

describe('SettingsContext', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
  })

  it('should provide default settings initially', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    render(<TestComponent />, { wrapper: TestWrapper })

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
    expect(screen.getByTestId('compact-view')).toHaveTextContent('false')
  })

  it('should load saved settings from localStorage', () => {
    const savedSettings = {
      theme: {
        mode: 'dark',
        compactView: true,
      },
    }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedSettings))

    render(<TestComponent />, { wrapper: TestWrapper })

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
    expect(screen.getByTestId('compact-view')).toHaveTextContent('true')
  })

  it('should update settings correctly', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    render(<TestComponent />, { wrapper: TestWrapper })

    fireEvent.click(screen.getByText('Toggle Dark Mode'))
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
    })

    fireEvent.click(screen.getByText('Toggle Compact View'))
    await waitFor(() => {
      expect(screen.getByTestId('compact-view')).toHaveTextContent('true')
    })
  })

  it('should save settings to localStorage when updated', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    render(<TestComponent />, { wrapper: TestWrapper })

    fireEvent.click(screen.getByText('Toggle Dark Mode'))

    // Wait for the state to update and localStorage to be called
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app_settings',
        expect.any(String),
      )
    })

    // Get the latest localStorage call
    const lastCall = mockLocalStorage.setItem.mock.calls.length - 1
    const savedSettings = JSON.parse(
      mockLocalStorage.setItem.mock.calls[lastCall][1],
    )
    expect(savedSettings.theme.mode).toBe('dark')
  })

  it('should reset settings to defaults', async () => {
    const savedSettings = {
      theme: {
        mode: 'dark',
        compactView: true,
      },
    }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedSettings))

    render(<TestComponent />, { wrapper: TestWrapper })
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')

    fireEvent.click(screen.getByText('Reset Settings'))
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
      expect(screen.getByTestId('compact-view')).toHaveTextContent('false')
    })
  })

  it('should handle invalid localStorage data', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json')
    render(<TestComponent />, { wrapper: TestWrapper })

    expect(screen.getByTestId('theme-mode')).toHaveTextContent(
      defaultSettings.theme.mode,
    )
    expect(screen.getByTestId('compact-view')).toHaveTextContent(
      defaultSettings.theme.compactView.toString(),
    )
  })

  it('should merge partial settings updates', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    render(<TestComponent />, { wrapper: TestWrapper })

    // Update theme mode only
    fireEvent.click(screen.getByText('Toggle Dark Mode'))
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
      expect(screen.getByTestId('compact-view')).toHaveTextContent('false')
    })

    // Update compact view only
    fireEvent.click(screen.getByText('Toggle Compact View'))
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
      expect(screen.getByTestId('compact-view')).toHaveTextContent('true')
    })
  })
})
