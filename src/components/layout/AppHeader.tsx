"use client"

import { useState } from "react"
import { NavLink, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeSelect } from "./ThemeSelect"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

interface AppHeaderProps {
  links: { label: string; path: string }[]
}

/**
 * Application header with navigation and wallet connection
 */
export const AppHeader = ({ links = [] }: AppHeaderProps) => {
  const { pathname } = useLocation()
  const [showMenu, setShowMenu] = useState(false)

  const isActive = (path: string) => {
    return path === "/" ? pathname === "/" : pathname.startsWith(path)
  }

  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <NavLink to="/" className="text-xl hover:text-neutral-500 dark:hover:text-white">
            <span>Streamflow Airdropper</span>
          </NavLink>
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 flex-nowrap items-center">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    style={({ isActive, isPending, isTransitioning }) => ({
                      fontWeight: isActive ? "bold" : "",
                      color: isPending
                        ? "red"
                        : isActive
                          ? "" // text-neutral-500
                          : "rgb(115 115 115)",
                      viewTransitionName: isTransitioning ? "slide" : "",
                    })}
                    className="hover:text-neutral-500 dark:hover:text-white"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <WalletMultiButton />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <NavLink
                      className={`hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? "text-neutral-500 dark:text-white" : ""}`}
                      to={path}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletMultiButton />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
