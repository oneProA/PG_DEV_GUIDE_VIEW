import React from 'react';

const CancelDoc: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded text-xs tracking-widest uppercase">POST</span>
          <code className="text-sm font-medium text-zinc-500">/v1/payments/cancel</code>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight font-headline">취소하기</h1>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          승인된 결제 건을 취소하거나 환불 처리합니다. 부분 취소와 전체 취소를 모두 지원하며, 취소 사유와 함께 요청 시 즉시 처리됩니다.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-xl font-black mb-6 text-zinc-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          취소 파라미터
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white border border-zinc-100 shadow-sm leading-relaxed">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-zinc-50/50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">필드명</th>
                <th className="px-6 py-4">타입</th>
                <th className="px-6 py-4">설명</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              <tr>
                <td className="px-6 py-5 font-mono text-primary font-bold">payment_id</td>
                <td className="px-6 py-5 text-zinc-400">String</td>
                <td className="px-6 py-5 text-zinc-600 font-medium">취소할 결제의 고유 ID</td>
              </tr>
              <tr>
                <td className="px-6 py-5 font-mono text-primary font-bold">cancel_amount</td>
                <td className="px-6 py-5 text-zinc-400">Number</td>
                <td className="px-6 py-5 text-zinc-600 font-medium">취소할 금액</td>
              </tr>
              <tr>
                <td className="px-6 py-5 font-mono text-primary font-bold">reason</td>
                <td className="px-6 py-5 text-zinc-400">String</td>
                <td className="px-6 py-5 text-zinc-600 font-medium">취소 사유</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CancelDoc;
