import { ComponentType } from 'react'
import { To } from 'react-router-dom'
import { PARAM_REGEX, ROUTE_PATHS } from './constants'

export type RouteAccess = 'public' | 'private' | 'guest'

export interface RouteConfig {
  path: string
  component: ComponentType<Record<string, unknown>>
  layout?: ComponentType<{ children: React.ReactNode }>
  access: RouteAccess
  redirectTo?: string
  children?: RouteConfig[]
  title: string
}

// Extract the keys from PARAM_REGEX
type ParamKeys = keyof typeof PARAM_REGEX

// Define the interface for RouteParams
export type RouteParams = Partial<{
  [key in ParamKeys]: string | number
}>

export interface NavigationOptions {
  params?: RouteParams
  query?: Record<string, string>
  state?: Record<string, unknown>
}

export type NavigateToRoute = (
  routeName: keyof typeof ROUTE_PATHS,
  options?: NavigationOptions,
) => To
