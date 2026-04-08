import axios from 'axios';
import { API_ROOT } from './index';
import type { AdminApiDetail, AdminApiEntry } from './admin';

const API_DOCS_BASE_URL = `${API_ROOT}/docs/apis`;

function toDocsApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;

    if (error.request && !error.response) {
      return new Error('API 문서 서버에 연결할 수 없습니다. 서버 주소와 실행 상태를 확인해 주세요.');
    }

    return new Error(serverMessage ?? 'API 문서를 불러오는 중 오류가 발생했습니다.');
  }

  return error instanceof Error ? error : new Error('API 문서를 불러오는 중 알 수 없는 오류가 발생했습니다.');
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export async function fetchPublicApiEntries(): Promise<AdminApiEntry[]> {
  try {
    const response = await axios.get(API_DOCS_BASE_URL);
    return unwrapData<AdminApiEntry[]>(response.data);
  } catch (error) {
    throw toDocsApiError(error);
  }
}

export async function fetchPublicApiDetail(id: string): Promise<AdminApiDetail> {
  try {
    const response = await axios.get(`${API_DOCS_BASE_URL}/${id}`);
    return unwrapData<AdminApiDetail>(response.data);
  } catch (error) {
    throw toDocsApiError(error);
  }
}
