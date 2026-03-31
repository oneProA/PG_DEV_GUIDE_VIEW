import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: '오늘 접수 문의', value: '142', unit: '건', trend: '+12.5%', icon: 'monitor', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: '미처리 문의', value: '28', unit: '건', trend: '긴급 8건', icon: 'assignment', color: 'text-red-500', bg: 'bg-red-50' },
    { label: '평균 응답시간', value: '18', unit: '분', trend: '-5분', icon: 'schedule', color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'SLA 준수율', value: '98.2', unit: '%', trend: '목표달성', icon: 'verified_user', color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const barData = [
    { date: '05/16', value: 40 },
    { date: '05/17', value: 55 },
    { date: '05/18', value: 50 },
    { date: '05/19', value: 85 },
    { date: '오늘', value: 70, active: true },
  ];

  const donutData = [
    { label: '결제/승인 오류', value: 50, color: '#e5004f' },
    { label: 'API 연동 문의', value: 20, color: '#3b82f6' },
    { label: '계정/권한 설정', value: 30, color: '#8b5cf6' },
  ];

  const inquiries = [
    { id: '#CS-9823', customer: '(주)에이비씨', initial: 'A', type: '결제오류', typeBg: 'bg-red-50 text-red-500', title: '결제 모듈 연동 후 403 에러...', status: '처리중', statusColor: 'text-orange-500', time: '10:24 AM' },
    { id: '#CS-9821', customer: '김민수 (개인)', initial: 'K', type: 'API문의', typeBg: 'bg-blue-50 text-blue-500', title: '포인트 적립 API 파라미터 규...', status: '대기중', statusColor: 'text-red-500', time: '09:45 AM' },
    { id: '#CS-9819', customer: '스타트업패스', initial: 'S', type: '계정설정', typeBg: 'bg-purple-50 text-purple-500', title: '관리자 권한 추가 할당 요청 (...', status: '대기중', statusColor: 'text-red-500', time: '09:12 AM' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-zinc-50/30 -m-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">대시보드</h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">실시간 고객 문의 대응 현황 및 시스템 지표</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-zinc-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-zinc-400 text-lg">calendar_today</span>
            <span className="text-sm font-bold text-zinc-700">오늘: 2024.05.22</span>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">download</span>
            보고서 다운로드
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100/50 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <span className="material-symbols-outlined text-[24px] leading-none">{stat.icon}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-zinc-500 text-[13px] font-semibold mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900">{stat.value}</span>
                <span className="text-zinc-500 text-sm font-bold">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100/50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-zinc-900">일별 문의 추이</h3>
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
              <span className="text-xs font-bold text-zinc-600">지난 7일</span>
              <span className="material-symbols-outlined text-xs text-zinc-400">expand_more</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between px-4 pb-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-5 pr-4 pointer-events-none">
              {[1, 2, 3, 4].map((i) => <div key={i} className="border-t border-zinc-900 w-full" />)}
            </div>
            {barData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-12 group">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${
                    d.active ? 'bg-primary' : 'bg-primary/10 hover:bg-primary/20'
                  }`}
                  style={{ height: `${d.value}%` }}
                />
                <span className={`text-[11px] font-bold ${d.active ? 'text-primary' : 'text-zinc-400'}`}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100/50 flex flex-col items-center">
          <h3 className="text-lg font-black text-zinc-900 self-start mb-8">유형별 문의 분포</h3>
          <div className="relative w-40 h-40 mb-8">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f4f4f5" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e5004f" strokeWidth="4" strokeDasharray="50 50" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-50" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-70" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-zinc-900">142</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            {donutData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-bold text-zinc-600">{d.label}</span>
                </div>
                <span className="text-xs font-black text-zinc-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100/50">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-zinc-900">최근 미처리 문의 리스트</h3>
          <button className="text-primary text-xs font-black uppercase tracking-widest">전체보기</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-zinc-50">
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">문의 ID</th>
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">고객사/회원</th>
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">유형</th>
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">제목</th>
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">상태</th>
                <th className="pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-right">접수시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {inquiries.map((q, idx) => (
                <tr key={idx} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="py-5 text-sm font-bold text-zinc-500">{q.id}</td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-600">{q.initial}</div>
                      <span className="text-sm font-bold text-zinc-900">{q.customer}</span>
                    </div>
                  </td>
                  <td className="py-5 text-sm">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${q.typeBg}`}>{q.type}</span>
                  </td>
                  <td className="py-5 text-sm font-medium text-zinc-700">{q.title}</td>
                  <td className="py-5 text-sm">
                    <span className={`flex items-center gap-1.5 font-bold ${q.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {q.status}
                    </span>
                  </td>
                  <td className="py-5 text-sm font-bold text-zinc-400 text-right">{q.time}</td>
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
