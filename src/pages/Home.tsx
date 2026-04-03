import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-700 bg-gradient-to-b from-[#FFF0F7] via-white to-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 animate-in slide-in-from-left-8 duration-700">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-widest uppercase">Next Generation Payments</span>
            <h1 className="text-4xl md:text-[64px] font-black tracking-tight text-zinc-900 leading-[1.1] mb-8 max-w-[640px]">
              CJ PG로 결제 연동을<br/>
              <span className="text-primary whitespace-nowrap">더 빠르고 안정적으로</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-10 max-w-xl font-medium">
              강력한 API, 철저한 샌드박스 테스트 환경, 그리고 실시간 기술 지원까지. 
              개발자를 위한 최적의 결제 인프라를 지금 경험하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/api')}
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-black shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                API 시작하기
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/playground')}
                className="bg-zinc-100 text-zinc-900 px-8 py-4 rounded-xl text-lg font-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                API 테스트
                <span className="material-symbols-outlined">terminal</span>
              </button>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right-8 duration-1000">
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-[32px] shadow-[0_8px_32px_rgba(246,0,166,0.1)] p-8 border border-white overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-4 text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] font-medium">payment_request.js</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto no-scrollbar text-zinc-700">
                <span className="text-primary font-bold">const</span> <span className="text-zinc-900">cjpg</span> = <span className="text-primary/70">require</span>(<span className="text-tertiary">'@cj/pg-sdk'</span>);<br/><br/>
                <span className="text-zinc-400">// Initialize client</span><br/>
                <span className="text-primary font-bold">const</span> client = <span className="text-primary font-bold">new</span> <span className="text-zinc-900">cjpg.Client</span>({'{'}<br/>
                &nbsp;&nbsp;apiKey: <span className="text-tertiary">'cj_live_51M...'</span>,<br/>
                &nbsp;&nbsp;secret: <span className="text-tertiary">'sk_test_4e...'</span><br/>
                {'}'});<br/><br/>
                <span className="text-primary font-bold">async function</span> <span className="text-primary/80">createPayment</span>() {'{'}<br/>
                &nbsp;&nbsp;<span className="text-primary font-bold">const</span> session = <span className="text-primary font-bold">await</span> client.payments.<span className="text-primary/80">create</span>({'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;amount: <span className="text-tertiary">50000</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;orderId: <span className="text-tertiary">'ORDER_2024_001'</span><br/>
                &nbsp;&nbsp;{'}'});<br/>
                {'}'}
              </pre>
              <div className="absolute bottom-6 right-8 bg-zinc-100 text-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Ready to Deploy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-transparent">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="animate-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl font-black tracking-tight mb-4 text-zinc-900">개발자가 필요로 하는 모든 기능</h2>
              <p className="text-zinc-500 max-w-xl font-medium">단 몇 줄의 코드로 복잡한 결제 프로세스를 완벽하게 제어하세요.</p>
            </div>
            <button className="text-primary font-black flex items-center gap-1 hover:underline group">
              전체 API 명세서 보기 
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div 
              onClick={() => navigate('/api')}
              className="md:col-span-2 bg-white p-10 rounded-[32px] border border-zinc-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-16">
                <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-900 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                </div>
                <span className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">Core API</span>
              </div>
              <h3 className="text-2xl font-black mb-3 text-zinc-900">결제 API</h3>
              <p className="text-zinc-500 mb-8 max-w-md font-medium leading-relaxed">신용카드, 간편결제, 계좌이체 등 대한민국 모든 결제 수단을 단일 인터페이스로 통합 제공합니다.</p>
              <div className="flex gap-4">
                <span className="px-4 py-1.5 bg-zinc-50 text-zinc-500 text-[11px] font-black rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">JS SDK</span>
                <span className="px-4 py-1.5 bg-zinc-50 text-zinc-500 text-[11px] font-black rounded-xl">REST API</span>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div 
              onClick={() => navigate('/api/cancel')}
              className="bg-white p-10 rounded-[32px] border border-zinc-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-900 w-fit mb-12 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-zinc-900">취소 API</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">부분 취소, 전액 취소 등 유연한 환불 정책을 코드 한 줄로 처리할 수 있습니다.</p>
            </div>

            {/* Feature Card 3 */}
            <div 
              onClick={() => navigate('/api/status')}
              className="bg-white p-10 rounded-[32px] border border-zinc-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-900 w-fit mb-12 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">manage_search</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-zinc-900">상태조회</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">실시간 결제 상태 트래킹을 통해 누락 없는 데이터 동기화를 보장합니다.</p>
            </div>

            {/* Feature Card 4 */}
            <div 
              onClick={() => navigate('/playground')}
              className="md:col-span-2 bg-secondary p-10 rounded-[32px] text-white hover:shadow-2xl hover:shadow-primary/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
              <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                <div className="flex-1">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white w-fit mb-8 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">biotech</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">테스트 도구 (Sandbox)</h3>
                  <p className="text-white/60 font-medium leading-relaxed">가상 데이터를 활용하여 실제 결제와 동일한 플로우를 무제한으로 테스트하고 검증하세요.</p>
                </div>
                <div className="flex-1 w-full flex justify-center">
                  <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/20 text-6xl">terminal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="aspect-video bg-zinc-100 rounded-[32px] relative z-10 overflow-hidden border border-zinc-200">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="material-symbols-outlined text-8xl text-zinc-300">security</span>
                 </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[24px] shadow-2xl z-20 border border-zinc-100 max-w-[320px] animate-in zoom-in duration-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <span className="font-black text-zinc-900">보안 표준 준수</span>
                </div>
                <p className="text-xs text-zinc-500 font-bold leading-relaxed">PCI-DSS Level 1 인증을 획득하여 최고 수준의 보안성을 제공합니다.</p>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-6 text-zinc-900 leading-tight">신뢰할 수 있는<br/>기술 파트너</h2>
                <p className="text-lg text-zinc-500 font-medium leading-relaxed">CJ PG는 99.99% 이상의 업타임을 보장하며, 대규모 트래픽에도 흔들림 없는 결제 환경을 유지합니다.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="text-primary font-black text-2xl flex items-center gap-2">
                    <span className="material-symbols-outlined">speed</span>
                    99.99% SLA
                  </div>
                  <p className="text-sm text-zinc-400 font-bold leading-relaxed">서비스 무중단 운영을 위한 고가용성 아키텍처를 기반으로 합니다.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-zinc-900 font-black text-2xl flex items-center gap-2">
                    <span className="material-symbols-outlined">security</span>
                    End-to-End 암호화
                  </div>
                  <p className="text-sm text-zinc-400 font-bold leading-relaxed">모든 결제 데이터는 강력한 암호화 알고리즘으로 보호됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
