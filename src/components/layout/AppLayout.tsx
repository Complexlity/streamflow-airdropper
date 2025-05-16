import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { AppFooter } from "./AppFooter"
import { AppHeader } from "./AppHeader"

interface AppLayoutProps {
  children: ReactNode
}

/**
 * Main application layout
 */
export const AppLayout = ({ children }: AppLayoutProps) => {
  const links = [
    { label: "Home", path: "/" },
    { label: "Create", path: "/create" },
  ]

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AppHeader links={links} />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <AppFooter />
      </div>
      <Toaster />
    </>
  )
}
