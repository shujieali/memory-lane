import {
  PhotoLibrary,
  EmojiEmotions,
  Dashboard,
  Settings,
} from '@mui/icons-material'

export const drawerWidth = 220

export const menuItems = [
  { text: 'Memories', icon: PhotoLibrary, path: '/memories' },
  { text: 'Surprise', icon: EmojiEmotions, path: '/surprise' },
  { text: 'Dashboard', icon: Dashboard, path: '/dashboard' },
  { text: 'Settings', icon: Settings, path: '/settings' },
]
