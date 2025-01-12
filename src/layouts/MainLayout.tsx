import { ReactNode, useState, Suspense, MouseEvent } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  LinearProgress,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home,
  Dashboard,
  Settings,
  PhotoLibrary,
} from '@mui/icons-material'
import { useSettings } from '../hooks'
import { createAppTheme } from '../theme/theme'
import { useNavigate, useLocation } from 'react-router-dom'
import FadeTransition from '../components/FadeTransition'
import { useAuth } from '../hooks'

interface MainLayoutProps {
  children: ReactNode
}

const drawerWidth = 220

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/home' },
  { text: 'Memories', icon: <PhotoLibrary />, path: '/memories' },
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const { settings, updateSettings } = useSettings()
  const { user, logout } = useAuth()
  const theme = createAppTheme(settings.theme.mode)
  const navigate = useNavigate()
  const location = useLocation()
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

  const drawer = (
    <Box sx={{ mt: '64px' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  borderRight: (theme) =>
                    `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color:
                    location.pathname === item.path
                      ? 'primary.main'
                      : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color:
                    location.pathname === item.path
                      ? 'primary.main'
                      : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position='fixed'
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
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
            {user && (
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
            )}
          </Toolbar>
        </AppBar>

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
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                height: '100%',
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant='persistent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                height: '100%',
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
              },
            }}
            open={settings.theme.drawerOpen}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            width: '100%',
            pl: { sm: settings.theme.drawerOpen ? `${drawerWidth}px` : 0 },
            pt: { xs: 8, sm: 9 },
            px: { xs: 2, sm: 2.5 },
            transition: theme.transitions.create('padding', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Suspense fallback={<LinearProgress />}>
            <FadeTransition>{children}</FadeTransition>
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
