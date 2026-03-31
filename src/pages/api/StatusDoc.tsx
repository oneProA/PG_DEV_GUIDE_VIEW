import React from 'react';

const StatusDoc: React.FC = () => {
  return (
    <div className="max-w-5xl">
      {/* Hero Header Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase italic">Standard API</span>
          <span className="text-sm text-zinc-400 font-mono">/api/pay/status/{"{orderId}"}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-6 font-headline">결제 상태 조회</h1>
        <p className="text-lg text-zinc-600 max-w-3xl leading-relaxed italic">
          가맹점 주문 번호(orderId)를 기반으로 해당 결제의 현재 상태 및 상세 내역을 실시간으로 조회합니다.
        </p>
      </section>

      {/* API Specs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Request Parameters */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-zinc-100">
            <h3 className="text-xl font-bold font-headline text-zinc-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              요청 파라미터 (Path Variable)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                  <tr>
                    <th className="pb-4">필드명</th>
                    <th className="pb-4">타입</th>
                    <th className="pb-4">설명</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-50 italic">
                  <tr>
                    <td className="py-5 font-mono text-primary font-bold">orderId</td>
                    <td className="py-5 text-zinc-400">string</td>
                    <td className="py-5 text-zinc-600">조회할 가맹점 주문 번호 <span className="text-error text-[10px] font-bold ml-2 uppercase tracking-tighter">Required</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-xl p-8 border border-zinc-200/50">
             <h3 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">결제 상태 구분 (Status)</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['READY', 'APPROVAL', 'CANCEL', 'AUTH FAIL', 'APPR FAIL'].map(s => (
                  <div key={s} className="px-3 py-2 bg-white rounded border border-zinc-100 text-xs font-mono text-zinc-600 flex items-center justify-center shadow-sm">
                    {s}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Response Example */}
        <div className="space-y-8">
          <div className="bg-inverse-surface p-6 rounded-xl shadow-2xl">
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase block mb-4">Response Example</span>
            <pre className="text-xs font-mono leading-relaxed text-zinc-300">
{`{
  "orderId": "CJ_ORD_ABC123",
  "userId": "user_hash_1",
  "amount": 15000,
  "status": "APPROVAL",
  "paymentMethodId": "kakaoPay",
  "paymentId": "TID_9921_AF02",
  "createdAt": "2024-10-27T10:00:00",
  "approvalAt": "2024-10-27T10:00:30"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDoc;
