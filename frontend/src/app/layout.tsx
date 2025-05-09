import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

