import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ComponentType, Suspense } from 'react'
import { RouteGuard } from './guards'
import { routeConfig } from './config'
import { ROUTE_PATHS } from './constants'
import { Helmet } from 'react-helmet'
import { CircularProgress, Box } from '@mui/material'

const LoadingFallback = () => (
  <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    minHeight='200px'
  >
    <CircularProgress />
  </Box>
)

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

  return (
    <RouteGuard access={route.access} redirectTo={route.redirectTo}>
      <Helmet>
        <title>{`${route.title} | Memory Lane`}</title>
      </Helmet>
      <Component />
    </RouteGuard>
  )
}

const AppRoutes = () => {
  const routeGroups = groupRoutesByLayout(routeConfig)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Routes without layout */}
        {routeGroups
          .get('none')
          ?.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={renderRouteWithGuard(route)}
            />
          ))}

        {/* Routes with layouts */}
        {Array.from(routeGroups.entries()).map(([LayoutComponent, routes]) => {
          if (LayoutComponent === 'none') return null

          const Layout = LayoutComponent as ComponentType<{
            children: React.ReactNode
          }>

          return (
            <Route
              key={Layout.name}
              element={
                <Layout>
                  <Outlet />
                </Layout>
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

        {/* Catch-all route */}
        <Route
          path='*'
          element={<Navigate to={ROUTE_PATHS.memories} replace />}
        />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
