import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const router = useRouter();
  
  // Pages that don't need the sidebar
  const noSidebarPages = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];
  
  const showSidebar = !noSidebarPages.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {showSidebar && (
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

