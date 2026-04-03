import React, { useState } from 'react';

interface Member {
  id: string;
  name: string;
  initial: string;
  email: string;
  status: '활성' | '정지';
  role: string;
  phone: string;
  badges: string[];
  image?: string;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('전체 (1,240)');

  const members: Member[] = [
    { id: '1', name: '김철수', initial: '김', email: 'chulsoo.kim@gmail.com', status: '활성', role: 'Standard User', phone: '010-0000-0000', badges: [] },
    { id: '2', name: '이영희', initial: '이', email: 'young.lee@cj.net', status: '정지', role: 'Merchant Admin', phone: '010-0000-0000', badges: [] },
    { id: '3', name: '박지성', initial: '박', email: 'jisung.park@dev.io', status: '활성', role: 'Developer', phone: '010-1234-5678', badges: ['Developer', 'Email Verified'], image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: '4', name: '최유리', initial: '최', email: 'yuri.choi@company.com', status: '활성', role: 'Standard User', phone: '010-0000-0000', badges: [] },
  ];

  const [selectedMember, setSelectedMember] = useState<Member>(members[2]);

  return (
    <div className="flex flex-1 overflow-hidden bg-[#f9fafb]">
       {/* Left Content Area */}
       <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
             <div>
                <h1 className="text-2xl font-black text-zinc-900">회원관리</h1>
             </div>
             
             {/* Right Search Input placeholder for realism */}
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
                <input type="text" placeholder="회원명 등 검색..." className="bg-zinc-100 border-none rounded-full py-2.5 pl-11 pr-4 text-xs font-bold w-64 outline-none focus:ring-2 focus:ring-primary/20" />
             </div>
          </div>

          {/* Top Bar Tabs & Search */}
          <div className="flex justify-between items-center bg-transparent border-b border-transparent mb-6 w-full max-w-4xl">
             <div className="flex bg-zinc-100/50 rounded-full p-1 shadow-sm border border-zinc-200">
                {['전체 (1,240)', '활성 (1,100)', '비활성 (140)'].map(tab => (
                   <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[11px] font-black px-6 py-2.5 rounded-full transition-all ${
                         activeTab === tab
                           ? 'border-primary border bg-white text-primary shadow-sm'
                           : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                   >
                     {tab}
                   </button>
                ))}
             </div>
             
             <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-full px-4 py-2 cursor-pointer shadow-sm">
                <span className="text-[11px] font-bold text-zinc-500">가입일 순</span>
                <span className="material-symbols-outlined text-[16px] text-zinc-400">expand_more</span>
             </div>
          </div>

          {/* List Table */}
          <div className="bg-transparent flex-1 max-w-4xl pb-32">
             <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 text-[11px] font-black text-zinc-400 tracking-widest bg-zinc-50/50 rounded-t-2xl">
                <div className="col-span-1 flex items-center justify-center">
                   <div className="w-4 h-4 border-2 border-zinc-200 rounded"></div>
                </div>
                <div className="col-span-5">회원정보</div>
                <div className="col-span-3 flex justify-center">상태</div>
                <div className="col-span-3">권한</div>
             </div>

             <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-zinc-100 overflow-hidden">
                {members.map(member => {
                   const isSelected = selectedMember.id === member.id;
                   return (
                      <div 
                         key={member.id} 
                         onClick={() => setSelectedMember(member)}
                         className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all cursor-pointer border-b border-zinc-50 last:border-0 ${
                            isSelected ? 'bg-[#fff0f7] border-transparent relative z-10' : 'hover:bg-zinc-50/50'
                         }`}
                      >
                         <div className="col-span-1 flex items-center justify-center">
                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                               isSelected ? 'bg-primary border-primary text-white' : 'border-2 border-zinc-200 bg-white'
                            }`}>
                               {isSelected && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                            </div>
                         </div>
                         <div className="col-span-5 flex items-center gap-4">
                            {member.image ? (
                               <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white" />
                            ) : (
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                                  isSelected ? 'bg-zinc-800 text-white' : 'bg-red-50 text-zinc-400'
                               }`}>
                                  {member.initial}
                               </div>
                            )}
                            <div>
                               <h3 className={`font-black text-sm mb-0.5 ${isSelected ? 'text-primary' : 'text-zinc-800'}`}>
                                  {member.name}
                               </h3>
                               <p className="text-[11px] text-zinc-400 font-bold">{member.email}</p>
                            </div>
                         </div>
                         <div className="col-span-3 flex justify-center">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-md tracking-wider ${
                               member.status === '활성' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                            }`}>
                               {member.status}
                            </span>
                         </div>
                         <div className="col-span-3 flex items-center text-xs font-bold text-zinc-600">
                            {member.role}
                         </div>
                      </div>
                   )
                })}
             </div>
             <div className="px-6 py-6 text-[11px] font-bold text-zinc-400 tracking-wider">
                총 1,240명 중 1-20 표시
             </div>
          </div>
       </div>

       {/* Right Panel (Detail) */}
       <div className="w-[500px] bg-white border-l border-zinc-100 flex flex-col relative shadow-[-20px_0_40px_rgb(0,0,0,0.03)] z-50 h-full overflow-hidden">
          <div className="flex justify-between items-center p-8 border-b border-zinc-50 bg-white z-10">
             <div>
                <h2 className="text-xl font-black text-zinc-900 mb-1">회원 상세 정보</h2>
                <p className="text-[11px] text-zinc-400 font-bold">회원정보를 수정하고 권한을 관리합니다.</p>
             </div>
             <button className="text-zinc-300 hover:text-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 pb-40 custom-scrollbar">
             {/* Profile Header */}
             <div className="flex flex-col items-center justify-center py-10 border-b border-zinc-50 mb-10">
                <div className="relative mb-5">
                   {selectedMember.image ? (
                     <img src={selectedMember.image} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white" />
                   ) : (
                     <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-2xl font-black text-zinc-400 border-4 border-white shadow-lg">
                        {selectedMember.initial}
                     </div>
                   )}
                   <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-zinc-100 hover:scale-105 active:scale-95 transition-all text-primary">
                      <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                   </button>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-1">{selectedMember.name}</h3>
                <p className="text-sm font-bold text-zinc-500 mb-4">{selectedMember.email}</p>
                <div className="flex gap-2">
                   <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider">Developer</span>
                   <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider">Email Verified</span>
                </div>
             </div>

             {/* Basic Info Form */}
             <div className="space-y-6 mb-10">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">기본 정보</h4>
                
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-zinc-500 px-1">성명</label>
                   <input type="text" value={selectedMember.name} readOnly className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-zinc-500 px-1">연락처</label>
                   <input type="text" value={selectedMember.phone} readOnly className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300" />
                </div>
             </div>

             {/* Status Setting */}
             <div className="space-y-6 mb-12">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">상태 설정</h4>
                <div className="relative">
                   <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none appearance-none cursor-pointer hover:border-zinc-200">
                      <option>정상 ({selectedMember.status})</option>
                      <option>이용 정지</option>
                      <option>탈퇴</option>
                   </select>
                   <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-lg">expand_more</span>
                </div>
             </div>

             {/* Role Management */}
             <div className="space-y-4 mb-12 border-t border-zinc-50 pt-10">
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">권한 및 ROLE 관리</h4>
                   <button className="text-[10px] font-black text-red-600 hover:text-red-700 transition-colors hover:underline tracking-wider">역할 추가</button>
                </div>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between border border-primary/20 bg-[#fff0f7] rounded-3xl p-5 cursor-pointer shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-500">
                            <span className="material-symbols-outlined text-[18px]">terminal</span>
                         </div>
                         <div>
                            <p className="text-sm font-black text-zinc-900 mb-0.5">API Developer</p>
                            <p className="text-[10px] font-bold text-zinc-400">API Key 생성 및 문서 접근 권한</p>
                         </div>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
                   </div>

                   <div className="flex items-center justify-between border border-zinc-100 bg-white hover:bg-zinc-50 rounded-3xl p-5 cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-500">
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                         </div>
                         <div>
                            <p className="text-sm font-black text-zinc-900 mb-0.5">Billing Manager</p>
                            <p className="text-[10px] font-bold text-zinc-400">결제 내역 조회 및 결제 수단 권리</p>
                         </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-200 bg-white"></div>
                   </div>
                </div>
             </div>

             {/* Activity Log */}
             <div className="space-y-6 pt-10 border-t border-zinc-50">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-6">최근 활동 로그</h4>
                <div className="relative pl-6 border-l border-zinc-200 ml-2">
                   <div className="absolute w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center -left-[8.5px] top-0 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                   </div>
                   <div className="mb-8 -mt-1">
                      <p className="text-[13px] font-black text-zinc-900 mb-1">비밀번호 변경</p>
                      <p className="text-[10px] font-bold text-zinc-400 tracking-wider">2024.05.20 10:15</p>
                   </div>
                   
                   <div className="absolute w-3 h-3 rounded-full bg-zinc-200 border-2 border-white -left-[6px] top-16 shadow-sm"></div>
                   <div className="mt-8">
                      <p className="text-[13px] font-black text-zinc-400 mb-1">로그인 시도 (Windows/Chrome)</p>
                      <p className="text-[10px] font-bold text-zinc-400 tracking-wider">2024.05.19 09:21</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Bottom Fixed Area */}
          <div className="absolute bottom-0 left-0 w-full p-8 bg-zinc-50/80 backdrop-blur-md border-t border-zinc-100 flex gap-4 z-20">
             <button className="flex-1 bg-white border-2 border-zinc-100 text-zinc-700 py-4 rounded-2xl text-sm font-black hover:bg-zinc-50 transition-all active:scale-95 hover:border-zinc-200">변경 취소</button>
             <button className="flex-1 bg-primary text-white py-4 rounded-2xl text-sm font-black hover:brightness-95 shadow-xl shadow-primary/20 transition-all active:scale-95">저장하기</button>
          </div>
       </div>

    </div>
  );
};

export default UserManagement;
