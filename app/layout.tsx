import './globals.css'
import { Inter } from 'next/font/google'
import { RouteProvider } from '@/contexts/RouteContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RouteOptimize - Modern Route Optimization',
  description: 'Advanced route optimization with real-time visualization and intelligent algorithms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <RouteProvider>
          {children}
        </RouteProvider>
      </body>
    </html>
  )
}
