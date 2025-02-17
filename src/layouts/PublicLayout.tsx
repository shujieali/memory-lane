import { Suspense } from 'react'

import { Outlet } from 'react-router-dom'
import { Box, Container, Typography, LinearProgress } from '@mui/material'
import AppHeader from '../components/AppHeader'
import FadeTransition from '../components/Transitions/FadeTransition'
import { createAppTheme } from '../theme/theme'
import { useSettings, useAuth } from '../hooks'
import { drawerWidth } from '../components/constants'

const PublicLayout = () => {
  const { settings } = useSettings()
  const { isAuthenticated } = useAuth()
  const theme = createAppTheme(settings.theme.mode)
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <AppHeader />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: '100%',
          overflowY: 'auto',
          mt: { xs: 8, sm: 9 },
          pl: {
            sm:
              isAuthenticated && settings.theme.drawerOpen
                ? `${drawerWidth}px`
                : '0px',
          },

          transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        data-scroll-container
      >
        <Container
          maxWidth='xl'
          sx={{
            height: '100%',
          }}
          style={{ padding: 0 }}
        >
          <Suspense fallback={<LinearProgress />}>
            <FadeTransition>
              <Outlet />
            </FadeTransition>
          </Suspense>
        </Container>
      </Box>
      <Box
        component='footer'
        sx={{
          py: 1,
          px: 2,
          mt: 'auto',
          bgcolor: 'white',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth='sm'>
          <Typography variant='body2' color='text.secondary' align='center'>
            Share your memories with the world
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout
