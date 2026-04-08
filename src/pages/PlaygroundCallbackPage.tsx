import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

type CallbackResultType = 'success' | 'cancel' | 'fail';

const PlaygroundCallbackPage: React.FC = () => {
  const location = useLocation();
  const { resultType } = useParams<{ resultType: CallbackResultType }>();

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search).entries());

    if (window.opener && resultType) {
      window.opener.postMessage(
        {
          type: 'pg-playground-callback',
          resultType,
          params,
        },
        window.location.origin,
      );
    }

    const timer = window.setTimeout(() => {
      window.close();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [location.search, resultType]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-lg rounded-[28px] border border-zinc-100 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-2xl font-black text-zinc-900">결제 결과를 처리하는 중입니다</h1>
        <p className="text-sm font-medium leading-relaxed text-zinc-500">
          팝업이 자동으로 닫히지 않으면 이 창을 닫고 원래 테스트 화면으로 돌아가 주세요.
        </p>
      </div>
    </div>
  );
};

export default PlaygroundCallbackPage;
