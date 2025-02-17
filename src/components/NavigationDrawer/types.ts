import { ReactNode } from 'react'

export interface NavigationDrawerProps {
  mobileOpen: boolean
  desktopOpen: boolean
  onMobileClose: () => void
  variant: 'temporary' | 'persistent'
  children?: ReactNode
}
