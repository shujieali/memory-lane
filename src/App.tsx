import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/settingsContext'
import { ShareProvider } from './context/shareContext'
import { useSettings, useOfflineDetection } from './hooks'
import { createAppTheme } from './theme/theme'
import Routes from './Routes/AppRoutes'

const AppWithSettings = () => {
  const { settings } = useSettings()
  const theme = createAppTheme(settings.theme.mode || 'light')
  // Initialize offline detection
  useOfflineDetection()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <ShareProvider>
          <Routes />
        </ShareProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

const MemoryLane = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppWithSettings />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default MemoryLane
