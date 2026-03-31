import React from 'react';

const Support: React.FC = () => {
  const inquiries = [
    { id: 1, category: '기술 문의', title: 'API 인증 토큰 만료 이슈 건', status: '답변완료', statusColor: 'emerald', date: '2024.05.21' },
    { id: 2, category: '결제 승인', title: '해외 카드 승인 실패 오류 (Error_402)', status: '처리중', statusColor: 'amber', date: '2024.05.20' },
    { id: 3, category: '기타', title: '정산 주기 변경 프로세스 문의', status: '접수대기', statusColor: 'zinc', date: '2024.05.19' },
    { id: 4, category: '기술 문의', title: '웹훅(Webhook) 지연 현상 관련 확인 요청', status: '답변완료', statusColor: 'emerald', date: '2024.05.15' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto py-10">
      {/* Hero Section / Header */}
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">지원 센터</h1>
        <p className="text-zinc-500 text-lg max-w-2xl">기술적인 문제나 궁금한 점이 있으신가요? CJ ONE PG 개발팀이 신속하게 답변해 드립니다.</p>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Inquiry List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">history</span>
              내 문의 리스트
            </h2>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Total: {inquiries.length}</span>
          </div>

          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-zinc-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/50">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">카테고리</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-white/40 transition-colors cursor-pointer group">
                    <td className="px-6 py-5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        inquiry.category === '기술 문의' ? 'bg-secondary/10 text-secondary' : 
                        inquiry.category === '결제 승인' ? 'bg-primary-container/10 text-primary' : 
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
              <h4 className="font-bold text-on-surface mb-1">도움이 더 필요하신가요?</h4>
              <p className="text-sm text-zinc-500">실시간 채팅 상담은 평일 오전 10시부터 오후 6시까지 운영됩니다.</p>
            </div>
            <span className="material-symbols-outlined text-6xl text-primary/5 absolute right-4 top-2 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_-4px_rgba(27,28,28,0.06)] border border-outline-variant/10 sticky top-24">
            <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">edit_square</span>
              새 문의 등록
            </h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">문의 카테고리</label>
                <div className="relative">
                  <select className="w-full bg-surface-container border-none rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none cursor-pointer">
                    <option>카테고리를 선택하세요</option>
                    <option>기술 문의 (API/SDK)</option>
                    <option>결제/정산 문의</option>
                    <option>계정/보안 문의</option>
                    <option>기타 일반 문의</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-zinc-400">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">문의 제목</label>
                <input className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" placeholder="문의 요약을 입력하세요" type="text" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">상세 내용</label>
                <textarea className="w-full bg-surface-container border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none resize-none" placeholder="발생한 현상, 재현 경로, 관련 로그 등을 상세히 기재해 주시면 더 정확한 안내가 가능합니다." rows={6}></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface">첨부 파일</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-surface transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-zinc-400 group-hover:text-primary transition-colors mb-2">cloud_upload</span>
                  <span className="text-sm text-zinc-500">클릭하거나 파일을 드래그하여 업로드</span>
                  <span className="text-[10px] text-zinc-400 mt-1">최대 20MB (jpg, png, pdf, zip)</span>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-grow bg-primary-container text-white py-3.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20" type="button">문의 제출하기</button>
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
