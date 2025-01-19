import { useState, MouseEvent } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
} from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSettings } from '../../hooks'
import { createAppTheme } from '../../theme/theme'
import NavigationDrawer from '../../components/NavigationDrawer'
import { drawerWidth } from '../../components/constants'

export default function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { settings, updateSettings } = useSettings()
  const theme = createAppTheme(settings.theme.mode)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
    handleCloseMenu()
  }

  const toggleDrawer = () => {
    updateSettings({
      theme: {
        drawerOpen: !settings.theme.drawerOpen,
      },
    })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  return (
    <>
      <AppBar
        position='fixed'
        sx={{
          height: '64px',
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {user && (
            <>
              <IconButton
                color='inherit'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                color='inherit'
                edge='start'
                onClick={toggleDrawer}
                sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => navigate('/home')}
          >
            Memory Lane
          </Typography>
          {user ? (
            <>
              <IconButton
                size='large'
                onClick={handleMenu}
                color='inherit'
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color='inherit'
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/login')}
              sx={{
                ml: 2,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Join
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <Box
          component='nav'
          sx={{
            width: { sm: settings.theme.drawerOpen ? drawerWidth : 0 },
            flexShrink: { sm: 0 },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <NavigationDrawer
            mobileOpen={mobileOpen}
            desktopOpen={settings.theme.drawerOpen}
            onMobileClose={handleDrawerToggle}
            variant='temporary'
          />
          <NavigationDrawer
            mobileOpen={mobileOpen}
            desktopOpen={settings.theme.drawerOpen}
            onMobileClose={toggleDrawer}
            variant='persistent'
          />
        </Box>
      )}
    </>
  )
}
