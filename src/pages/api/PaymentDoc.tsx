import React from 'react';

const PaymentDoc: React.FC = () => {
  return (
    <div className="max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase italic">Standard API</span>
            <span className="text-zinc-400 text-sm">v1.2.0</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">결제하기</h1>
          <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
            통합 결제창을 호출하기 위한 사전 준비 단계입니다. 결제 금액, 상품명, 리다이렉트 URL 등을 전달하여 **결제 진입용 URL**을 발급받습니다.
          </p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-[#b7003d] transition-all scale-100 active:scale-95">
          <span className="material-symbols-outlined">play_circle</span>
          API 테스트 도구로 이동
        </button>
      </div>

      {/* API Definition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
          <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-4 border-none shadow-inner bg-zinc-50">
            <span className="bg-[#0058bc] text-white px-3 py-1 rounded text-xs font-bold">POST</span>
            <code className="text-zinc-800 font-mono text-sm">/api/pay/ready</code>
            <button className="ml-auto text-zinc-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">content_copy</span>
            </button>
          </div>
        </div>

        {/* Left Column: Params & Tables */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-on-surface flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              요청 파라미터
            </h2>
            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm border border-zinc-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-surface-container text-zinc-600 font-semibold">
                  <tr>
                    <th className="px-6 py-4">파라미터</th>
                    <th className="px-6 py-4">타입</th>
                    <th className="px-6 py-4">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 italic">
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">paymentMethodId</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">결제 수단 코드 (`kakaoPay`, `tossPay`) <span className="text-error text-[10px] font-bold ml-1 uppercase tracking-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">userId</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">가맹점 사용자 고유 ID <span className="text-error text-[10px] font-bold ml-1 uppercase tracking-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">itemName</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">결제 상품 명칭 <span className="text-error text-[10px] font-bold ml-1 uppercase tracking-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">amount</td>
                    <td className="px-6 py-4 text-zinc-400">int</td>
                    <td className="px-6 py-4">총 결제 금액 <span className="text-error text-[10px] font-bold ml-1 uppercase tracking-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">approvalUrl</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">결제 성공 시 결과를 전달받을 가맹점의 리다이렉트 URL <span className="text-error text-[10px] font-bold ml-1 uppercase tracking-tighter">Required</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-primary font-semibold">orderId</td>
                    <td className="px-6 py-4 text-zinc-400">string</td>
                    <td className="px-6 py-4">가맹점 관리용 주문 번호 (미입력 시 서버 자동 생성)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips Section */}
          <section className="p-6 bg-secondary/5 rounded-xl border border-secondary/10">
            <h4 className="text-sm font-bold text-secondary flex items-center gap-2 mb-2 italic">
               <span className="material-symbols-outlined text-sm">lightbulb</span>
               결제 연동 팁
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              사용자가 결제를 마친 후 가맹점의 `approvalUrl`로 다시 돌아올 때, `status`, `paymentId`, `amount` 등의 데이터가 쿼리 파라미터로 함께 전달됩니다. 이 파라미터들을 이용해 결제 완료 처리를 진행하세요.
            </p>
          </section>
        </div>

        {/* Right Column: Code & JSON */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-inverse-surface rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#3e3e3f] px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Success Response Example</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
              </div>
              <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto text-zinc-300">
                {`{
  "next_redirect_pc_url": "https://online-pay.kakao.com/mock/...",
  "orderId": "CJ_ORD_ABC123"
}`}
              </pre>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 mb-4 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">terminal</span>
                cURL Sample
              </h4>
              <div className="bg-black/50 p-4 rounded font-mono text-[11px] text-zinc-400 break-all leading-relaxed">
                curl -X POST /api/pay/ready \<br/>
                &nbsp;&nbsp;-d "paymentMethodId=kakaoPay" \<br/>
                &nbsp;&nbsp;-d "amount=15000" \<br/>
                &nbsp;&nbsp;-d "itemName=CJ포인트 충전"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDoc;
