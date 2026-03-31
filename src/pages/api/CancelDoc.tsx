import React from 'react';

const CancelDoc: React.FC = () => {
  return (
    <div className="max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase italic">Standard API</span>
            <span className="text-zinc-400 text-sm">v1.2.0</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">취소하기</h1>
          <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
            승인된 결제 건에 대해 취소 또는 환불을 요청합니다. 가맹점 주문 번호를 기반으로 해당 PG사에 취소 명령을 전달합니다.
          </p>
        </div>
      </div>

      {/* API Definition */}
      <div className="mb-12">
        <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-4 border-none shadow-inner bg-zinc-50">
          <span className="bg-[#0058bc] text-white px-3 py-1 rounded text-xs font-bold">POST</span>
          <code className="text-zinc-800 font-mono text-sm">/api/pay/cancel</code>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-on-surface flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              요청 파라미터
            </h2>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-zinc-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-4">파라미터</th>
                    <th className="px-6 py-4">타입</th>
                    <th className="px-6 py-4">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 italic">
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-bold">orderId</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">취소할 가맹점 주문 번호 <span className="text-error text-[10px] font-bold ml-1 uppercase tracker-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-bold">cancelAmount</td>
                    <td className="px-6 py-4 text-zinc-400">int</td>
                    <td className="px-6 py-4">취소 요청 금액 <span className="text-error text-[10px] font-bold ml-1 uppercase tracker-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-bold">cancelReason</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">취소 사유 (기본값: "고객 변심")</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-inverse-surface rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#3e3e3f] px-4 py-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                Response JSON
              </div>
              <pre className="p-6 text-sm font-mono leading-relaxed text-zinc-300 overflow-x-auto">
                {`{
  "orderId": "CJ_ORD_ABC123",
  "paymentMethodId": "kakaoPay",
  "status": "CANCELED",
  "cancelAmount": 15000,
  "remainAmount": 0,
  "canceledAt": "2024-10-27T15:30:00",
  "paymentId": "TID_9921_AF02"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
      {/* Important Notes */}
      <section className="p-8 bg-primary/5 rounded-2xl border border-primary/10 mt-12">
        <div className="flex items-center gap-3 mb-4 text-primary">
          <span className="material-symbols-outlined">info</span>
          <h3 className="font-bold text-lg">주의사항</h3>
        </div>
        <ul className="space-y-3 text-zinc-600 text-sm leading-relaxed">
          <li className="flex gap-2">
            <span className="text-primary font-bold">01.</span>
            가상계좌 결제 건의 경우, 은행 서버 작업 시간(23:50 ~ 00:10)에는 실시간 환불이 지연될 수 있습니다.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">02.</span>
            카드 결제 취소는 카드사 정책에 따라 영업일 기준 3~5일이 소요될 수 있습니다.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">03.</span>
            이미 취소 완료된 건에 대해 중복 취소 요청 시 <code>ALREADY_CANCELLED</code> 에러가 반환됩니다.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CancelDoc;
