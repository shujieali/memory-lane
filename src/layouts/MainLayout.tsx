import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, LinearProgress } from '@mui/material'
import { useSettings } from '../hooks'
import { createAppTheme } from '../theme/theme'
import FadeTransition from '../components/Transitions/FadeTransition'
import AppHeader from '../components/AppHeader'

import { drawerWidth } from '../components/constants'

export default function MainLayout() {
  const { settings } = useSettings()
  const theme = createAppTheme(settings.theme.mode)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: '100%',
          pl: { sm: settings.theme.drawerOpen ? `${drawerWidth}px` : '0px' },
          pt: { xs: 8, sm: 9 },
          px: { xs: 0, sm: 0 },
          transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Suspense fallback={<LinearProgress />}>
          <FadeTransition>
            <Outlet />
          </FadeTransition>
        </Suspense>
      </Box>
    </Box>
  )
}
