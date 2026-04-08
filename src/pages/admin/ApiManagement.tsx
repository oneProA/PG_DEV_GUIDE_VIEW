import React, { useEffect, useMemo, useState } from 'react';
import { API_ROOT } from '../../api';
import {
  AdminApiDetail,
  AdminApiEntry,
  AdminApiField,
  createAdminApi,
  fetchAdminApiDetail,
  fetchAdminApiEntries,
  updateAdminApi,
} from '../../api/admin';

type ApiFormMode = 'create' | 'edit';

interface ApiFormState {
  name: string;
  method: AdminApiEntry['method'];
  version: string;
  displayOrder: number;
  endpoint: string;
  description: string;
}

const EMPTY_FORM: ApiFormState = {
  name: '',
  method: 'POST',
  version: 'v1.0.0',
  displayOrder: 1,
  endpoint: '',
  description: '',
};

const EMPTY_FIELDS: AdminApiField[] = [];
const FIELD_LOCATION_OPTIONS: AdminApiField['fieldLocation'][] = ['BODY', 'QUERY', 'PATH', 'HEADER'];
const REQUIRED_OPTIONS: AdminApiField['requiredYn'][] = ['Y', 'N'];
const FIELD_TYPE_OPTIONS = ['String', 'Integer', 'Long', 'Boolean', 'Number', 'Object', 'Array', 'LocalDateTime'];
const STATUS_ACTIVE = '정상 운영';
const STATUS_NEEDS_ATTENTION = '점검 필요';

const normalizeEndpointPath = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
};

function createEmptyField(fieldScope: AdminApiField['fieldScope']): AdminApiField {
  return {
    id: `new-${fieldScope.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fieldScope,
    fieldLocation: fieldScope === 'RESPONSE' ? 'BODY' : 'QUERY',
    fieldName: '',
    fieldType: 'String',
    requiredYn: 'N',
    fieldOrder: 1,
    description: '',
    sampleValue: '',
    defaultValue: '',
  };
}

const ApiManagement: React.FC = () => {
  const [apis, setApis] = useState<AdminApiEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ApiFormMode>('create');
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ApiFormState>(EMPTY_FORM);
  const [apiFields, setApiFields] = useState<AdminApiField[]>(EMPTY_FIELDS);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | undefined>();
  const [saveLoading, setSaveLoading] = useState(false);

  const loadApis = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetchAdminApiEntries();
      setApis(response);
    } catch (err) {
      setApis([]);
      setError(err instanceof Error ? err.message : 'API 목록을 조회하지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    closeForm();
    await loadApis();
  };

  useEffect(() => {
    loadApis();
  }, []);

  const filteredApis = useMemo(
    () =>
      apis.filter((entry) =>
        [entry.name, entry.endpoint, entry.version, entry.description]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    [apis, searchTerm],
  );

  const activeApiCount = apis.filter((api) => api.status === STATUS_ACTIVE).length;
  const inspectionNeededCount = apis.filter((api) => api.status === STATUS_NEEDS_ATTENTION).length;
  const endpointBaseUrl = API_ROOT.replace(/\/$/, '');

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedApiId(null);
    setFormValues({
      ...EMPTY_FORM,
      displayOrder: (apis.reduce((max, api) => Math.max(max, api.displayOrder), 0) || 0) + 1,
    });
    setApiFields(EMPTY_FIELDS);
    setDetailError(undefined);
    setIsFormOpen(true);
  };

  const applyDetailToForm = (detail: AdminApiDetail) => {
    setFormValues({
      name: detail.name,
      method: detail.method,
      version: detail.version,
      displayOrder: detail.displayOrder,
      endpoint: normalizeEndpointPath(detail.endpoint),
      description: detail.description ?? '',
    });
    setApiFields(detail.fields);
  };

  const openEditForm = async (api: AdminApiEntry) => {
    setFormMode('edit');
    setSelectedApiId(api.id);
    setDetailLoading(true);
    setDetailError(undefined);
    setIsFormOpen(true);
    try {
      const detail = await fetchAdminApiDetail(api.id);
      applyDetailToForm(detail);
    } catch (err) {
      setFormValues({
        name: api.name,
        method: api.method,
        version: api.version,
        displayOrder: api.displayOrder,
        endpoint: normalizeEndpointPath(api.endpoint),
        description: api.description ?? '',
      });
      setApiFields(EMPTY_FIELDS);
      setDetailError(err instanceof Error ? err.message : 'API 상세 정보를 조회하지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setSelectedApiId(null);
    setFormValues(EMPTY_FORM);
    setApiFields(EMPTY_FIELDS);
    setDetailError(undefined);
    setDetailLoading(false);
    setSaveLoading(false);
  };

  const handleFormChange = <K extends keyof ApiFormState>(field: K, value: ApiFormState[K]) => {
    setFormValues((current) => ({
      ...current,
      [field]: field === 'endpoint' ? normalizeEndpointPath(String(value)) : value,
    }));
  };

  const syncFieldOrder = (fields: AdminApiField[]) =>
    fields.map((field, index) => ({
      ...field,
      fieldOrder: index + 1,
    }));

  const updateScopedFields = (
    fieldScope: AdminApiField['fieldScope'],
    updater: (currentScopedFields: AdminApiField[]) => AdminApiField[],
  ) => {
    setApiFields((current) => {
      const scopedFields = current.filter((field) => field.fieldScope === fieldScope);
      const otherFields = current.filter((field) => field.fieldScope !== fieldScope);
      return [...otherFields, ...syncFieldOrder(updater(scopedFields))];
    });
  };

  const handleFieldChange = <K extends keyof AdminApiField>(
    fieldId: string,
    key: K,
    value: AdminApiField[K],
  ) => {
    setApiFields((current) =>
      current.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              [key]: key === 'fieldOrder' ? Number(value) || 1 : value,
            }
          : field,
      ),
    );
  };

  const handleAddField = (fieldScope: AdminApiField['fieldScope']) => {
    updateScopedFields(fieldScope, (currentScopedFields) => [...currentScopedFields, createEmptyField(fieldScope)]);
  };

  const handleRemoveField = (fieldScope: AdminApiField['fieldScope'], fieldId: string) => {
    updateScopedFields(fieldScope, (currentScopedFields) => currentScopedFields.filter((field) => field.id !== fieldId));
  };

  const requestFields = apiFields
    .filter((field) => field.fieldScope === 'REQUEST')
    .sort((a, b) => a.fieldOrder - b.fieldOrder);
  const responseFields = apiFields
    .filter((field) => field.fieldScope === 'RESPONSE')
    .sort((a, b) => a.fieldOrder - b.fieldOrder);

  const buildSavePayload = () => ({
    name: formValues.name.trim(),
    method: formValues.method,
    version: formValues.version.trim(),
    displayOrder: Math.max(1, Number(formValues.displayOrder) || 1),
    endpoint: normalizeEndpointPath(formValues.endpoint),
    description: formValues.description.trim() || undefined,
    fields: apiFields
      .filter((field) => field.fieldName.trim() && field.fieldType.trim())
      .map((field, index) => ({
        fieldScope: field.fieldScope,
        fieldLocation: field.fieldLocation,
        fieldName: field.fieldName.trim(),
        fieldType: field.fieldType.trim(),
        requiredYn: field.requiredYn,
        fieldOrder: index + 1,
        description: field.description?.trim() || undefined,
        sampleValue: field.sampleValue?.trim() || undefined,
        defaultValue: field.defaultValue?.trim() || undefined,
      })),
  });

  const handleSave = async () => {
    const payload = buildSavePayload();

    if (!payload.name || !payload.version || !payload.endpoint) {
      setDetailError('API 이름, 버전, Endpoint URL은 필수입니다.');
      return;
    }

    setSaveLoading(true);
    setDetailError(undefined);

    try {
      if (formMode === 'create') {
        await createAdminApi(payload);
      } else {
        if (!selectedApiId) {
          throw new Error('수정할 API 식별자가 없습니다.');
        }
        await updateAdminApi(selectedApiId, payload);
      }

      await loadApis();
      closeForm();
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'API 저장에 실패했습니다.');
    } finally {
      setSaveLoading(false);
    }
  };

  const renderFieldTable = (
    title: string,
    fields: AdminApiField[],
    emptyMessage: string,
    fieldScope: AdminApiField['fieldScope'],
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-zinc-900">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-zinc-400">{fields.length}개</span>
          <button
            type="button"
            onClick={() => handleAddField(fieldScope)}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-[11px] font-black text-zinc-600 transition-colors hover:bg-zinc-100"
          >
            필드 추가
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-zinc-100 bg-zinc-50/50 p-6">
        <div className="mb-4 grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <div className="col-span-2">Field</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-1 text-center">Req</div>
          <div className="col-span-1 text-center">Order</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-2">Sample</div>
        </div>

        {fields.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-6 text-sm font-bold text-zinc-400">{emptyMessage}</div>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm items-start"
              >
                <div className="col-span-2">
                  <input
                    type="text"
                    value={field.fieldName}
                    onChange={(event) => handleFieldChange(field.id, 'fieldName', event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono font-bold text-zinc-800 outline-none focus:border-zinc-300"
                    placeholder="fieldName"
                  />
                </div>

                <div className="col-span-2">
                  <select
                    value={field.fieldType}
                    onChange={(event) => handleFieldChange(field.id, 'fieldType', event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-zinc-300"
                  >
                    {FIELD_TYPE_OPTIONS.map((typeOption) => (
                      <option key={typeOption} value={typeOption}>
                        {typeOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <select
                    value={field.fieldLocation}
                    onChange={(event) =>
                      handleFieldChange(field.id, 'fieldLocation', event.target.value as AdminApiField['fieldLocation'])
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-zinc-300"
                  >
                    {FIELD_LOCATION_OPTIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <select
                    value={field.requiredYn}
                    onChange={(event) =>
                      handleFieldChange(field.id, 'requiredYn', event.target.value as AdminApiField['requiredYn'])
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center text-xs font-black text-zinc-700 outline-none focus:border-zinc-300"
                  >
                    {REQUIRED_OPTIONS.map((requiredYn) => (
                      <option key={requiredYn} value={requiredYn}>
                        {requiredYn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <input
                    type="number"
                    min={1}
                    value={field.fieldOrder}
                    onChange={(event) => handleFieldChange(field.id, 'fieldOrder', Number(event.target.value) || 1)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center text-xs font-black text-zinc-700 outline-none focus:border-zinc-300"
                  />
                </div>

                <div className="col-span-2">
                  <textarea
                    value={field.description ?? ''}
                    onChange={(event) => handleFieldChange(field.id, 'description', event.target.value)}
                    className="min-h-[74px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-zinc-300"
                    placeholder="필드 설명"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <input
                    type="text"
                    value={field.sampleValue ?? ''}
                    onChange={(event) => handleFieldChange(field.id, 'sampleValue', event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-zinc-300"
                    placeholder="예시값"
                  />
                  <input
                    type="text"
                    value={field.defaultValue ?? ''}
                    onChange={(event) => handleFieldChange(field.id, 'defaultValue', event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-zinc-300"
                    placeholder="기본값"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(fieldScope, field.id)}
                    className="w-full rounded-xl border border-red-200 px-3 py-2 text-[11px] font-black text-red-600 transition-colors hover:bg-red-50"
                  >
                    필드 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 animate-in fade-in rounded-tl-3xl bg-[#f9fafb] p-8 duration-500">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-black text-zinc-900">API 관리</h1>
          <p className="text-sm font-medium text-zinc-500">운영 중인 API 메타데이터와 필드 정의를 관리합니다.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="API 검색..."
              className="w-64 rounded-full border border-zinc-200/50 bg-zinc-100/80 py-2.5 pl-11 pr-10 text-xs font-bold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                aria-label="검색어 지우기"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:brightness-95 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            API 추가
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-[24px] border border-zinc-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
          <p className="mb-2 text-[11px] font-black tracking-widest text-zinc-400">전체 API 수</p>
          <h3 className="mb-3 text-3xl font-black text-zinc-900">{loading ? '...' : apis.length}</h3>
          <div className="text-[10px] font-bold text-zinc-400">{error ? '조회 상태를 확인해 주세요.' : 'pgdev.api_endpoints 기준'}</div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] border border-zinc-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
          <p className="mb-2 text-[11px] font-black tracking-widest text-zinc-400">활성 상태</p>
          <h3 className="mb-3 text-3xl font-black text-blue-500">{loading ? '...' : activeApiCount}</h3>
          <div className="text-[10px] font-bold text-zinc-400">
            {loading ? '로딩 중...' : `${apis.length ? Math.round((activeApiCount / apis.length) * 100) : 0}% 가동중`}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] border border-zinc-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
          <p className="mb-2 text-[11px] font-black tracking-widest text-zinc-400">점검 필요</p>
          <h3 className="mb-3 text-3xl font-black text-red-600">{loading ? '...' : inspectionNeededCount}</h3>
          <div className="text-[10px] font-bold text-red-500">즉시 확인 권장</div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] border border-zinc-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
          <p className="mb-2 text-[11px] font-black tracking-widest text-zinc-400">평균 응답 속도</p>
          <h3 className="mb-3 text-3xl font-black text-zinc-900">42ms</h3>
          <div className="text-[10px] font-bold text-zinc-400">최적화 상태</div>
        </div>
      </div>

      <div className="mb-10 overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        <div className="relative flex items-center justify-between border-b border-zinc-50 px-8 py-6">
          <h2 className="text-lg font-black text-zinc-900">API 목록</h2>
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-2 transition-colors hover:text-zinc-800">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            <button type="button" onClick={handleRefresh} className="p-2 transition-colors hover:text-zinc-800">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-8 py-5 text-[11px] font-black tracking-wider text-zinc-400">이름 / 엔드포인트</th>
              <th className="w-32 px-8 py-5 text-[11px] font-black tracking-wider text-zinc-400">버전</th>
              <th className="w-40 px-8 py-5 text-[11px] font-black tracking-wider text-zinc-400">상태</th>
              <th className="w-48 px-8 py-5 text-[11px] font-black tracking-wider text-zinc-400">마지막 수정일</th>
              <th className="w-24 px-8 py-5 text-center text-[11px] font-black tracking-wider text-zinc-400">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center font-bold text-zinc-500">
                  API 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center font-bold text-red-600">
                  {error}
                </td>
              </tr>
            ) : filteredApis.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center font-bold text-zinc-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filteredApis.map((api) => (
                <tr key={api.id} className="transition-colors hover:bg-zinc-50/50">
                  <td className="px-8 py-6">
                    <div className="mb-1 text-[13px] font-black text-zinc-900">{api.name}</div>
                    <div className="font-mono text-[11px] text-zinc-400">{api.endpoint}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[10px] font-bold text-zinc-600">{api.version}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${api.status === STATUS_ACTIVE ? 'text-blue-500' : 'text-red-500'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${api.status === STATUS_ACTIVE ? 'bg-blue-500' : 'bg-red-500'}`} />
                      {api.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-zinc-400">{api.lastModified}</td>
                  <td className="px-8 py-6 text-center">
                    <button
                      type="button"
                      onClick={() => openEditForm(api)}
                      className="p-1 text-zinc-400 transition-colors hover:text-zinc-800"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-zinc-50 px-8 py-5">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400">
            {loading ? '조회 중...' : `총 ${filteredApis.length}건 / 원본 ${apis.length}건`}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
            <button className="px-3 py-1.5 transition-colors hover:text-zinc-800">이전</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">1</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100">2</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100">3</button>
            <button className="px-3 py-1.5 transition-colors hover:text-zinc-800">다음</button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-white p-10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] ring-1 ring-zinc-50">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />

          <div className="relative z-10 mb-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-[#fff0f7] text-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">grid_view</span>
              </div>
              <div>
                <h2 className="mb-1 text-xl font-black text-zinc-900">
                  {formMode === 'create' ? 'API 정보 등록' : 'API 정보 수정'}
                </h2>
                <p className="text-[11px] font-bold tracking-wider text-zinc-400">
                  {formMode === 'create'
                    ? '새로운 API 메타데이터를 등록합니다.'
                    : '선택한 API 정보와 필드 정의를 수정합니다.'}
                </p>
              </div>
            </div>
            <button type="button" onClick={closeForm} className="mt-2 text-zinc-300 transition-colors hover:text-zinc-800">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div className="relative z-10 mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">API 이름</label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(event) => handleFormChange('name', event.target.value)}
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/80 px-5 py-4 text-sm font-bold text-zinc-800 outline-none transition-colors focus:border-zinc-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">HTTP Method</label>
                  <div className="relative">
                    <select
                      value={formValues.method}
                      onChange={(event) => handleFormChange('method', event.target.value as AdminApiEntry['method'])}
                      className="w-full appearance-none rounded-2xl border border-zinc-100 bg-zinc-50/80 px-5 py-4 text-sm font-bold text-zinc-800 outline-none transition-colors hover:border-zinc-200"
                    >
                      <option>POST</option>
                      <option>GET</option>
                      <option>PUT</option>
                      <option>DELETE</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-zinc-400">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">버전</label>
                  <input
                    type="text"
                    value={formValues.version}
                    onChange={(event) => handleFormChange('version', event.target.value)}
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/80 px-5 py-4 text-sm font-bold text-zinc-800 outline-none transition-colors focus:border-zinc-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">표시 순서</label>
                  <input
                    type="number"
                    min={1}
                    value={formValues.displayOrder}
                    onChange={(event) => handleFormChange('displayOrder', Math.max(1, Number(event.target.value) || 1))}
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/80 px-5 py-4 text-sm font-bold text-zinc-800 outline-none transition-colors focus:border-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">Endpoint URL</label>
                <div className="flex w-full overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/80 transition-colors focus-within:border-zinc-300">
                  <div className="shrink-0 border-r border-zinc-100 bg-zinc-100/80 px-5 py-4 text-sm font-mono font-bold text-zinc-400">
                    {endpointBaseUrl}
                  </div>
                  <input
                    type="text"
                    value={formValues.endpoint}
                    onChange={(event) => handleFormChange('endpoint', event.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm font-mono font-bold text-zinc-800 outline-none"
                    placeholder="/api/example"
                  />
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col space-y-2">
              <label className="px-1 text-[11px] font-black tracking-widest text-zinc-800">상세 설명</label>
              <textarea
                className="min-h-[120px] w-full flex-1 resize-none rounded-2xl border border-zinc-100 bg-zinc-50/80 p-5 text-[13px] font-bold leading-relaxed text-zinc-600 outline-none transition-colors focus:border-zinc-300"
                value={formValues.description}
                onChange={(event) => handleFormChange('description', event.target.value)}
              />
            </div>
          </div>

          <div className="relative z-10 mb-4 w-full space-y-8 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-zinc-900">입출력 필드 정의</h3>
                <p className="mt-1 text-[11px] font-bold text-zinc-400">
                  {formMode === 'create'
                    ? '등록할 API 버전의 요청/응답 필드를 직접 추가할 수 있습니다.'
                    : '선택한 API 버전에 연결된 요청/응답 필드를 수정할 수 있습니다.'}
                </p>
              </div>
              {detailLoading && <span className="text-[11px] font-bold text-zinc-400">필드 정보를 불러오는 중...</span>}
            </div>

            {detailError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {detailError}
              </div>
            )}

            {renderFieldTable('요청 필드', requestFields, '등록된 요청 필드가 없습니다.', 'REQUEST')}
            {renderFieldTable('응답 필드', responseFields, '등록된 응답 필드가 없습니다.', 'RESPONSE')}

            <div className="mt-12 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-zinc-200 px-8 py-3 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-100 active:scale-95"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveLoading}
                className="rounded-xl bg-primary px-8 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveLoading ? '저장 중...' : formMode === 'create' ? 'API 등록하기' : '수정 저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;
