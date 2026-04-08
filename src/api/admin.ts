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
  displayOrder: number;
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

export interface SaveAdminApiRequest {
  name: string;
  method: AdminApiHttpMethod;
  endpoint: string;
  version: string;
  displayOrder: number;
  status?: AdminApiEntryStatus;
  description?: string;
  fields: Array<Omit<AdminApiField, 'id'>>;
}

const ADMIN_API_BASE_URL = `${API_ROOT}/admin/api`;

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function getAuthorizedConfig() {
  const token = getAccessToken();
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

function toAdminApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      return new Error(serverMessage ?? '로그인이 필요합니다. 다시 로그인해 주세요.');
    }

    if (status === 403) {
      return new Error(serverMessage ?? '관리자 권한이 없어 API를 처리할 수 없습니다.');
    }

    if (status === 404) {
      return new Error(serverMessage ?? '관리자 API 경로를 찾을 수 없습니다.');
    }

    if (status && status >= 500) {
      return new Error(serverMessage ?? '관리자 API 서버 오류로 요청 처리에 실패했습니다.');
    }

    if (error.request && !error.response) {
      return new Error('API 서버에 연결할 수 없습니다. 서버 주소와 실행 상태를 확인해 주세요.');
    }

    return new Error(serverMessage ?? '관리자 API 요청 중 오류가 발생했습니다.');
  }

  return error instanceof Error ? error : new Error('관리자 API 요청 중 알 수 없는 오류가 발생했습니다.');
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export async function fetchAdminApiEntries(): Promise<AdminApiEntry[]> {
  try {
    const response = await axios.get(ADMIN_API_BASE_URL, getAuthorizedConfig());
    return unwrapData<AdminApiEntry[]>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function refreshAdminApiEntries(): Promise<AdminApiEntry[]> {
  return fetchAdminApiEntries();
}

export async function fetchAdminApiDetail(id: string): Promise<AdminApiDetail> {
  try {
    const response = await axios.get(`${ADMIN_API_BASE_URL}/${id}`, getAuthorizedConfig());
    return unwrapData<AdminApiDetail>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function createAdminApi(payload: SaveAdminApiRequest): Promise<AdminApiEntry> {
  try {
    const response = await axios.post(ADMIN_API_BASE_URL, payload, getAuthorizedConfig());
    return unwrapData<AdminApiEntry>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminApi(id: string, payload: SaveAdminApiRequest): Promise<AdminApiEntry> {
  try {
    const response = await axios.put(`${ADMIN_API_BASE_URL}/${id}`, payload, getAuthorizedConfig());
    return unwrapData<AdminApiEntry>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}
