import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import { useAuthStore } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isLoginOpen, setLoginOpen } = useAuthStore((state) => ({ 
    user: state.user, 
    logout: state.logout,
    isLoginOpen: state.isLoginOpen,
    setLoginOpen: state.setLoginOpen
  }));

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white dark:bg-zinc-950 sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto gap-8">
        {/* Left: Logo & Main Links */}
        <div className="flex items-center gap-8 shrink-0">
          {isAdminPath ? (
            <span className="text-xl font-black tracking-tight text-[#b7003d] dark:text-[#e5004f] cursor-default">
              CJ PG Developer Center
            </span>
          ) : (
            <Link to="/" className="text-xl font-black tracking-tight text-[#b7003d] dark:text-[#e5004f] hover:opacity-80 transition-opacity">
              CJ PG Developer Center
            </Link>
          )}
          
          {!isAdminPath && (
            <div className="hidden lg:flex gap-6">
              <Link
                to="/api"
                className={`${
                  isActive('/api') ? 'text-primary font-bold' : 'text-zinc-500'
                } text-sm font-semibold transition-colors`}
              >
                API
              </Link>
              <Link
                to="/support"
                className={`${
                  isActive('/support') ? 'text-primary font-bold' : 'text-zinc-500'
                } text-sm font-semibold transition-colors`}
              >
                Support
              </Link>
            </div>
          )}
        </div>

        {/* Center: Search Bar (Admin only) */}
        {isAdminPath && (
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg transition-colors group-focus-within:text-primary">
              search
            </span>
            <input 
              type="text" 
              placeholder="문의 번호 검색..." 
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>
        )}

        {/* Right: Admin Link & Auth */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {!isAdminPath && user?.role !== 'ADMIN' && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{user.username}</span>
                </div>
              )}
              <button
                type="button"
                className="text-primary hover:text-primary/80 transition-colors text-sm font-black px-2 py-2"
                onClick={() => {
                  logout();
                }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
              onClick={() => setLoginOpen(true)}
            >
              로그인
            </button>
          )}
        </div>
      </div>
      <LoginDialog isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;
