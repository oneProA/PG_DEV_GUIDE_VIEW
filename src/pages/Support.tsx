import React from 'react';
import { useAuthStore } from '../hooks/useAuth';

const Support: React.FC = () => {
  const { user, setLoginOpen } = useAuthStore((state) => ({
    user: state.user,
    setLoginOpen: state.setLoginOpen
  }));

  const inquiries = [
    { id: 1, category: '기술 문의', title: 'API ?�증 ?�큰 만료 ?�슈 �?, status: '?��??�료', statusColor: 'emerald', date: '2024.05.21' },
    { id: 2, category: '결제 ?�인', title: '?�외 카드 ?�인 ?�패 ?�류 (Error_402)', status: '처리�?, statusColor: 'amber', date: '2024.05.20' },
    { id: 3, category: '기�?', title: '?�산 주기 변�??�로?�스 문의', status: '?�수?��?, statusColor: 'zinc', date: '2024.05.19' },
    { id: 4, category: '기술 문의', title: '?�훅(Webhook) 지???�상 관???�인 ?�청', status: '?��??�료', statusColor: 'emerald', date: '2024.05.15' },
  ];

  if (!user) {
    return (
      <div className="max-w-screen-2xl mx-auto py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 animate-bounce">
          <span className="material-symbols-outlined text-4xl">lock</span>
        </div>
        <h1 className="text-3xl font-black text-on-surface mb-4 font-headline">로그인이 필요한 서비스입니다</h1>
        <p className="text-zinc-500 text-lg max-w-md mb-10 leading-relaxed">
          1:1 문의 내역을 확인하고 새로운 기술 지원을 요청하시려면 CJ PG 계정으로 로그인이 필요합니다.
        </p>
        <button 
          onClick={() => setLoginOpen(true)}
          className="bg-primary text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-10">
      {/* Hero Section / Header */}
      <section className="mb-12">
<<<<<<< HEAD
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">지???�터</h1>
        <p className="text-zinc-500 text-lg max-w-2xl">기술?�인 문제??궁금???�이 ?�으?��??? CJ PG 개발?�???�속?�게 ?��????�립?�다.</p>
=======
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">지원 센터</h1>
        <p className="text-zinc-500 text-lg max-w-2xl">기술적인 문제나 궁금한 점이 있으신가요? CJ PG 개발팀이 신속하게 답변해 드립니다.</p>
>>>>>>> 6d56124182bb8ae4c5247dbb08b4b43dcd1055a6
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Inquiry List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">history</span>
              ??문의 리스??
            </h2>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Total: {inquiries.length}</span>
          </div>

          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-zinc-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/50">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">카테고리</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">?�목</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">?�태</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">?�짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-white/40 transition-colors cursor-pointer group">
                    <td className="px-6 py-5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        inquiry.category === '기술 문의' ? 'bg-secondary/10 text-secondary' : 
                        inquiry.category === '결제 ?�인' ? 'bg-primary-container/10 text-primary' : 
                        'bg-zinc-200 text-zinc-600'
                      }`}>
                        {inquiry.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-on-surface group-hover:text-primary transition-colors">{inquiry.title}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inquiry.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                        inquiry.statusColor === 'amber' ? 'bg-amber-100 text-amber-800' :
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inquiry.statusColor === 'emerald' ? 'bg-emerald-500' :
                          inquiry.statusColor === 'amber' ? 'bg-amber-500' :
                          'bg-zinc-400'
                        }`}></span>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-zinc-400 text-xs">{inquiry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative p-8 bg-gradient-to-br from-surface-container-low to-white rounded-xl flex items-center gap-6 overflow-hidden border border-zinc-100 shadow-sm">
            <div className="z-10">
              <h4 className="font-bold text-on-surface mb-1">?��??????�요?�신가??</h4>
              <p className="text-sm text-zinc-500">?�시�?채팅 ?�담?� ?�일 ?�전 10?��????�후 6?�까지 ?�영?�니??</p>
            </div>
            <span className="material-symbols-outlined text-6xl text-primary/5 absolute right-4 top-2 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_-4px_rgba(27,28,28,0.06)] border border-outline-variant/10 sticky top-24">
            <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">edit_square</span>
              ??문의 ?�록
            </h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">문의 카테고리</label>
                <div className="relative">
                  <select className="w-full bg-surface-container border-none rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none cursor-pointer">
                    <option>카테고리�??�택?�세??/option>
                    <option>기술 문의 (API/SDK)</option>
                    <option>결제/?�산 문의</option>
                    <option>계정/보안 문의</option>
                    <option>기�? ?�반 문의</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-zinc-400">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">문의 ?�목</label>
                <input className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" placeholder="문의 ?�약???�력?�세?? type="text" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">?�세 ?�용</label>
                <textarea className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none resize-none" placeholder="발생???�상, ?�현 경로, 관??로그 ?�을 ?�세??기재??주시�????�확???�내가 가?�합?�다." rows={6}></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">첨�? ?�일</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-surface transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-zinc-400 group-hover:text-primary transition-colors mb-2">cloud_upload</span>
                  <span className="text-sm text-zinc-500">?�릭?�거???�일???�래그하???�로??/span>
                  <span className="text-[10px] text-zinc-400 mt-1">최�? 20MB (jpg, png, pdf, zip)</span>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-grow bg-primary-container text-white py-3.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20" type="button">문의 ?�출?�기</button>
                <button className="px-6 py-3.5 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-all" type="reset">취소</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
