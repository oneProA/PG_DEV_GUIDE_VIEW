import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AdminApiDetail, AdminApiField } from '../../api/admin';
import { API_ROOT } from '../../api';
import { fetchPublicApiDetail, fetchPublicApiEntries } from '../../api/docs';
import { getApiDocSlug, sortApiEntries, sortFieldsByScopeAndOrder } from '../../utils/apiDocs';

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
      return '2026-04-07T12:00:00';
    default:
      return '';
  }
}

function buildExamplePayload(fields: AdminApiField[]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.fieldName] = getExampleValue(field);
    return acc;
  }, {});
}

function toPathValue(value: unknown): string {
  if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
    return encodeURIComponent(JSON.stringify(value));
  }

  return encodeURIComponent(String(value ?? ''));
}

function buildRequestExample(method: string, fullEndpointUrl: string, fields: AdminApiField[]) {
  const pathFields = fields.filter((field) => field.fieldLocation === 'PATH');
  const queryFields = fields.filter((field) => field.fieldLocation === 'QUERY');
  const bodyFields = fields.filter((field) => field.fieldLocation === 'BODY');
  const headerFields = fields.filter((field) => field.fieldLocation === 'HEADER');

  let resolvedUrl = fullEndpointUrl;

  pathFields.forEach((field) => {
    const value = getExampleValue(field);
    resolvedUrl = resolvedUrl
      .replace(`:${field.fieldName}`, toPathValue(value))
      .replace(`{${field.fieldName}}`, toPathValue(value));
  });

  if (queryFields.length > 0) {
    const queryString = queryFields
      .map((field) => `${encodeURIComponent(field.fieldName)}=${toPathValue(getExampleValue(field))}`)
      .join('&');
    resolvedUrl = `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}${queryString}`;
  }

  const methodUpper = method.toUpperCase();
  const headers: Record<string, string> = {};

  if (bodyFields.length > 0) {
    headers['Content-Type'] = 'application/json';
  }

  headerFields.forEach((field) => {
    headers[field.fieldName] = String(getExampleValue(field));
  });

  const lines: string[] = ['async function requestApi() {'];

  if (bodyFields.length > 0) {
    lines.push(`  const payload = ${JSON.stringify(buildExamplePayload(bodyFields), null, 2)};`);
    lines.push('');
  }

  lines.push(`  const response = await fetch("${resolvedUrl}", {`);
  lines.push(`    method: "${methodUpper}",`);

  if (Object.keys(headers).length > 0) {
    const headerEntries = Object.entries(headers);
    lines.push('    headers: {');
    headerEntries.forEach(([key, value], index) => {
      const suffix = index === headerEntries.length - 1 ? '' : ',';
      lines.push(`      "${key}": "${value}"${suffix}`);
    });
    lines.push('    },');
  }

  if (bodyFields.length > 0) {
    lines.push('    body: JSON.stringify(payload),');
  }

  lines.push('  });');
  lines.push('');
  lines.push('  const data = await response.json();');
  lines.push('  console.log(data);');
  lines.push('}');
  lines.push('');
  lines.push('requestApi();');

  return lines.join('\n');
}

const ApiDocPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [detail, setDetail] = useState<AdminApiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const apiEntries = sortApiEntries(await fetchPublicApiEntries());
        if (!mounted) {
          return;
        }

        const targetEntry =
          apiEntries.find((entry) => getApiDocSlug(entry) === slug) ??
          apiEntries.find((entry) => entry.id === slug) ??
          apiEntries[0];

        if (!targetEntry) {
          setDetail(null);
          setLoading(false);
          return;
        }

        const targetSlug = getApiDocSlug(targetEntry);
        if (!slug) {
          navigate(`/api/${targetSlug}`, { replace: true });
        }

        const apiDetail = await fetchPublicApiDetail(targetEntry.id);
        if (!mounted) {
          return;
        }

        setDetail(apiDetail);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setDetail(null);
        setError(err instanceof Error ? err.message : 'API 문서를 불러오지 못했습니다.');
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
  }, [navigate, slug]);

  const requestFields = useMemo(
    () => sortFieldsByScopeAndOrder(detail?.fields ?? [], 'REQUEST'),
    [detail],
  );
  const responseFields = useMemo(
    () => sortFieldsByScopeAndOrder(detail?.fields ?? [], 'RESPONSE'),
    [detail],
  );
  const fullEndpointUrl = detail ? `${API_ROOT}${detail.endpoint}` : '';
  const requestExample = useMemo(
    () => (detail ? buildRequestExample(detail.method, fullEndpointUrl, requestFields) : ''),
    [detail, fullEndpointUrl, requestFields],
  );
  const responseExample = useMemo(
    () => JSON.stringify(buildExamplePayload(responseFields), null, 2),
    [responseFields],
  );

  const renderFieldTable = (title: string, fields: AdminApiField[]) => (
    <section>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-zinc-900">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="border-b border-zinc-100 px-6 py-4">필드명</th>
              <th className="border-b border-zinc-100 px-6 py-4">타입</th>
              <th className="border-b border-zinc-100 px-6 py-4">위치</th>
              <th className="border-b border-zinc-100 px-6 py-4">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-sm font-bold text-zinc-400">
                  등록된 필드가 없습니다.
                </td>
              </tr>
            ) : (
              fields.map((field) => (
                <tr key={field.id}>
                  <td className="px-6 py-4 font-mono font-bold text-primary">
                    {field.fieldName}
                    {field.requiredYn === 'Y' && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-tighter text-error">Required</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-400">{field.fieldType}</td>
                  <td className="px-6 py-4 font-medium text-zinc-500">{field.fieldLocation}</td>
                  <td className="px-6 py-4 font-medium text-zinc-600">
                    <div>{field.description || '-'}</div>
                    {field.sampleValue && <div className="mt-1 text-[11px] text-zinc-400">예시: {field.sampleValue}</div>}
                    {field.defaultValue && <div className="mt-1 text-[11px] text-zinc-400">기본값: {field.defaultValue}</div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  if (loading) {
    return <div className="max-w-5xl text-sm font-bold text-zinc-500">API 문서를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="max-w-5xl text-sm font-bold text-red-600">{error}</div>;
  }

  if (!detail) {
    return <div className="max-w-5xl text-sm font-bold text-zinc-500">표시할 API 문서가 없습니다.</div>;
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase italic tracking-widest text-primary">
              Standard API
            </span>
            <span className="text-sm text-zinc-400">{detail.version}</span>
            <span className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-black text-zinc-600">{detail.status}</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 lg:text-5xl">
            {detail.name}
          </h1>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-600">
            {detail.description || '등록된 API 설명이 없습니다.'}
          </p>
        </div>
      </div>

      <div className="mb-12 rounded-xl border border-zinc-100 bg-zinc-50 p-6 shadow-inner">
        <div className="flex items-center gap-4">
          <span className="rounded bg-[#0058bc] px-3 py-1 text-xs font-bold text-white">{detail.method}</span>
          <code className="text-sm font-bold text-zinc-800">{fullEndpointUrl}</code>
        </div>
      </div>

      <div className="space-y-12">
        {renderFieldTable('요청 필드', requestFields)}
        {renderFieldTable('응답 필드', responseFields)}

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-zinc-900">
            <span className="h-6 w-1.5 rounded-full bg-primary" />
            Request Example
          </h2>
          <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">JavaScript Example</span>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <pre className="whitespace-pre-wrap break-all p-6 text-sm leading-relaxed text-zinc-300">{requestExample}</pre>
          </div>
        </section>

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-zinc-900">
            <span className="h-6 w-1.5 rounded-full bg-primary" />
            Response Example
          </h2>
          <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">JSON Example</span>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <pre className="whitespace-pre-wrap break-all p-6 text-sm leading-relaxed text-zinc-300">{responseExample}</pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApiDocPage;
