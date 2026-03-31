import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import { useAuthStore } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useAuthStore((state) => ({ user: state.user, logout: state.logout }));

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_12px_32px_-4px_rgba(27,28,28,0.06)]">
      <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#b7003d] dark:text-[#e5004f]">
            CJ PG Developer Center
          </Link>
          <div className="hidden md:flex gap-6">

            <Link
              to="/api"
              className={`${
                isActive('/api') ? 'text-[#e5004f] font-bold border-b-2 border-[#e5004f]' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              } pb-1 text-sm font-medium transition-colors`}
            >
              API
            </Link>
            <Link
              to="/support"
              className={`${
                isActive('/support') ? 'text-[#e5004f] font-bold border-b-2 border-[#e5004f]' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              } pb-1 text-sm font-medium transition-colors`}
            >
              Support
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-medium px-4 py-2">
            Admin
          </button>
          {user ? (
            <>
              <button
                type="button"
                className="text-zinc-600 dark:text-zinc-400 transition-colors text-sm font-medium px-4 py-2 rounded-md border border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
              >
                {user.username}
              </button>
              <button
                type="button"
                className="bg-white/90 text-primary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-surface-container-lowest"
                onClick={() => {
                  logout();
                  setLoginOpen(false);
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg text-sm font-bold transition-transform ease-out duration-200 transform scale-95 active:scale-90"
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
