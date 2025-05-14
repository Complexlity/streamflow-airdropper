import { AppProviders } from "@/components/providers"
import { AppLayout } from "@/components/app/layout"
import { type RouteObject, useRoutes } from "react-router"
import { lazy } from "react"

const links = [
  { label: "Home", path: "/" },
  { label: "Create", path: "/create" },
]

const LazyHomePage = lazy(() => import("@/pages/home-page").then((module) => ({ default: module.HomePage })))
const LazyAirdropDetailPage = lazy(() =>
  import("@/pages/airdrop-detail-page").then((module) => ({ default: module.AirdropDetailPage })),
)
const LazyCreateAirdropPage = lazy(() =>
  import("@/pages/create-airdrop-page").then((module) => ({ default: module.CreateAirdropPage })),
)

const routes: RouteObject[] = [
  { index: true, element: <LazyHomePage /> },
  { path: "airdrop/:id", element: <LazyAirdropDetailPage /> },
  { path: "create", element: <LazyCreateAirdropPage /> },
]

export function App() {
  const router = useRoutes(routes)
  return (
    <AppProviders>
      <AppLayout links={links}>{router}</AppLayout>
    </AppProviders>
  )
}
