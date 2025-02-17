import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Theme,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { drawerWidth, menuItems } from '../constants'
import { NavigationDrawerProps } from './types'

export const NavigationDrawer = ({
  mobileOpen,
  desktopOpen,
  onMobileClose,
  variant,
}: NavigationDrawerProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const drawer = (
    <Box sx={{ mt: '64px' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                if (variant === 'temporary') {
                  onMobileClose()
                }
              }}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  borderRight: (theme: Theme) =>
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
                {<item.icon />}
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

  if (variant === 'temporary') {
    return (
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            height: '100%',
          },
        }}
      >
        {drawer}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant='persistent'
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          height: '100%',
          overflowX: 'hidden',
        },
      }}
      open={desktopOpen}
    >
      {drawer}
    </Drawer>
  )
}

export default NavigationDrawer
