import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/KonteksAutentikasi'
import { RouteProvider } from '@/contexts/KonteksRute'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RouteOptimize - Optimasi Rute Distribusi Modern',
  description: 'Platform canggih untuk mengoptimalkan rute pengiriman dengan algoritma Greedy Nearest Neighbor dan visualisasi real-time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <RouteProvider>
            {children}
          </RouteProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
