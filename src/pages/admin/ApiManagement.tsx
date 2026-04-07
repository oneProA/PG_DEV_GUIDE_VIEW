import React, { useEffect, useMemo, useState } from 'react';
import { AdminApiDetail, AdminApiEntry, AdminApiField, fetchAdminApiDetail, fetchAdminApiEntries } from '../../api/admin';

type ApiFormMode = 'create' | 'edit';

interface ApiFormState {
  name: string;
  method: AdminApiEntry['method'];
  version: string;
  endpoint: string;
  description: string;
}

const EMPTY_FORM: ApiFormState = {
  name: '',
  method: 'POST',
  version: '',
  endpoint: '',
  description: '',
};

const EMPTY_FIELDS: AdminApiField[] = [];

const ApiManagement: React.FC = () => {
  const [apis, setApis] = useState<AdminApiEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ApiFormMode>('create');
  const [formValues, setFormValues] = useState<ApiFormState>(EMPTY_FORM);
  const [apiFields, setApiFields] = useState<AdminApiField[]>(EMPTY_FIELDS);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | undefined>();

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

  useEffect(() => {
    loadApis();
  }, []);

  const filteredApis = useMemo(
    () => apis.filter((entry) =>
      [entry.name, entry.endpoint, entry.version, entry.description]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
    [apis, searchTerm],
  );

  const activeApiCount = apis.filter((api) => api.status === '정상 운영').length;
  const inspectionNeededCount = apis.filter((api) => api.status === '점검 필요').length;

  const openCreateForm = () => {
    setFormMode('create');
    setFormValues(EMPTY_FORM);
    setApiFields(EMPTY_FIELDS);
    setDetailError(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = async (api: AdminApiEntry) => {
    setFormMode('edit');
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
        endpoint: api.endpoint,
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
    setFormValues(EMPTY_FORM);
    setApiFields(EMPTY_FIELDS);
    setDetailError(undefined);
    setDetailLoading(false);
  };

  const handleFormChange = <K extends keyof ApiFormState>(field: K, value: ApiFormState[K]) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applyDetailToForm = (detail: AdminApiDetail) => {
    setFormValues({
      name: detail.name,
      method: detail.method,
      version: detail.version,
      endpoint: detail.endpoint,
      description: detail.description ?? '',
    });
    setApiFields(detail.fields);
  };

  const requestFields = apiFields.filter((field) => field.fieldScope === 'REQUEST');
  const responseFields = apiFields.filter((field) => field.fieldScope === 'RESPONSE');

  const renderFieldTable = (title: string, fields: AdminApiField[], emptyMessage: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-zinc-900">{title}</h3>
        <span className="text-[11px] font-bold text-zinc-400">{fields.length}개</span>
      </div>

      <div className="bg-zinc-50/50 rounded-[28px] border border-zinc-100 p-6">
        <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-black text-zinc-400 tracking-widest uppercase mb-4">
          <div className="col-span-3">Field</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-1 text-center">Req</div>
          <div className="col-span-4">Description</div>
        </div>

        {fields.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-6 text-sm font-bold text-zinc-400">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm items-center">
                <div className="col-span-3">
                  <div className="text-xs font-mono font-bold text-zinc-800">{field.fieldName}</div>
                  <div className="text-[10px] font-bold text-zinc-400 mt-1">#{field.fieldOrder}</div>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-black text-zinc-600">
                    {field.fieldType}
                  </span>
                </div>
                <div className="col-span-2 text-xs font-bold text-zinc-500">{field.fieldLocation}</div>
                <div className="col-span-1 text-center">
                  <span className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 text-[10px] font-black ${field.requiredYn === 'Y' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {field.requiredYn}
                  </span>
                </div>
                <div className="col-span-4 text-xs font-bold text-zinc-600">
                  <div>{field.description || '-'}</div>
                  {(field.sampleValue || field.defaultValue) && (
                    <div className="mt-1 text-[10px] text-zinc-400">
                      {field.sampleValue ? `예시: ${field.sampleValue}` : `기본값: ${field.defaultValue}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">API 관리</h1>
          <p className="text-sm text-zinc-500 font-medium">서비스 중인 API 엔드포인트의 상태와 성능을 모니터링합니다.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="API 검색..."
              className="bg-zinc-100/80 border border-zinc-200/50 rounded-full py-2.5 pl-11 pr-4 text-xs font-bold w-64 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="bg-primary hover:brightness-95 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-1 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            API 추가
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">전체 API 수</p>
          <h3 className="text-3xl font-black text-zinc-900 mb-3">{loading ? '...' : apis.length}</h3>
          <div className="text-zinc-400 text-[10px] font-bold">
            {error ? '조회 상태를 확인해 주세요.' : 'pgdev.api_endpoints 기준'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">활성 상태</p>
          <h3 className="text-3xl font-black text-blue-500 mb-3">{loading ? '...' : activeApiCount}</h3>
          <div className="text-zinc-400 text-[10px] font-bold">
            {loading ? '로딩 중...' : `${apis.length ? Math.round((activeApiCount / apis.length) * 100) : 0}% 가동률`}
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">점검 필요</p>
          <h3 className="text-3xl font-black text-red-600 mb-3">{loading ? '...' : inspectionNeededCount}</h3>
          <div className="text-red-500 text-[10px] font-bold">
            즉시 확인 권장
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <p className="text-[11px] font-black text-zinc-400 tracking-widest mb-2">평균 응답 속도</p>
          <h3 className="text-3xl font-black text-zinc-900 mb-3">42ms</h3>
          <div className="text-zinc-400 text-[10px] font-bold">
            최적화 상태
          </div>
        </div>
      </div>

      {/* API List Table */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] mb-10 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-50 relative">
          <h2 className="text-lg font-black text-zinc-900">API 목록</h2>
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-2 hover:text-zinc-800 transition-colors"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
            <button type="button" onClick={loadApis} className="p-2 hover:text-zinc-800 transition-colors"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider">이름 / 엔드포인트</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-32">버전</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-40">상태</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-48">마지막 수정일</th>
              <th className="px-8 py-5 text-[11px] font-black text-zinc-400 tracking-wider w-24 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-zinc-500 font-bold">
                  API 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-red-600 font-bold">
                  {error}
                </td>
              </tr>
            ) : filteredApis.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-zinc-500 font-bold">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filteredApis.map((api) => (
                <tr key={api.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-[13px] text-zinc-900 mb-1">{api.name}</div>
                    <div className="font-mono text-[11px] text-zinc-400">{api.endpoint}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg">{api.version}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${api.status === '정상 운영' ? 'text-blue-500' : 'text-red-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${api.status === '정상 운영' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                      {api.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-zinc-400">
                    {api.lastModified}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button type="button" onClick={() => openEditForm(api)} className="text-zinc-400 hover:text-zinc-800 transition-colors p-1">
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-zinc-50">
           <span className="text-[11px] font-bold text-zinc-400 tracking-wider">
             {loading ? '조회 중...' : `총 ${filteredApis.length}건 / 원본 ${apis.length}건`}
           </span>
           <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
              <button className="px-3 py-1.5 hover:text-zinc-800 transition-colors">이전</button>
              <button className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">1</button>
              <button className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors">2</button>
              <button className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors">3</button>
              <button className="px-3 py-1.5 hover:text-zinc-800 transition-colors">다음</button>
           </div>
        </div>
      </div>

      {/* Form Setup Section */}
      {isFormOpen && (
      <div className="bg-white rounded-[32px] border border-primary/10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] p-10 relative overflow-hidden ring-1 ring-zinc-50">
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
         
         <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#fff0f7] text-primary rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                  <span className="material-symbols-outlined text-2xl">grid_view</span>
               </div>
               <div>
                  <h2 className="text-xl font-black text-zinc-900 mb-1">
                    {formMode === 'create' ? 'API 정보 등록' : 'API 정보 수정'}
                  </h2>
                  <p className="text-[11px] font-bold text-zinc-400 tracking-wider">
                    {formMode === 'create'
                      ? '새로운 API 엔드포인트를 등록할 수 있습니다.'
                      : '선택한 API 정보를 확인하고 수정할 수 있습니다.'}
                  </p>
               </div>
            </div>
            <button type="button" onClick={closeForm} className="text-zinc-300 hover:text-zinc-800 transition-colors mt-2">
               <span className="material-symbols-outlined text-2xl">close</span>
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 relative z-10">
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">API 이름</label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(event) => handleFormChange('name', event.target.value)}
                    className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300 transition-colors"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">HTTP Method</label>
                     <div className="relative">
                        <select
                           value={formValues.method}
                           onChange={(event) => handleFormChange('method', event.target.value as AdminApiEntry['method'])}
                           className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none appearance-none cursor-pointer hover:border-zinc-200 transition-colors"
                        >
                           <option>POST</option>
                           <option>GET</option>
                           <option>PUT</option>
                           <option>DELETE</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[20px]">expand_more</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">버전</label>
                     <input
                       type="text"
                       value={formValues.version}
                       onChange={(event) => handleFormChange('version', event.target.value)}
                       className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-bold text-zinc-800 outline-none focus:border-zinc-300 transition-colors"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">Endpoint URL</label>
                  <input
                    type="text"
                    value={formValues.endpoint}
                    onChange={(event) => handleFormChange('endpoint', event.target.value)}
                    className="w-full bg-zinc-50/80 border border-zinc-100 rounded-2xl py-4 px-5 text-sm font-mono font-bold text-zinc-800 outline-none focus:border-zinc-300 transition-colors"
                  />
               </div>
            </div>

            <div className="space-y-2 flex flex-col h-full">
               <label className="text-[11px] font-black text-zinc-800 tracking-widest px-1">상세 설명</label>
               <textarea 
                  className="w-full flex-1 bg-zinc-50/80 border border-zinc-100 rounded-2xl p-5 text-[13px] font-bold text-zinc-600 outline-none focus:border-zinc-300 transition-colors resize-none leading-relaxed min-h-[120px]"
                  value={formValues.description}
                  onChange={(event) => handleFormChange('description', event.target.value)}
               ></textarea>
            </div>
         </div>

         <div className="border-t border-zinc-100 pt-8 relative z-10 w-full mb-4 space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-black text-zinc-900">입출력 필드 정의</h3>
                  <p className="text-[11px] font-bold text-zinc-400 mt-1">
                    {formMode === 'create' ? '등록 후 API 버전별 필드를 추가할 수 있습니다.' : '선택한 API 버전에 연결된 요청/응답 필드입니다.'}
                  </p>
               </div>
               {detailLoading && (
                 <span className="text-[11px] font-bold text-zinc-400">필드 정보를 불러오는 중...</span>
               )}
            </div>

            {detailError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {detailError}
              </div>
            )}

            {renderFieldTable('요청 필드', requestFields, '등록된 요청 필드가 없습니다.')}
            {renderFieldTable('응답 필드', responseFields, '등록된 응답 필드가 없습니다.')}

            <div className="mt-12 flex justify-end gap-3">
               <button type="button" onClick={closeForm} className="px-8 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-all active:scale-95 border border-zinc-200">취소</button>
               <button className="bg-primary hover:brightness-95 text-white px-8 py-3 rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-primary/20">
                 {formMode === 'create' ? 'API 등록하기' : '수정 저장하기'}
               </button>
            </div>
         </div>
      </div>
      )}
    </div>
  );
};

export default ApiManagement;
