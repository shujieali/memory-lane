import { ReactNode, useState } from 'react'
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
  Divider,
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Dashboard,
  Settings,
  PhotoLibrary,
} from '@mui/icons-material'
import { useSettings } from '../context/SettingsContext'
import { createAppTheme } from '../theme/theme'
import { useNavigate, useLocation } from 'react-router-dom'

interface MainLayoutProps {
  children: ReactNode
}

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Memories', icon: <PhotoLibrary />, path: '/memories' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const { settings, updateSettings } = useSettings()
  const theme = createAppTheme(settings.theme.mode)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDrawer = () => {
    updateSettings({
      theme: {
        drawerOpen: !settings.theme.drawerOpen,
      },
    })
  }

  const toggleTheme = () => {
    updateSettings({
      theme: {
        mode: settings.theme.mode === 'light' ? 'dark' : 'light',
      },
    })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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
            width: {
              sm: settings.theme.drawerOpen
                ? `calc(100% - ${drawerWidth}px)`
                : '100%',
            },
            ml: { sm: settings.theme.drawerOpen ? drawerWidth : 0 },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
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
              sx={{ flexGrow: 1 }}
            >
              Memory Lane
            </Typography>
            <IconButton color='inherit' onClick={toggleTheme}>
              {settings.theme.mode === 'dark' ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component='nav'
          sx={{
            width: { sm: settings.theme.drawerOpen ? drawerWidth : 0 },
            flexShrink: { sm: 0 },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
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
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
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
            width: {
              sm: settings.theme.drawerOpen
                ? `calc(100% - ${drawerWidth}px)`
                : '100%',
            },
            ml: { sm: settings.theme.drawerOpen ? drawerWidth : 0 },
            pt: { xs: 8, sm: 9 },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}
