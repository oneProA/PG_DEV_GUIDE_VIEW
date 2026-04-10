import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-8 mt-auto border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <span className="text-lg font-black tracking-tight text-primary">CJ PG</span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
            © 2026 CJ PG. All rights reserved.
          </p>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col gap-3">
             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">개발자 도구</h4>
             <a className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors" href="/api">API 가이드</a>
             <a className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors" href="/playground">SDK 플레이그라운드</a>
          </div>
          <div className="flex flex-col gap-3">
             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">고객 지원</h4>
             <a className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors" href="/support">헬프 센터</a>
             <a className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors" href="#">기술 문의</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-zinc-400 text-lg">language</span>
            <span className="text-xs font-bold text-zinc-500">한국어 (KR)</span>
          </div>
          <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <span className="material-symbols-outlined text-xl">github</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
