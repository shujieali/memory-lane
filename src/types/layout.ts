export interface NavItem {
  title: string
  path?: string
  icon?: React.ComponentType
  type?: 'divider'
}

export interface LayoutProps {
  children: React.ReactNode
}
