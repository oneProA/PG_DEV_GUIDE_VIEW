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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-[32px] overflow-hidden flex shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-300">
        {/* Left Section: Branding & Info */}
        <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-[#4a1a2c] via-[#2d0a18] to-[#140409] p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-white text-2xl font-bold">shield</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase">CJ PG</span>
            </div>
            
            <h1 className="text-[52px] font-black leading-[1.1] text-white tracking-tighter mb-8 italic">
              Administrator<br />Access
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
              관리자 전용 보안 채널입니다. 시스템 무결성 보호를 위해 승인된 사용자만 접근할 수 있습니다.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-start gap-4">
              <span className="material-symbols-outlined text-[#e5004f] mt-0.5">verified_user</span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">강력한 2단계 인증</h4>
                <p className="text-[10px] text-white/50">모든 관리자 로그인은 2FA 권한이 반드시 필요합니다.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-start gap-4">
              <span className="material-symbols-outlined text-[#e5004f] mt-0.5">monitoring</span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">로그 기록 및 모니터링</h4>
                <p className="text-[10px] text-white/50">접속 IP와 모든 활동은 보안 정책에 따라 실시간 기록됩니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="flex-1 p-8 lg:p-14 bg-white flex flex-col justify-center relative">
          <button 
            type="button" 
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-95" 
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-black text-zinc-900 mb-2">관리자 로그인</h2>
            <p className="text-zinc-500 text-sm font-medium">관리 시스템 접속을 위한 정보를 입력해주세요.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">아이디</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors">person</span>
                <input
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                  name="username"
                  placeholder="Admin ID"
                  value={credentials.username}
                  onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">비밀번호</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors">lock</span>
                <input
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                  type="password"
                  name="password"
                  placeholder="● ● ● ● ● ● ● ●"
                  value={credentials.password}
                  onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary/20 cursor-pointer" />
                <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-700 transition-colors">관리자 계정 저장</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#e5004f] hover:underline">인증 정보 분실</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                <p className="text-xs font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#e5004f] text-white py-4 rounded-2xl text-base font-black shadow-xl shadow-[#e5004f]/20 hover:bg-[#c90045] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? '로그인 요청 중...' : (
                <>
                  로그인 요청
                  <span className="material-symbols-outlined">logout</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-50 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-full mb-4">
                <span className="material-symbols-outlined text-[16px] text-zinc-400">lock_open</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">2단계 인증(2FA) 대기 상태</span>
             </div>
             <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[320px] mx-auto">
               이 컴퓨터가 공용 장소에 있거나 타인과 공유하는 경우, <br />
               로그인 정보를 저장하지 마시고 브라우저를 반드시 종료하십시오.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
