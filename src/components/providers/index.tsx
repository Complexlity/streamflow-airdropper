import { ThemeProvider } from '@/components/providers/theme-provider'
import { ReactQueryProvider } from '../providers/react-query-provider'
import React from 'react'
import AppWalletProvider from './wallet-provider'

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
