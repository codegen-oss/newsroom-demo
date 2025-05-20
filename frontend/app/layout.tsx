import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { ArticlesProvider } from '@/lib/articles/ArticlesContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: 'News Room',
  description: 'A news aggregation platform focusing on geopolitics, economy, and technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="bg-dark-950 text-white min-h-screen">
        <AuthProvider>
          <ArticlesProvider>
            {children}
          </ArticlesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
