import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { Inter } from 'next/font/google';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'News Room - Modern News Aggregation Platform',
  description: 'A modern news aggregation platform focusing on geopolitics, economy, and technology with tiered access.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
