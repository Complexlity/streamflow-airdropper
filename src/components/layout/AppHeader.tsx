import { Button } from '@/components/ui/button'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { ThemeSelect } from './ThemeSelect'

interface AppHeaderProps {
  links: { label: string; path: string }[]
}

export const AppHeader = ({ links = [] }: AppHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleNavClick = () => setShowMenu(false)

  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex justify-between items-center max-w-[1100px]">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-xl hover:text-neutral-500 dark:hover:text-white flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          </NavLink>
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 flex-nowrap items-center">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    style={({ isActive, isPending, isTransitioning }) => ({
                      fontWeight: isActive ? 'bold' : '',
                      color: isPending ? 'red' : isActive ? '' : 'rgb(115 115 115)',
                      viewTransitionName: isTransitioning ? 'slide' : '',
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
                      className="hover:text-neutral-500 dark:hover:text-white"
                      to={path}
                      style={({ isActive, isPending, isTransitioning }) => ({
                        fontWeight: isActive ? 'bold' : '',
                        color: isPending ? 'red' : isActive ? '' : 'rgb(115 115 115)',
                        viewTransitionName: isTransitioning ? 'slide' : '',
                      })}
                      onClick={handleNavClick}
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
