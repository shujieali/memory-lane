import { lazy } from 'react'
import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'
import { RouteConfig } from './types'
import { ROUTE_PATHS } from './constants'

// Lazy load all page components
const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Surprise = lazy(() => import('../pages/Surprise'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Settings = lazy(() => import('../pages/Settings'))
const Memories = lazy(() => import('../pages/Memories'))
const MemoryDetail = lazy(() => import('../pages/MemoryDetail'))
const PublicMemory = lazy(() => import('../pages/PublicMemory'))
const PublicMemoryLanePage = lazy(() => import('../pages/PublicMemoryLane'))

const guestRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.login,
    component: Login,
    access: 'guest',
    redirectTo: ROUTE_PATHS.memories,
    title: 'Login',
  },
  {
    path: ROUTE_PATHS.signup,
    component: Signup,
    access: 'guest',
    redirectTo: ROUTE_PATHS.memories,
    title: 'Signup',
  },
  {
    path: ROUTE_PATHS.forgotPassword,
    component: ForgotPassword,
    access: 'guest',
    redirectTo: ROUTE_PATHS.memories,
    title: 'Forgot Password',
  },
  {
    path: ROUTE_PATHS.resetPassword,
    component: ResetPassword,
    access: 'guest',
    redirectTo: ROUTE_PATHS.memories,
    title: 'Reset Password',
  },
  {
    path: ROUTE_PATHS.root,
    component: Login,
    access: 'guest',
    redirectTo: ROUTE_PATHS.memories,
    title: 'Login',
  },
]

const publicRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.publicMemory,
    component: PublicMemory,
    layout: PublicLayout,
    access: 'public',
    title: 'Public Memory',
  },
  {
    path: ROUTE_PATHS.publicLane,
    component: PublicMemoryLanePage,
    layout: PublicLayout,
    access: 'public',
    title: 'Memory Lane',
  },
]
const privateRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.surprise,
    component: Surprise,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
    title: 'Surprise',
  },
  {
    path: ROUTE_PATHS.dashboard,
    component: Dashboard,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
    title: 'Dashboard',
  },
  {
    path: ROUTE_PATHS.settings,
    component: Settings,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
    title: 'Settings',
  },
  {
    path: ROUTE_PATHS.memories,
    component: Memories,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
    title: 'Memories',
  },
  {
    path: ROUTE_PATHS.memoryDetail,
    component: MemoryDetail,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
    title: 'Memory Detail',
  },
]

// Wrap guest routes with PublicLayout
guestRoutes.forEach((route) => {
  route.layout = PublicLayout
})

// Wrap public routes with PublicLayout
publicRoutes.forEach((route) => {
  route.layout = PublicLayout
})

// Wrap private routes with MainLayout
privateRoutes.forEach((route) => {
  route.layout = MainLayout
})

export const routeConfig: RouteConfig[] = [
  ...guestRoutes,
  ...publicRoutes,
  ...privateRoutes,
]
