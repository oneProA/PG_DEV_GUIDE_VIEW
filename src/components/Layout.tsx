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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-8 md:p-12 lg:p-16' : ''} overflow-y-auto`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
