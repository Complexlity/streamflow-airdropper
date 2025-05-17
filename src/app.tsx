import { AppProviders } from '@/components/providers'
import { AppLayout } from '@/components/layout/AppLayout'
import { type RouteObject, useRoutes } from 'react-router'
import { lazy } from 'react'

const LazyHomePage = lazy(() => import('@/pages/HomePage'))
const LazyAirdropDetailPage = lazy(() => import('@/pages/AirdropDetailPage'))
const LazyCreateAirdropPage = lazy(() => import('@/pages/CreateAirdropPage'))

const routes: RouteObject[] = [
  { index: true, element: <LazyHomePage /> },
  { path: 'airdrop/:id', element: <LazyAirdropDetailPage /> },
  { path: 'create', element: <LazyCreateAirdropPage /> },
]

export function App() {
  const router = useRoutes(routes)
  return (
    <AppProviders>
      <AppLayout>{router}</AppLayout>
    </AppProviders>
  )
}
