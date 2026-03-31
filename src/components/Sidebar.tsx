import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: '결제하기', icon: 'payments', path: '/api/payment' },
    { name: '취소하기', icon: 'history_toggle_off', path: '/api/cancel' },
    { name: '결제상태조회', icon: 'manage_search', path: '/api/status' },
    { name: 'API테스트', icon: 'biotech', path: '/playground' },
  ];

  return (
    <aside className="h-[calc(100vh-64px)] w-64 sticky top-16 hidden md:flex flex-col p-4 space-y-2 border-r border-zinc-200/20 dark:border-zinc-800/20 bg-zinc-50 dark:bg-zinc-900 font-body text-sm leading-relaxed">
      <div className="mb-6 px-2">
        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">API Reference</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">CJ PG Developer Portal</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? 'text-[#e5004f] bg-[#e5004f]/10 font-semibold rounded-lg'
                  : 'text-zinc-500 hover:text-[#e5004f]'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-zinc-200/50">
        <p className="px-3 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Documentation</p>
      </div>
    </aside>
  );
};

export default Sidebar;
