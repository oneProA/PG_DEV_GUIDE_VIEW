import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const user = useAuthStore((state) => state.user);

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (user && isOpen) {
      onClose();
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, isOpen, onClose, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({
      username: credentials.username.trim(),
      password: credentials.password,
    });
    } catch {
      // error message is already stored in the auth store
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 min-h-screen">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <form
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl shadow-primary/20 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">관리자 로그인</h2>
          <button type="button" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">Username</label>
        <input
          className="mb-4 w-full rounded-xl border border-zinc-200 px-4 py-3 text-base outline-none transition focus:border-primary/80 dark:border-zinc-800 dark:bg-zinc-900"
          name="username"
          placeholder="demo.user"
          value={credentials.username}
          onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
          required
        />
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">Password</label>
        <input
          className="mb-6 w-full rounded-xl border border-zinc-200 px-4 py-3 text-base outline-none transition focus:border-primary/80 dark:border-zinc-800 dark:bg-zinc-900"
          type="password"
          name="password"
          placeholder="●●●●●●●●"
          value={credentials.password}
          onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
          required
        />
        {error && (
          <p className="mb-4 rounded-lg bg-red-50/80 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-900/60 dark:text-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-2xl bg-primary px-6 py-3 text-base font-bold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginDialog;
