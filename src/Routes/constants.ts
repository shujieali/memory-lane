export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  signup: '/signup',
  surprise: '/surprise',
  dashboard: '/dashboard',
  settings: '/settings',
  memories: '/memories',
  memoryDetail: '/memory/:id',
  publicMemory: '/shared/memory/:public_id',
  publicLane: '/shared/lane/:userId',
  offline: '/offline',
} as const

export const PARAM_REGEX = {
  id: ':id',
  public_id: ':public_id',
  userId: ':userId',
} as const
