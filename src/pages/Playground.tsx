import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../api';
import type { AdminApiDetail, AdminApiField } from '../api/admin';
import { fetchPublicApiDetail, fetchPublicApiEntries } from '../api/docs';
import { getApiDocSlug, sortFieldsByScopeAndOrder } from '../utils/apiDocs';

type FieldValueMap = Record<string, string>;
type CallbackResultType = 'success' | 'cancel' | 'fail';

interface CallbackMessagePayload {
  type: 'pg-playground-callback';
  resultType: CallbackResultType;
  params: Record<string, string>;
}

function getExampleValue(field: AdminApiField): string | number | boolean | null | Record<string, never> | [] {
  if (field.sampleValue) {
    if (field.fieldType === 'Integer' || field.fieldType === 'Long' || field.fieldType === 'Number') {
      const numericValue = Number(field.sampleValue);
      return Number.isNaN(numericValue) ? field.sampleValue : numericValue;
    }

    if (field.fieldType === 'Boolean') {
      return field.sampleValue.toLowerCase() === 'true';
    }

    return field.sampleValue;
  }

  if (field.defaultValue) {
    return field.defaultValue;
  }

  switch (field.fieldType) {
    case 'Integer':
    case 'Long':
    case 'Number':
      return 0;
    case 'Boolean':
      return false;
    case 'Object':
      return {};
    case 'Array':
      return [];
    case 'LocalDateTime':
      return '2026-04-08T12:00:00';
    default:
      return '';
  }
}

function stringifyExampleValue(field: AdminApiField) {
  const value = getExampleValue(field);
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

function parseFieldValue(field: AdminApiField, rawValue?: string): unknown {
  if (rawValue === undefined || rawValue === '') {
    return getExampleValue(field);
  }

  switch (field.fieldType) {
    case 'Integer':
    case 'Long':
    case 'Number': {
      const numericValue = Number(rawValue);
      return Number.isNaN(numericValue) ? rawValue : numericValue;
    }
    case 'Boolean':
      return rawValue.toLowerCase() === 'true';
    case 'Object':
    case 'Array':
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    default:
      return rawValue;
  }
}

function buildBodyPayload(fields: AdminApiField[], fieldValues: FieldValueMap) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.fieldName] = parseFieldValue(field, fieldValues[field.fieldName]);
    return acc;
  }, {});
}

function buildInitialFieldValues(fields: AdminApiField[]) {
  return fields.reduce<FieldValueMap>((acc, field) => {
    acc[field.fieldName] = stringifyExampleValue(field);
    return acc;
  }, {});
}

function replacePathSegments(endpoint: string, pathFields: AdminApiField[], fieldValues: FieldValueMap) {
  let resolvedEndpoint = endpoint;

  pathFields.forEach((field, index) => {
    const rawValue = fieldValues[field.fieldName] ?? '';
    const encodedValue = encodeURIComponent(rawValue);

    if (resolvedEndpoint.includes(`:${field.fieldName}`) || resolvedEndpoint.includes(`{${field.fieldName}}`)) {
      resolvedEndpoint = resolvedEndpoint
        .replace(`:${field.fieldName}`, encodedValue)
        .replace(`{${field.fieldName}}`, encodedValue);
      return;
    }

    if (index === 0) {
      resolvedEndpoint = resolvedEndpoint
        .replace(/:[^/]+/, encodedValue)
        .replace(/\{[^}]+\}/, encodedValue);
    }
  });

  return resolvedEndpoint;
}

function getCallbackUrl(type: CallbackResultType) {
  if (typeof window === 'undefined' || !API_ROOT) {
    return '';
  }

  return `${API_ROOT}/playground/${type}`;
}

function buildFieldValueMap(
  bodyFields: AdminApiField[],
  pathFields: AdminApiField[],
  queryFields: AdminApiField[],
  headerFields: AdminApiField[],
) {
  const nextFieldValues = buildInitialFieldValues([...bodyFields, ...pathFields, ...queryFields, ...headerFields]);
  nextFieldValues.approvalUrl = getCallbackUrl('success');
  nextFieldValues.cancelUrl = getCallbackUrl('cancel');
  nextFieldValues.failUrl = getCallbackUrl('fail');
  return nextFieldValues;
}

const Playground: React.FC = () => {
  const [apis, setApis] = useState<AdminApiDetail[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [fieldValues, setFieldValues] = useState<FieldValueMap>({});
  const [responseStatus, setResponseStatus] = useState<string>('Ready');
  const [responseBody, setResponseBody] = useState<string>('아직 호출 결과가 없습니다.');
  const [responseMeta, setResponseMeta] = useState<{ durationMs?: number; sizeBytes?: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string>();
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<string>();
  const lastOrderIdRef = useRef<string>();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const entries = await fetchPublicApiEntries();
        const details = await Promise.all(entries.map((entry) => fetchPublicApiDetail(entry.id)));

        if (!mounted) {
          return;
        }

        setApis(details);

        const firstApi = details[0];
        if (!firstApi) {
          setSelectedApiId('');
          setResponseBody('표시할 API가 없습니다.');
          return;
        }

        setSelectedApiId(firstApi.id);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : 'API 테스트 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedApi = useMemo(
    () => apis.find((api) => api.id === selectedApiId) ?? apis[0] ?? null,
    [apis, selectedApiId],
  );

  const requestFields = useMemo(
    () => sortFieldsByScopeAndOrder(selectedApi?.fields ?? [], 'REQUEST'),
    [selectedApi],
  );
  const bodyFields = useMemo(
    () => requestFields.filter((field) => field.fieldLocation === 'BODY'),
    [requestFields],
  );
  const pathFields = useMemo(
    () => requestFields.filter((field) => field.fieldLocation === 'PATH'),
    [requestFields],
  );
  const queryFields = useMemo(
    () => requestFields.filter((field) => field.fieldLocation === 'QUERY'),
    [requestFields],
  );
  const headerFields = useMemo(
    () => requestFields.filter((field) => field.fieldLocation === 'HEADER'),
    [requestFields],
  );

  useEffect(() => {
    if (!selectedApi) {
      return;
    }

    setFieldValues(buildFieldValueMap(bodyFields, pathFields, queryFields, headerFields));
    setPendingRedirectUrl(undefined);
    setPendingPaymentMethod(undefined);
  }, [selectedApi, bodyFields, pathFields, queryFields, headerFields]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent<CallbackMessagePayload>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== 'pg-playground-callback') {
        return;
      }

      const orderId = event.data.params.orderId || lastOrderIdRef.current;
      const callbackSnapshot = {
        resultType: event.data.resultType,
        params: event.data.params,
      };

      setPendingRedirectUrl(undefined);
      setPendingPaymentMethod(undefined);

      if (!orderId) {
        const prettyBody = JSON.stringify({ callback: callbackSnapshot }, null, 2);
        setResponseStatus(`CALLBACK ${event.data.resultType.toUpperCase()}`);
        setResponseBody(prettyBody);
        setResponseMeta({
          sizeBytes: new Blob([prettyBody]).size,
        });
        return;
      }

      try {
        const statusResponse = await axios.get(`${API_ROOT}/v1/payments/status/${encodeURIComponent(orderId)}`);
        const prettyBody = JSON.stringify(
          {
            callback: callbackSnapshot,
            latestStatus: statusResponse.data,
          },
          null,
          2,
        );

        setResponseStatus(`CALLBACK ${event.data.resultType.toUpperCase()}`);
        setResponseBody(prettyBody);
        setResponseMeta({
          sizeBytes: new Blob([prettyBody]).size,
        });
      } catch (err) {
        const prettyBody = JSON.stringify(
          {
            callback: callbackSnapshot,
            message: err instanceof Error ? err.message : '상태 재조회에 실패했습니다.',
          },
          null,
          2,
        );

        setResponseStatus(`CALLBACK ${event.data.resultType.toUpperCase()}`);
        setResponseBody(prettyBody);
        setResponseMeta({
          sizeBytes: new Blob([prettyBody]).size,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fullEndpointUrl = selectedApi ? `${API_ROOT}${selectedApi.endpoint}` : '';

  const paymentMethodId = fieldValues.paymentMethodId || 'tossPay';

  const handleFieldValueChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const openPaymentPopup = (url: string, popupName: string) => {
    const width = 480;
    const height = 760;
    const left = window.screenX + Math.max(0, Math.round((window.outerWidth - width) / 2));
    const top = window.screenY + Math.max(0, Math.round((window.outerHeight - height) / 2));
    const popup = window.open(
      url,
      popupName,
      `popup=yes,width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      const blockedBody = JSON.stringify(
        {
          message: '브라우저가 팝업을 차단했습니다. 팝업 차단을 해제한 뒤 다시 시도해 주세요.',
          next_redirect_pc_url: url,
        },
        null,
        2,
      );
      setResponseStatus('POPUP BLOCKED');
      setResponseBody(blockedBody);
      setResponseMeta({
        sizeBytes: new Blob([blockedBody]).size,
      });
      return;
    }

    popup.focus();
  };

  const handleOpenRedirect = () => {
    if (!pendingRedirectUrl) {
      return;
    }

    openPaymentPopup(pendingRedirectUrl, 'pg-guide-payment');
  };

  const handleSubmit = async () => {
    if (!selectedApi) {
      return;
    }

    setSubmitting(true);
    setResponseStatus('Loading');
    setResponseBody('호출 중입니다...');
    setResponseMeta({});
    const startedAt = performance.now();

    try {
      const resolvedEndpoint = replacePathSegments(selectedApi.endpoint, pathFields, fieldValues);
      const resolvedUrl = `${API_ROOT}${resolvedEndpoint}`;

      const queryParams = queryFields.reduce<Record<string, string>>((acc, field) => {
        const value = fieldValues[field.fieldName];
        if (value) {
          acc[field.fieldName] = value;
        }
        return acc;
      }, {});

      const headers = headerFields.reduce<Record<string, string>>((acc, field) => {
        const value = fieldValues[field.fieldName];
        if (value) {
          acc[field.fieldName] = value;
        }
        return acc;
      }, {});

      let payload: unknown = undefined;
      if (bodyFields.length > 0) {
        payload = buildBodyPayload(bodyFields, fieldValues);
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.request({
        method: selectedApi.method,
        url: resolvedUrl,
        params: queryParams,
        headers,
        data: payload,
      });

      const durationMs = Math.round(performance.now() - startedAt);
      const prettyBody = JSON.stringify(response.data, null, 2);

      const responseData = response.data?.data;
      const redirectUrl = responseData?.nextRedirectPcUrl;
      const orderId = responseData?.orderId;

      if (orderId) {
        lastOrderIdRef.current = orderId;
      }

      setResponseStatus(`${response.status} ${response.statusText}`.trim());
      setResponseBody(prettyBody);
      setResponseMeta({
        durationMs,
        sizeBytes: new Blob([prettyBody]).size,
      });

      if (selectedApi.endpoint.includes('/request') && redirectUrl) {
        const resolvedRedirectUrl = redirectUrl.startsWith('http') ? redirectUrl : `${API_ROOT}${redirectUrl}`;
        setPendingRedirectUrl(resolvedRedirectUrl);
        setPendingPaymentMethod(paymentMethodId);
        openPaymentPopup(resolvedRedirectUrl, `pg-guide-${paymentMethodId ?? 'payment'}`);
      } else {
        setPendingRedirectUrl(undefined);
        setPendingPaymentMethod(undefined);
      }
    } catch (err) {
      const durationMs = Math.round(performance.now() - startedAt);

      if (axios.isAxiosError(err)) {
        const status = err.response ? `${err.response.status} ${err.response.statusText}`.trim() : 'Network Error';
        const errorBody = err.response?.data ?? { message: err.message };
        const prettyBody = JSON.stringify(errorBody, null, 2);

        setResponseStatus(status);
        setResponseBody(prettyBody);
        setResponseMeta({
          durationMs,
          sizeBytes: new Blob([prettyBody]).size,
        });
      } else {
        const fallbackBody = JSON.stringify(
          { message: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' },
          null,
          2,
        );
        setResponseStatus('Error');
        setResponseBody(fallbackBody);
        setResponseMeta({
          durationMs,
          sizeBytes: new Blob([fallbackBody]).size,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm font-bold text-zinc-500">API 테스트 화면을 준비하는 중입니다...</div>;
  }

  if (error) {
    return <div className="p-8 text-sm font-bold text-red-600">{error}</div>;
  }

  if (!selectedApi) {
    return <div className="p-8 text-sm font-bold text-zinc-500">테스트할 API가 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 p-8 duration-500">
      <div className="mb-10 flex flex-col gap-4">
        <div>
          <h1 className="mb-3 text-3xl font-black text-zinc-900">API 테스트</h1>
          <p className="font-medium tracking-tight text-zinc-500">
            관리자 화면에서 정의한 API 메타데이터를 기준으로 요청을 채우고 결과를 바로 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
          <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-400">
              테스트할 API
            </label>
            <select
              value={selectedApi.id}
              onChange={(event) => setSelectedApiId(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700 outline-none transition focus:border-primary/30 focus:bg-white"
            >
              {apis.map((api) => (
                <option key={api.id} value={api.id}>
                  {api.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-zinc-400">선택한 경로</div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3">
              <span className="rounded bg-[#0058bc] px-3 py-1 text-xs font-black text-white">{selectedApi.method}</span>
              <code className="break-all text-sm font-bold text-zinc-700">{fullEndpointUrl}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="text-sm font-bold text-zinc-400">
          {pendingRedirectUrl && pendingPaymentMethod === 'kakaoPay'
            ? '카카오페이는 응답으로 받은 URL을 클릭해 결제를 이어갑니다.'
            : pendingRedirectUrl && pendingPaymentMethod === 'tossPay'
              ? '토스페이 결제창이 자동으로 열립니다. 완료 후 응답 영역을 확인해 주세요.'
              : '요청 파라미터를 확인한 뒤 API를 호출해보세요.'}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? '호출 중...' : 'API 호출하기'}
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          {(bodyFields.length > 0 || pathFields.length > 0 || queryFields.length > 0 || headerFields.length > 0) && (
            <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-black text-zinc-900">Request</h2>
              <div className="space-y-4">
                {[...bodyFields, ...pathFields, ...queryFields, ...headerFields].map((field) => (
                  <div key={`${field.fieldLocation}-${field.fieldName}`} className="grid gap-2">
                    <label className="flex items-center gap-2 text-sm font-black text-zinc-700">
                      <span>{field.fieldName}</span>
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-black text-zinc-500">
                        {field.fieldLocation}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={fieldValues[field.fieldName] ?? ''}
                      onChange={(event) => handleFieldValueChange(field.fieldName, event.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none transition focus:border-primary/30 focus:bg-white"
                    />
                    {field.description && <p className="text-xs font-medium text-zinc-400">{field.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-[32px] bg-zinc-900 p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
          <div className="relative z-10 mb-8 flex items-center justify-between">
            <h3 className="text-xl font-black">Response</h3>
            <span
              className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                responseStatus.startsWith('2')
                  ? 'bg-green-500/20 text-green-400'
                  : responseStatus === 'Loading'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : responseStatus === 'Ready'
                      ? 'bg-white/10 text-zinc-300'
                      : 'bg-red-500/20 text-red-300'
              }`}
            >
              {responseStatus}
            </span>
          </div>

          <div className="relative z-10 mb-6 rounded-2xl bg-white/5 p-4 font-mono text-xs leading-relaxed text-zinc-300">
            <div className="mb-1 font-black text-white">현재 테스트 대상</div>
            <div>{selectedApi.name}</div>
            <div className="mt-2 break-all text-zinc-400">
              {selectedApi.method} {fullEndpointUrl}
            </div>
            <div className="mt-2 text-zinc-500">문서 경로: /api/{getApiDocSlug(selectedApi)}</div>
          </div>

          {pendingRedirectUrl && (
            <button
              type="button"
              onClick={handleOpenRedirect}
              className="relative z-10 mb-6 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-900 transition hover:bg-zinc-100"
            >
              결제창 다시 열기
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </button>
          )}

          <div className="relative z-10 flex-1 overflow-auto rounded-2xl bg-white/5 p-6 font-mono text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap break-all text-white/80">{responseBody}</pre>
          </div>

          <div className="relative z-10 mt-8 border-t border-white/5 pt-8">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-white/40">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${submitting ? 'bg-yellow-400' : 'bg-green-500'}`} />
                {submitting ? 'Calling' : 'Ready'}
              </div>
              {responseMeta.durationMs !== undefined && <span>Time: {responseMeta.durationMs}ms</span>}
              {responseMeta.sizeBytes !== undefined && <span>Size: {responseMeta.sizeBytes} B</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
