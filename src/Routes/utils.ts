import { generatePath } from 'react-router-dom'
import { ROUTE_PATHS } from './constants'
import { NavigateToRoute, RouteParams } from './types'

const buildQueryString = (query: Record<string, string>): string => {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value)
  })
  return `?${params.toString()}`
}

const replaceRouteParams = (path: string, params?: RouteParams): string => {
  if (!params) return path
  return generatePath(path, params as Record<string, string>)
}

export const navigateToRoute: NavigateToRoute = (routeName, options = {}) => {
  const { params, query, state } = options
  const basePath = ROUTE_PATHS[routeName]
  const pathWithParams = replaceRouteParams(basePath, params)
  const queryString = query ? buildQueryString(query) : ''

  return {
    pathname: pathWithParams,
    search: queryString,
    state,
  }
}

export const getRoutePathWithParams = (
  routeName: keyof typeof ROUTE_PATHS,
  params?: RouteParams,
): string => {
  const path = ROUTE_PATHS[routeName]
  return replaceRouteParams(path, params)
}

// Example usage:
// const navigate = useNavigate()
// navigate(navigateToRoute('memoryDetail', { params: { id: '123' }, query: { view: 'full' } }))
// Or: <Link to={navigateToRoute('memories')} />
// Or: const path = getRoutePathWithParams('memoryDetail', { id: '123' })
