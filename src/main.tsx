import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Route as RootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import './lib/i18n/config'
import { registerServiceWorker } from './lib/service-worker/register'
import './index.css'

// Register service worker
registerServiceWorker()

// Build route tree directly - ensure it's only built once
const routeTree = RootRoute.addChildren([IndexRoute])

// Create a new router instance - singleton pattern to prevent duplicates
const router = createRouter({ 
  routeTree,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

