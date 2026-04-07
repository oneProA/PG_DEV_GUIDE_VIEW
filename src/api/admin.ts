import axios from 'axios';
import { API_ROOT } from './index';

export type AdminApiEntryStatus = '정상 운영' | '연결 지연' | '점검 필요';
export type AdminApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface AdminApiEntry {
  id: string;
  name: string;
  endpoint: string;
  method: AdminApiHttpMethod;
  version: string;
  status: AdminApiEntryStatus;
  lastModified: string;
  description?: string;
}

export interface AdminApiField {
  id: string;
  fieldScope: 'REQUEST' | 'RESPONSE' | 'HEADER';
  fieldLocation: 'BODY' | 'QUERY' | 'PATH' | 'HEADER';
  fieldName: string;
  fieldType: string;
  requiredYn: 'Y' | 'N';
  fieldOrder: number;
  description?: string;
  sampleValue?: string;
  defaultValue?: string;
}

export interface AdminApiDetail extends AdminApiEntry {
  fields: AdminApiField[];
}

const ADMIN_API_BASE_URL = `${API_ROOT}/admin/api`;

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function toAdminApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      return new Error(serverMessage ?? '로그인이 필요합니다. 다시 로그인해 주세요.');
    }

    if (status === 403) {
      return new Error(serverMessage ?? '관리자 권한이 없어 API 목록을 조회할 수 없습니다.');
    }

    if (status === 404) {
      return new Error(serverMessage ?? '관리자 API 경로(/api/admin/api)를 찾을 수 없습니다.');
    }

    if (status && status >= 500) {
      return new Error(serverMessage ?? '관리자 API 서버 오류로 목록 조회에 실패했습니다.');
    }

    if (error.request && !error.response) {
      return new Error('API 서버에 연결할 수 없습니다. 서버 주소와 실행 상태를 확인해 주세요.');
    }

    return new Error(serverMessage ?? 'API 목록 조회 중 오류가 발생했습니다.');
  }

  return error instanceof Error ? error : new Error('API 목록 조회 중 알 수 없는 오류가 발생했습니다.');
}

function normalizeAdminApiEntries(payload: unknown): AdminApiEntry[] {
  if (Array.isArray(payload)) {
    return payload as AdminApiEntry[];
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminApiEntry[] }).data;
  }

  throw new Error('관리자 API 목록 응답 형식이 올바르지 않습니다.');
}

function normalizeAdminApiDetail(payload: unknown): AdminApiDetail {
  if (payload && typeof payload === 'object' && 'data' in payload && (payload as { data?: unknown }).data) {
    return (payload as { data: AdminApiDetail }).data;
  }

  if (payload && typeof payload === 'object' && 'id' in payload) {
    return payload as AdminApiDetail;
  }

  throw new Error('관리자 API 상세 응답 형식이 올바르지 않습니다.');
}

export async function fetchAdminApiEntries(): Promise<AdminApiEntry[]> {
  try {
    const token = getAccessToken();
    const response = await axios.get(ADMIN_API_BASE_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return normalizeAdminApiEntries(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function refreshAdminApiEntries(): Promise<AdminApiEntry[]> {
  return fetchAdminApiEntries();
}

export async function fetchAdminApiDetail(id: string): Promise<AdminApiDetail> {
  try {
    const token = getAccessToken();
    const response = await axios.get(`${ADMIN_API_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return normalizeAdminApiDetail(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}
