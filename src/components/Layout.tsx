import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/api') || 
                     location.pathname.startsWith('/playground') || 
                     location.pathname.startsWith('/admin');
  
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className={`flex flex-1 w-full ${!isAdmin ? 'max-w-screen-2xl mx-auto' : ''}`}>
        {showSidebar && <Sidebar />}
        <main className={`flex-1 flex flex-col ${showSidebar && !isAdmin ? 'p-8 md:p-12 lg:p-16' : ''} overflow-x-hidden`}>
          {children}
        </main>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default Layout;

