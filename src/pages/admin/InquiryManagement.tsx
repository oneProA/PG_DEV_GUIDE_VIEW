import React, { useState } from 'react';

interface Inquiry {
  id: string;
  isNew: boolean;
  isUrgent: boolean;
  date: string;
  title: string;
  preview: string;
  author: string;
  authorId: string;
  status: '접수' | '처리중' | '답변완료';
  category: string;
  content: string;
}

const InquiryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('전체');

  const inquiries: Inquiry[] = [
    {
      id: '#29405',
      isNew: true,
      isUrgent: true,
      date: '2024.05.24 14:20',
      title: '결제 모듈 연동 중 403 에러 발생 문의',
      preview: 'API Key를 발급받아 환경 변수에 설정했으나 지속적으...',
      author: '김철수',
      authorId: 'ks_kim',
      status: '접수',
      category: '기술지원 > API 연동',
      content: '안녕하세요. CJ ONE PG 연동을 진행 중인 개발자 김철수입니다.\n현재 가이드 문서에 따라 API Key를 발급받고 헤더에 x-api-key 값을 포함하여 요청을 보내고 있습니다. 하지만 로컬 환경과 테스트 서버 모두에서 지속적으로 403 Forbidden 에러가 반환되고 있습니다. 발급받은 키의 권한 설정이나 IP 화이트리스트 등록이 필요한지 확인 부탁드립니다.',
    },
    {
      id: '#29402',
      isNew: false,
      isUrgent: false,
      date: '2024.05.24 11:05',
      title: '정기 결제 API 취소 로직 문의',
      preview: '부분 취소 시 잔액 계산 방식이 문서와 상이한 것 같습니...',
      author: '이영희',
      authorId: 'y_lee_dev',
      status: '처리중',
      category: '기술지원 > 취소/환불',
      content: '정기 결제 구독을 취소할 때 부분 취소를 요청했는데 계산 방식이 문서와 상이합니다.',
    },
    {
      id: '#29398',
      isNew: false,
      isUrgent: false,
      date: '2024.05.23 16:45',
      title: '포인트 적립 정책 확인 요청',
      preview: 'CJ ONE 포인트 합산 시 최소 단위가 어떻게 되는지 궁금...',
      author: '박지민',
      authorId: 'jimin_park',
      status: '답변완료',
      category: '일반문의 > 정책',
      content: 'CJ ONE 포인트 합산 시 최소 단위가 어떻게 되는지 궁금합니다.',
    }
  ];

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry>(inquiries[0]);

  return (
    <div className="flex-1 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-2xl font-black text-zinc-900 mb-2">문의관리</h1>
            <p className="text-sm text-zinc-500 font-medium">사용자들의 기술 지원 및 서비스 문의 사항을 관리합니다.</p>
         </div>
         <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-zinc-200 shadow-sm">
            {['전체', '접수', '처리중', '답변완료'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold px-6 py-2 rounded-full transition-all ${
                  activeTab === tab 
                    ? 'border-primary border bg-white text-primary shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
         {/* Left List */}
         <div className="lg:col-span-3 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {inquiries.map((inquiry) => (
              <div 
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-6 rounded-3xl transition-all cursor-pointer ${
                  selectedInquiry.id === inquiry.id 
                    ? 'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)]' 
                    : 'bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-zinc-200'
                }`}
              >
                 <div className="flex justify-between items-start mb-3">
                    {inquiry.isNew ? (
                       <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-1.5 rounded-lg tracking-widest uppercase">NEW</span>
                    ) : (
                       <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{inquiry.id}</span>
                    )}
                    <span className="text-[11px] font-bold text-zinc-400 tracking-widest">{inquiry.date}</span>
                 </div>
                 <h3 className={`font-black text-lg mb-2 leading-tight ${selectedInquiry.id === inquiry.id ? 'text-zinc-900' : 'text-zinc-700'}`}>
                    {inquiry.title}
                 </h3>
                 <p className="text-xs text-zinc-500 mb-5 line-clamp-1">{inquiry.preview}</p>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-zinc-200"></div>
                       <span className="text-[11px] font-bold text-zinc-600">{inquiry.author} <span className="opacity-60">({inquiry.authorId})</span></span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        inquiry.status === '접수' ? 'bg-red-50 text-red-500' :
                        inquiry.status === '처리중' ? 'bg-blue-50 text-blue-500' :
                        'bg-zinc-100 text-zinc-500'
                    }`}>
                       {inquiry.status}
                    </span>
                 </div>
              </div>
            ))}
         </div>

         {/* Right Details */}
         <div className="lg:col-span-4 flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-sm p-8 min-h-[800px] relative">
            {/* Top Info */}
            <div className="mb-6 flex items-center justify-between">
               <div className="flex flex-wrap items-center gap-3">
                  {selectedInquiry.isUrgent && (
                     <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg tracking-widest uppercase">URGENT</span>
                  )}
                  <h2 className="text-2xl font-black text-zinc-900">{selectedInquiry.title}</h2>
               </div>
               <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
               </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-400 tracking-wider mb-8 pb-8 border-b border-zinc-100">
               <span>문의 ID: {selectedInquiry.id}</span>
               <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
               <span>카테고리: {selectedInquiry.category}</span>
               <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
               <span>상태: {selectedInquiry.status}</span>
            </div>

            <div className="flex-1">
               <p className="text-sm font-medium text-zinc-700 leading-relaxed mb-6 whitespace-pre-wrap">
                  {selectedInquiry.content}
               </p>

               {/* Code Snippet */}
               {selectedInquiry.id === '#29405' && (
                 <div className="bg-[#363537] rounded-2xl p-6 text-[13px] font-mono text-zinc-300 leading-relaxed overflow-x-auto shadow-inner mb-6">
                    <span className="text-white">GET</span> /v1/payments/status HTTP/1.1<br/>
                    Host: api.cjonepg.co.kr<br/>
                    X-API-KEY: CJ_*******************<br/>
                    <br/>
                    {'{'} "error": "Forbidden", "code": 40301 {'}'}
                 </div>
               )}

               {/* Attachment */}
               {selectedInquiry.id === '#29405' && (
                 <div className="flex items-center gap-2 mb-10 group cursor-pointer w-fit">
                    <span className="material-symbols-outlined text-[18px] text-zinc-400 group-hover:text-zinc-700 transition-colors">attach_file</span>
                    <span className="text-[13px] font-medium text-zinc-400 italic group-hover:text-zinc-700 transition-colors">
                       error_log_screenshot.png (1.2MB)
                  </span>
                 </div>
               )}
            </div>

            {/* Reply Section */}
            <div className="bg-zinc-50 rounded-2xl p-6 mt-auto">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-[20px] text-primary">dynamic_feed</span>
                     <span className="font-black text-sm text-zinc-900">답변작성</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="bg-white border border-zinc-200 rounded-lg px-3 py-1.5 flex items-center gap-4 text-xs font-bold text-zinc-500 cursor-pointer hover:border-zinc-300 shadow-sm transition-colors">
                        템플릿 선택: 기술지원 기본
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                     </div>
                     <button className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors">초기화</button>
                  </div>
               </div>

               <textarea 
                  className="w-full bg-white border border-zinc-200 rounded-xl p-5 text-sm outline-none focus:border-primary/50 transition-all min-h-[160px] resize-none font-medium placeholder:text-zinc-300 shadow-sm mb-4"
                  placeholder="답변 내용을 입력하세요..."
               ></textarea>
               
               <div className="flex justify-between items-center">
                  <div className="flex gap-4 px-2">
                     <button className="text-zinc-400 hover:text-zinc-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">image</span>
                     </button>
                     <button className="text-zinc-400 hover:text-zinc-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">link</span>
                     </button>
                  </div>
                  <div className="flex gap-2">
                     <button className="bg-zinc-200 px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-300 transition-all active:scale-95">임시저장</button>
                     <button className="bg-primary px-6 py-2.5 rounded-xl text-sm font-black text-white hover:brightness-95 transition-all active:scale-95 shadow-lg shadow-primary/20">답변발송</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InquiryManagement;
