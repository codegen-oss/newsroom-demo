import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserProvider } from '@/contexts/UserContext';
import { ArticleProvider } from '@/contexts/ArticleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NewsRoom - Your Trusted Source for News',
  description: 'Stay informed with the latest news, in-depth analysis, and exclusive content.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ArticleProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow bg-gray-50">
                {children}
              </main>
              <Footer />
            </div>
          </ArticleProvider>
        </UserProvider>
      </body>
    </html>
  );
}

