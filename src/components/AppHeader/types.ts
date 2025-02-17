import { MouseEvent } from 'react'

export interface AppHeaderProps {
  onMobileDrawerToggle?: () => void
  onDesktopDrawerToggle?: () => void
  anchorEl: HTMLElement | null
  onMenuOpen?: (event: MouseEvent<HTMLElement>) => void
  onMenuClose?: () => void
  onLogout?: () => void
}
