import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}

