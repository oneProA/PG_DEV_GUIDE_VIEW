import React, { useState } from 'react';

interface ApiItem {
  id: string;
  name: string;
  endpoint: string;
  version: string;
  status: '정상 운영' | '연결 시연' | '점검 중';
  updatedAt: string;
  description: string;
  method: string;
  params: { key: string; type: string; required: boolean; desc: string }[];
}

const ApiManagement: React.FC = () => {
  const apis: ApiItem[] = [
    {
      id: 'api1', name: 'CJ ONE 포인트 조회', endpoint: '/v1/points/balance', version: 'v1.2.4',
      status: '정상 운영', updatedAt: '2024.05.20 14:32', method: 'POST',
      description: '사용자의 CJ ONE 포인트 잔액을 실시간으로 조회하여반환합니다. 제휴사 연동 시 필수적으로 사용되는 엔드포인트입니다.',
      params: [
        { key: 'user_id', type: 'String', required: true, desc: '고객 식별자 (CJ ONE ID)' },
        { key: 'auth_token', type: 'String', required: true, desc: 'API 인증 토큰' },
      ],
    },
    {
      id: 'api2', name: '간편결제 승인요청', endpoint: '/v2/payment/approve', version: 'v2.0.1',
      status: '정상 운영', updatedAt: '2024.05.18 09:15', method: 'POST',
      description: '간편결제 승인 요청을 처리하는 API입니다.',
      params: [
        { key: 'order_id', type: 'String', required: true, desc: '주문 고유 번호' },
        { key: 'amount', type: 'Number', required: true, desc: '결제 금액' },
      ],
    },
    {
      id: 'api3', name: '회원 배송지 연동', endpoint: '/v1/user/address', version: 'v1.1.0',
      status: '연결 시연', updatedAt: '2024.05.15 22:45', method: 'GET',
      description: '회원의 기본 배송지 정보를 조회합니다.',
      params: [
        { key: 'user_id', type: 'String', required: true, desc: '회원 ID' },
      ],
    },
  ];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = apis.find((a) => a.id === selectedId);

  const statusStyle = (s: string) => {
    if (s === '정상 운영') return 'text-green-600';
    if (s === '연결 시연') return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-zinc-50/30 -m-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="text-zinc-400">관리자</span>
          <span>›</span>
          <span className="font-bold text-zinc-900 text-xl">API 관리</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
            <input
              type="text"
              placeholder="API 검색..."
              className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm w-56 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            <span className="text-lg leading-none">+</span> API 등록
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 mb-1">전체 API 수</p>
          <p className="text-3xl font-black text-zinc-900">128</p>
          <p className="text-[11px] text-green-500 font-bold mt-1">▲ +4 이번 달</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 mb-1">활성 상태</p>
          <p className="text-3xl font-black text-green-500">124</p>
          <p className="text-[11px] text-zinc-400 font-medium mt-1">96.8% 가동률</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 mb-1">점검 필요</p>
          <p className="text-3xl font-black text-amber-500">2</p>
          <p className="text-[11px] text-amber-500 font-bold mt-1">즉시확인 권장</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 mb-1">평균 응답 속도</p>
          <p className="text-3xl font-black text-zinc-900">42<span className="text-lg">ms</span></p>
          <p className="text-[11px] text-zinc-400 font-medium mt-1">지연파 정상</p>
        </div>
      </div>

      {/* API Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm">
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-lg font-black text-zinc-900">API 목록</h2>
          <div className="flex gap-2">
            <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="material-symbols-outlined text-lg">sync</span>
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-zinc-100">
              <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">이름 / 엔드포인트</th>
              <th className="px-4 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">버전</th>
              <th className="px-4 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">상태</th>
              <th className="px-4 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">마지막 수정일</th>
              <th className="px-4 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {apis.map((api) => (
              <tr
                key={api.id}
                className={`cursor-pointer transition-all ${selectedId === api.id ? 'bg-primary/5' : 'hover:bg-zinc-50/50'}`}
                onClick={() => setSelectedId(api.id === selectedId ? null : api.id)}
              >
                <td className="px-6 py-5">
                  <p className="font-bold text-zinc-900 text-sm">{api.name}</p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{api.endpoint}</p>
                </td>
                <td className="px-4 py-5 text-sm text-zinc-500 font-medium">{api.version}</td>
                <td className="px-4 py-5">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${statusStyle(api.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {api.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-xs text-zinc-400 font-medium tabular-nums">{api.updatedAt}</td>
                <td className="px-4 py-5 text-right">
                  <button className="text-zinc-300 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-zinc-50 flex justify-between items-center">
          <span className="text-xs text-zinc-400 font-medium">Showing 1 to 3 of 128 entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-bold text-zinc-400 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors">이전</button>
            <button className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors">2</button>
            <button className="px-3 py-1.5 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors">3</button>
            <button className="px-3 py-1.5 text-xs font-bold text-zinc-400 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors">다음</button>
          </div>
        </div>
      </div>

      {/* API Detail / Edit Form */}
      {selected && (
        <div className="bg-white rounded-[28px] border border-zinc-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">settings_ethernet</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">API 정보 등록/수정</h3>
                <p className="text-xs text-zinc-400 font-medium">사용 중 API 엔드포인트를 정의하고 파라미터를 설정합니다.</p>
              </div>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600">API 이름</label>
              <input className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-100 focus:ring-2 focus:ring-primary/10 transition-all font-medium" defaultValue={selected.name} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600">상세 설명</label>
              <textarea className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-100 resize-none focus:ring-2 focus:ring-primary/10 transition-all" rows={3} defaultValue={selected.description} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600">HTTP Method</label>
              <select className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-100 appearance-none font-mono font-bold" defaultValue={selected.method}>
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600">버전</label>
              <input className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-100 font-mono" defaultValue={selected.version} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600">Endpoint URL</label>
              <input className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-100 font-mono text-zinc-500" defaultValue={`https://api.cjone.com${selected.endpoint}`} />
            </div>
          </div>

          {/* Parameters Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-zinc-900 text-sm">요청 파라미터 (Parameters)</h4>
              <button className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                필드 추가
              </button>
            </div>
            <div className="border border-zinc-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Key</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Required</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</th>
                    <th className="px-5 py-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {selected.params.map((p, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4">
                        <input className="bg-zinc-50 rounded-lg px-3 py-2 text-xs font-mono outline-none w-full border border-zinc-100" defaultValue={p.key} />
                      </td>
                      <td className="px-5 py-4">
                        <select className="bg-zinc-50 rounded-lg px-3 py-2 text-xs font-mono outline-none border border-zinc-100 appearance-none" defaultValue={p.type}>
                          <option>String</option>
                          <option>Number</option>
                          <option>Boolean</option>
                          <option>Object</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${p.required ? 'bg-primary' : 'bg-zinc-200'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${p.required ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-600 font-medium">{p.desc}</td>
                      <td className="px-5 py-4">
                        <button className="text-zinc-300 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSelectedId(null)} className="px-6 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors">취소</button>
            <button className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">설정 저장하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;
