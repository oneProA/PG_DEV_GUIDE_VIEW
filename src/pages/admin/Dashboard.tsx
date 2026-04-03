import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: '오늘 접수 문의', value: '142', unit: '건', badge: '+12.5%', badgeType: 'blue', icon: 'dvr', iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: '미처리 문의', value: '28', unit: '건', badge: '긴급 8건', badgeType: 'red', icon: 'assignment_late', iconColor: 'text-red-500', iconBg: 'bg-red-50' },
    { label: '평균 응답시간', value: '18', unit: '분', badge: '-5분', badgeType: 'gray', icon: 'schedule', iconColor: 'text-purple-500', iconBg: 'bg-purple-50' },
    { label: 'SLA 준수율', value: '98.2', unit: '%', badge: '목표달성', badgeType: 'green', icon: 'verified', iconColor: 'text-green-500', iconBg: 'bg-green-50' },
  ];

  const recentInquiries = [
    { id: '#CS-9823', authorInitial: 'A', author: '(주)에이비씨', type: '결제오류', typeColor: 'bg-red-50 text-red-500', title: '결제 모듈 연동 후 403 에러 ...', status: '처리중', statusColor: 'text-orange-500', time: '10:24 AM' },
    { id: '#CS-9821', authorInitial: 'K', author: '김민수 (개인)', type: 'API문의', typeColor: 'bg-blue-50 text-blue-500', title: '포인트 적립 API 파라미터 규...', status: '대기중', statusColor: 'text-red-500', time: '09:45 AM' },
    { id: '#CS-9819', authorInitial: 'S', author: '스타트업 패스', type: '계정설정', typeColor: 'bg-purple-50 text-purple-500', title: '관리자 권한 추가 할당 요청 (...', status: '대기중', statusColor: 'text-red-500', time: '09:12 AM' },
  ];

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">대시보드</h1>
          <p className="text-sm text-zinc-500 font-medium">실시간 고객 문의 대응 현황 및 시스템 지표</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-zinc-200">
            <span className="material-symbols-outlined text-zinc-400 text-sm">calendar_today</span>
            <span className="text-sm font-bold text-zinc-700">오늘: 2024.05.22</span>
          </div>
          <button className="bg-primary hover:brightness-95 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
             <span className="material-symbols-outlined text-[18px]">download</span>
             보고서다운로드
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 ${stat.iconBg} ${stat.iconColor} rounded-xl flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[20px] font-bold">{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                  stat.badgeType === 'blue' ? 'bg-blue-50 text-blue-500' :
                  stat.badgeType === 'red' ? 'bg-red-50 text-red-500' :
                  stat.badgeType === 'gray' ? 'bg-zinc-100 text-zinc-500' :
                  'bg-green-50 text-green-500'
              }`}>
                {stat.badge}
              </span>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                 <h3 className="text-[32px] leading-none font-black text-zinc-900">{stat.value}</h3>
                 <span className="text-sm font-bold text-zinc-400">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-zinc-900">일별 문의 추이</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
               지난 7일 <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
          <div className="h-48 flex items-end justify-between gap-6 px-4">
             {/* Simple CSS bars */}
             <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div className="w-full bg-primary/10 rounded-t-lg h-[40%]"></div>
                <span className="text-[10px] font-bold text-zinc-400">05/16</span>
             </div>
             <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div className="w-full bg-primary/10 rounded-t-lg h-[55%]"></div>
                <span className="text-[10px] font-bold text-zinc-400">05/17</span>
             </div>
             <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div className="w-full bg-primary/10 rounded-t-lg h-[50%]"></div>
                <span className="text-[10px] font-bold text-zinc-400">05/18</span>
             </div>
             <div className="flex-1 flex flex-col items-center gap-3 relative h-full justify-end">
                <div className="w-full bg-primary rounded-t-lg h-[80%] shadow-[0_4px_20px_rgba(246,0,166,0.2)]"></div>
                <span className="text-[10px] font-black text-primary">오늘</span>
             </div>
          </div>
        </div>

        {/* Right: Donut Chart */}
        <div className="bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col items-center relative overflow-hidden">
           <h3 className="text-lg font-black text-zinc-900 mb-8 self-start">유형별 문의 분포</h3>
           <div className="relative w-40 h-40 mb-8">
              {/* Fake Donut with SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="16" />
                {/* primary pink 50% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f600a6" strokeWidth="16" strokeDasharray="125 251" />
                {/* blue 20% (offset 50%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#007aff" strokeWidth="16" strokeDasharray="50 251" strokeDashoffset="-125" />
                {/* purple 30% (offset 70%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#971bad" strokeWidth="16" strokeDasharray="75 251" strokeDashoffset="-175" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-zinc-900 leading-none mb-1">142</span>
                 <span className="text-[8px] font-bold text-zinc-400 tracking-widest uppercase">Total</span>
              </div>
           </div>
           
           <div className="w-full space-y-3 px-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f600a6]"></div>결제/승인 오류
                 </div>
                 <span className="text-zinc-900 font-black">50%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#007aff]"></div>API 연동 문의
                 </div>
                 <span className="text-zinc-900 font-black">20%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#971bad]"></div>계정/권한 설정
                 </div>
                 <span className="text-zinc-900 font-black">30%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Table */}
      <div className="bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-zinc-900">최근 미처리 문의 리스트</h3>
          <button className="text-xs font-bold text-primary hover:underline">전체보기</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">문의 ID</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">고객사/회원</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">유형</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider w-1/3">제목</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">상태</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider text-right">접수시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {recentInquiries.map((q, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-4 text-sm font-bold text-zinc-400">{q.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                       <span className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-500">{q.authorInitial}</span>
                       {q.author}
                    </div>
                  </td>
                  <td className="py-4">
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${q.typeColor}`}>{q.type}</span>
                  </td>
                  <td className="py-4 text-sm font-bold text-zinc-700 truncate">{q.title}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-800">
                       <div className={`w-1.5 h-1.5 rounded-full ${q.statusColor.replace('text-', 'bg-')}`}></div>
                       {q.status}
                    </div>
                  </td>
                  <td className="py-4 text-sm font-medium text-zinc-400 text-right">{q.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
