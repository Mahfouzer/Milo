import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set document direction based on language
    const dir = i18n.dir()
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="min-h-screen" dir={i18n.dir()}>
      <Outlet />
    </div>
  )
}
