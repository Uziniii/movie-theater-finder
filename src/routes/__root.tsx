import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </ThemeProvider>
  )
}
