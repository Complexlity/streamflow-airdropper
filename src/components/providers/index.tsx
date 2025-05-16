import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ReactQueryProvider } from './ReactQueryProvider'
import React from 'react'
import AppWalletProvider from './WalletProvider'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
