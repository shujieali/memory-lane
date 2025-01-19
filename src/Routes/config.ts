import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Surprise from '../pages/Surprise'
import Dashboard from '../pages/Dashboard'
import Settings from '../pages/Settings'
import Memories from '../pages/Memories'
import MemoryDetail from '../pages/MemoryDetail'
import PublicMemory from '../pages/PublicMemory'
import PublicMemoryLanePage from '../pages/PublicMemoryLane'
import Offline from '../pages/Offline'
import { RouteConfig } from './types'
import { ROUTE_PATHS } from './constants'

const publicRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.offline,
    component: Offline,
    access: 'public',
  },
  {
    path: ROUTE_PATHS.publicMemory,
    component: PublicMemory,
    layout: PublicLayout,
    access: 'public',
  },
  {
    path: ROUTE_PATHS.publicLane,
    component: PublicMemoryLanePage,
    layout: PublicLayout,
    access: 'public',
  },
  {
    path: ROUTE_PATHS.login,
    component: Login,
    access: 'public',
    redirectTo: ROUTE_PATHS.memories,
  },
  {
    path: ROUTE_PATHS.signup,
    component: Signup,
    access: 'public',
    redirectTo: ROUTE_PATHS.memories,
  },
  {
    path: ROUTE_PATHS.root,
    component: Login,
    access: 'public',
    redirectTo: ROUTE_PATHS.memories,
  },
]

const privateRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.surprise,
    component: Surprise,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
  },
  {
    path: ROUTE_PATHS.dashboard,
    component: Dashboard,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
  },
  {
    path: ROUTE_PATHS.settings,
    component: Settings,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
  },
  {
    path: ROUTE_PATHS.memories,
    component: Memories,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
  },
  {
    path: ROUTE_PATHS.memoryDetail,
    component: MemoryDetail,
    access: 'private',
    redirectTo: ROUTE_PATHS.login,
  },
]

// Wrap public routes with PublicLayout
publicRoutes.forEach((route) => {
  route.layout = PublicLayout
})

// Wrap private routes with MainLayout
privateRoutes.forEach((route) => {
  route.layout = MainLayout
})

export const routeConfig: RouteConfig[] = [...publicRoutes, ...privateRoutes]
