import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'News Room',
  description: 'A modern news aggregation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
