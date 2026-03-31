import React, { useState } from 'react';

const Playground: React.FC = () => {
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState('https://api.cjone.com/v1/payments/approve');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    "order_id": "CJ_20241027_0001",
    "amount": 25500,
    "currency": "KRW",
    "customer": {
      "id": "user_881023",
      "name": "홍길동",
      "email": "hong@cj.net"
    },
    "items": [
      {
        "name": "CJ 포인트 충전",
        "qty": 1
      }
    ]
  }, null, 2));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">API 테스트</h1>
        <p className="text-zinc-500 text-sm">CJ ONE 결제 API를 실시간으로 테스트하고 응답 데이터를 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Request Panel */}
        <section className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_-4px_rgba(27,28,28,0.06)] overflow-hidden border border-zinc-100">
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative min-w-[120px]">
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full appearance-none bg-surface-container text-on-surface text-sm font-bold px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none"
                  >
                    <option>POST</option>
                    <option>GET</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-zinc-400">expand_more</span>
                </div>
                <div className="flex-1 min-w-[200px] relative">
                  <input 
                    className="w-full bg-surface-container text-on-surface text-sm font-medium px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button className="bg-primary-container text-white px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  요청 보내기
                </button>
              </div>

              <div className="pt-4">
                <div className="flex gap-4 border-b border-surface-container-high mb-4">
                  <button className="pb-2 text-sm font-bold border-b-2 border-primary text-primary">Headers</button>
                  <button className="pb-2 text-sm font-medium text-zinc-400 hover:text-zinc-600">Params</button>
                  <button className="pb-2 text-sm font-medium text-zinc-400 hover:text-zinc-600">Auth</button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input className="flex-1 bg-surface-container-low text-xs p-2 rounded border-none outline-none" type="text" readOnly value="Content-Type" />
                    <input className="flex-1 bg-surface-container-low text-xs p-2 rounded border-none outline-none" type="text" readOnly value="application/json" />
                    <button className="p-2 text-zinc-400"><span className="material-symbols-outlined text-[18px]">close</span></button>
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-surface-container-low text-xs p-2 rounded border-none outline-none" type="text" readOnly value="Authorization" />
                    <input className="flex-1 bg-surface-container-low text-xs p-2 rounded border-none outline-none" type="text" readOnly value="Bearer {{API_KEY}}" />
                    <button className="p-2 text-zinc-400"><span className="material-symbols-outlined text-[18px]">close</span></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-surface-container-high">
              <div className="px-6 py-3 flex items-center justify-between bg-zinc-900">
                <span className="text-xs font-bold text-zinc-400">Request Body (JSON)</span>
                <span className="material-symbols-outlined text-zinc-500 text-[16px] cursor-pointer hover:text-white">content_copy</span>
              </div>
              <div className="bg-[#303031] p-6 min-h-[300px] font-mono text-sm leading-relaxed overflow-x-auto">
                <textarea
                  className="w-full h-full bg-transparent text-zinc-300 border-none outline-none resize-none font-mono"
                  rows={12}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Response Panel */}
        <section className="space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_-4px_rgba(27,28,28,0.06)] overflow-hidden border border-zinc-100">
            <div className="px-6 py-4 flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Response</span>
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2 py-1 rounded text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  200 OK
                </div>
                <span className="text-[11px] font-medium text-zinc-400">124ms</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400"><span className="material-symbols-outlined text-[20px]">download</span></button>
                <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Response Headers</h4>
                <div className="bg-surface-container-low rounded-lg p-4 font-mono text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-zinc-500">content-type:</span> <span className="text-zinc-800">application/json; charset=utf-8</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">cache-control:</span> <span className="text-zinc-800">no-cache, no-store, must-revalidate</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">x-request-id:</span> <span className="text-zinc-800">req_77291aBc882</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">date:</span> <span className="text-zinc-800">Sun, 27 Oct 2024 09:42:12 GMT</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Response Body</h4>
                <div className="bg-[#303031] p-6 rounded-lg min-h-[350px] font-mono text-sm leading-relaxed overflow-x-auto">
                  <pre className="text-zinc-300">
{`{
  "status": "success",
  "transaction_id": "TRX_9921_AF02",
  "payment_method": "CARD",
  "authorized_at": "2024-10-27T09:42:12Z",
  "amount": {
    "total": 25500,
    "tax_free": 0,
    "vat": 2318
  },
  "card": {
    "issuer": "CJ ONE 삼성카드",
    "number": "4571-****-****-1234",
    "installment_month": 0
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low rounded-xl p-6 hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-zinc-200 shadow-sm">
          <span className="material-symbols-outlined text-primary mb-3 block">description</span>
          <h3 className="text-sm font-bold mb-2 text-on-surface">API Documentation</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">승인 API의 상세 명세와 에러 코드를 확인하려면 문서를 참조하세요.</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-6 hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-zinc-200 shadow-sm">
          <span className="material-symbols-outlined text-primary mb-3 block">history</span>
          <h3 className="text-sm font-bold mb-2 text-on-surface">Request History</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">최근 24시간 동안 발생한 테스트 요청 기록을 조회합니다.</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-6 hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-zinc-200 shadow-sm">
          <span className="material-symbols-outlined text-primary mb-3 block">security</span>
          <h3 className="text-sm font-bold mb-2 text-on-surface">API Keys</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">테스트 환경에서 사용할 샌드박스 API 키를 관리하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Playground;
