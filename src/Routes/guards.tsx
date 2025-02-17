import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { ROUTE_PATHS } from './constants'
import { RouteAccess } from './types'

interface GuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PrivateGuard = ({
  children,
  redirectTo = ROUTE_PATHS.login,
}: GuardProps) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  )
}

export const PublicGuard = ({ children }: GuardProps) => {
  return children
}

export const GuestGuard = ({
  children,
  redirectTo = ROUTE_PATHS.login,
}: GuardProps) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  )
}

export const RouteGuard = ({
  access,
  children,
  redirectTo,
}: GuardProps & { access: RouteAccess }) => {
  switch (access) {
    case 'private':
      return <PrivateGuard redirectTo={redirectTo}>{children}</PrivateGuard>
    case 'public':
      return <PublicGuard redirectTo={redirectTo}>{children}</PublicGuard>
    case 'guest':
      return <GuestGuard redirectTo={redirectTo}>{children}</GuestGuard>
    default:
      return <>{children}</>
  }
}
