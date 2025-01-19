import { Routes, Route, Navigate } from 'react-router-dom'
import { ComponentType } from 'react'
import { RouteGuard } from './guards'
import { routeConfig } from './config'
import { ROUTE_PATHS } from './constants'
import { Helmet } from 'react-helmet'

// Group routes by layout
const groupRoutesByLayout = (routes: typeof routeConfig) => {
  const groups = new Map<
    ComponentType<{ children: React.ReactNode }> | 'none',
    typeof routeConfig
  >()

  // Group routes by their layout
  routes.forEach((route) => {
    const layout = route.layout || 'none'
    if (!groups.has(layout)) {
      groups.set(layout, [])
    }
    groups.get(layout)?.push(route)
  })

  return groups
}

const renderRouteWithGuard = (route: (typeof routeConfig)[0]) => {
  const Component = route.component
  const pageTitle = Component.name.replace(/Page$/, '')

  return (
    <RouteGuard access={route.access} redirectTo={route.redirectTo}>
      <Helmet>
        <title>{`${pageTitle} | Memory Lane`}</title>
      </Helmet>
      <Component />
    </RouteGuard>
  )
}

const AppRoutes = () => {
  const routeGroups = groupRoutesByLayout(routeConfig)

  return (
    <Routes>
      {Array.from(routeGroups.entries()).map(([LayoutComponent, routes]) => {
        if (LayoutComponent === 'none') {
          // Render routes without layout directly
          return routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={renderRouteWithGuard(route)}
            />
          ))
        }

        // Render routes with layout using nesting
        return (
          <Route
            key={LayoutComponent.name}
            element={
              <LayoutComponent>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={renderRouteWithGuard(route)}
                  />
                ))}
              </LayoutComponent>
            }
          >
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={renderRouteWithGuard(route)}
              />
            ))}
          </Route>
        )
      })}
      <Route
        path='*'
        element={<Navigate to={ROUTE_PATHS.memories} replace />}
      />
    </Routes>
  )
}

export default AppRoutes
