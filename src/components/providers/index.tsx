import { ThemeProvider } from '@/components/providers/theme-provider'
import { ReactQueryProvider } from '../providers/react-query-provider'
import { SolanaProvider } from '@/components/providers/solana-provider'
import React from 'react'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SolanaProvider>{children}</SolanaProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
