import React, { useState } from 'react';

interface ApiEntry {
  id: string;
  name: string;
  endpoint: string;
  version: string;
  status: '정상 운영' | '연결 지연' | '점검 필요';
  lastModified: string;
}

const ApiManagement: React.FC = () => {
  const [apis] = useState<ApiEntry[]>([
    { id: '1', name: 'CJ ONE 포인트 조회', endpoint: '/v1/points/balance', version: 'v1.2.4', status: '정상 운영', lastModified: '2024.05.20 14:32' },
    { id: '2', name: '간편결제 승인요청', endpoint: '/v2/payment/approve', version: 'v2.0.1', status: '정상 운영', lastModified: '2024.05.18 09:15' },
    { id: '3', name: '회원 배송지 연동', endpoint: '/v1/user/address', version: 'v1.1.0', status: '연결 지연', lastModified: '2024.05.15 22:45' },
  ]);

  return (
    <div className="flex-1 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">API 관리</h1>
          <p className="text-sm text-zinc-500 font-medium">서비스 중인 API 엔드포인트의 상태와 성능을 모니터링합니다.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
            <input type="text" placeholder="API 검색..." className="bg-zinc-100/80 border border-zinc-200/50 rounded-full py-2.5 pl-11 pr-4 text-xs font-bold w-64 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" />
          </div>
          <button className="bg-primary hover:brightness-95 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-1 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[18px]">add</span>
            API 등록
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">전체 API 수</p>
          <h3 className="text-3xl font-black text-zinc-900 mb-3">128</h3>
          <div className="flex items-center gap-1 text-blue-500 text-[10px] font-black">
            <span className="material-symbols-outlined text-[12px] font-black">trending_up</span>
            +4 이번 달
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">활성 상태</p>
          <h3 className="text-3xl font-black text-blue-500 mb-3">124</h3>
          <div className="text-zinc-400 text-[10px] font-bold">
            96.8% 가동률
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">점검 필요</p>
          <h3 className="text-3xl font-black text-red-600 mb-3">2</h3>
          <div className="text-red-500 text-[10px] font-bold">
            즉시 확인 권장
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">평균 응답 속도</p>
          <h3 className="text-3xl font-black text-zinc-900 mb-3">42ms</h3>
          <div className="text-zinc-400 text-[10px] font-bold">
            최적화 상태
          </div>
        </div>
      </div>

      {/* API List Table */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] mb-10 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-50 relative">
          <h2 className="text-lg font-black text-zinc-900">API 목록</h2>
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-2 hover:text-zinc-800 transition-colors"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
            <button className="p-2 hover:text-zinc-800 transition-colors"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider">이름 / 엔드포인트</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-32">버전</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-40">상태</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-48">마지막 수정일</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-24 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {apis.map((api) => (
              <tr key={api.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-black text-[13px] text-zinc-900 mb-1">{api.name}</div>
                  <div className="font-mono text-[11px] text-zinc-400">{api.endpoint}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg">{api.version}</span>
                </td>
                <td className="px-8 py-6">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${api.status === '정상 운영' ? 'text-blue-500' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${api.status === '정상 운영' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    {api.status}
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-zinc-400">
                  {api.lastModified}
                </td>
                <td className="px-8 py-6 text-center">
                  <button className="text-zinc-400 hover:text-zinc-800 transition-colors p-1">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-zinc-50">
           <span className="text-[11px] font-bold text-zinc-400 tracking-wider">Showing 1 to 3 of 128 entries</span>
           <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
              <button className="px-3 py-1.5 hover:text-zinc-800 transition-colors">이전</button>
              <button className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">1</button>
              <button className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors">2</button>
              <button className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors">3</button>
              <button className="px-3 py-1.5 hover:text-zinc-800 transition-colors">다음</button>
           </div>
        </div>
      </div>

      {/* Form Setup Section */}
      <div className="bg-white rounded-[32px] border border-primary/10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] p-10 relative overflow-hidden ring-1 ring-zinc-50">
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
         
         <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#fff0f7] text-primary rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                  <span className="material-symbols-outlined text-2xl">grid_view</span>
               </div>
               <div>
                  <h2 className="text-xl font-black text-zinc-900 mb-1">API 정보 등록/수정</h2>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-wider">새로운 API 엔드포인트를 정의하고 파라미터를 설정합니다.</p>
               </div>
            </div>
            <button className="text-zinc-300 hover:text-zinc-800 transition-colors mt-2">
               <span className="material-symbols-outlined text-2xl">close</span>
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 relative z-10">
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">API 이름</label>
                  <input type="text" defaultValue="CJ ONE 포인트 조회" className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300 transition-colors" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">HTTP Method</label>
                     <div className="relative">
                        <select className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none appearance-none cursor-pointer hover:border-zinc-200 transition-colors">
                           <option>POST</option>
                           <option>GET</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[20px]">expand_more</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">버전</label>
                     <input type="text" defaultValue="v1.2.4" className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300 transition-colors" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">Endpoint URL</label>
                  <div className="flex bg-zinc-50/80 border border-zinc-100 rounded-2xl overflow-hidden focus-within:border-zinc-300 transition-colors">
                     <span className="py-4 pl-5 pr-1 text-sm font-bold text-zinc-400">https://api.cjone.com</span>
                     <input type="text" defaultValue="/v1/points/balance" className="flex-1 bg-transparent py-4 pr-5 text-sm font-mono font-bold text-zinc-800 outline-none" />
                  </div>
               </div>
            </div>

            <div className="space-y-2 flex flex-col h-full">
               <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">상세 설명</label>
               <textarea 
                  className="w-full flex-1 bg-zinc-50/80 border border-zinc-100 rounded-2xl p-5 text-[13px] font-bold text-zinc-600 outline-none focus:border-zinc-300 transition-colors resize-none leading-relaxed min-h-[120px]"
                  defaultValue="사용자의 CJ ONE 포인트 잔액을 실시간으로 조회하여 반환합니다. 제휴사 연동 시 필수적으로 사용되는 엔드포인트입니다."
               ></textarea>
            </div>
         </div>

         {/* Parameters */}
         <div className="border-t border-zinc-100 pt-8 relative z-10 w-full mb-4">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-black text-zinc-900">요청 파라미터 (Parameters)</h3>
               <button className="flex items-center gap-1 text-[11px] font-black text-primary hover:text-red-700 transition-colors tracking-widest">
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  필드 추가
               </button>
            </div>

            <div className="bg-zinc-50/50 rounded-[28px] border border-zinc-100 p-8 space-y-4">
               {/* Headings */}
               <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-black text-zinc-400 tracking-widest uppercase mb-4">
                  <div className="col-span-3">Key</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2 text-center">Required</div>
                  <div className="col-span-4 pl-2">Description</div>
               </div>
               
               {/* Parameter Row 1 */}
               <div className="grid grid-cols-12 gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm items-center">
                  <div className="col-span-3">
                     <input type="text" defaultValue="user_id" className="w-full bg-zinc-50 rounded-xl py-3 px-4 text-xs font-mono font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-primary/10" />
                  </div>
                  <div className="col-span-3 relative">
                     <select className="w-full bg-zinc-50 rounded-xl py-3 px-4 text-xs font-bold text-zinc-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10 hover:bg-zinc-100">
                        <option>String</option>
                        <option>Integer</option>
                        <option>Boolean</option>
                     </select>
                     <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                     {/* Custom Toggle Switch */}
                     <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all"></div>
                     </div>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                     <input type="text" defaultValue="고객 식별자 (CJ ONE ID)" className="flex-1 bg-zinc-50 rounded-xl py-3 px-4 text-xs font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-primary/10" />
                     <button className="text-zinc-300 hover:text-red-500 transition-colors p-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                     </button>
                  </div>
               </div>

               {/* Parameter Row 2 */}
               <div className="grid grid-cols-12 gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm items-center">
                  <div className="col-span-3">
                     <input type="text" defaultValue="auth_token" className="w-full bg-zinc-50 rounded-xl py-3 px-4 text-xs font-mono font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-primary/10" />
                  </div>
                  <div className="col-span-3 relative">
                     <select className="w-full bg-zinc-50 rounded-xl py-3 px-4 text-xs font-bold text-zinc-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10 hover:bg-zinc-100">
                        <option>String</option>
                        <option>Integer</option>
                        <option>Boolean</option>
                     </select>
                     <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                     <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all"></div>
                     </div>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                     <input type="text" defaultValue="API 인증 토큰" className="flex-1 bg-zinc-50 rounded-xl py-3 px-4 text-xs font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-primary/10" />
                     <button className="text-zinc-300 hover:text-red-500 transition-colors p-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                     </button>
                  </div>
               </div>
            </div>

            <div className="mt-12 flex justify-end gap-3">
               <button className="px-8 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-all active:scale-95 border border-zinc-200">취소</button>
               <button className="bg-primary hover:brightness-95 text-white px-8 py-3 rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-primary/20">설정 저장하기</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ApiManagement;
