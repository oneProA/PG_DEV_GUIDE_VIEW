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

export interface AdminUserActivityLog {
  id: string;
  activityType: string;
  activityTitle: string;
  activityDetail?: string;
  actorUsername?: string;
  createdAt: string;
}

export interface AdminUserEntry {
  id: string;
  username: string;
  name: string;
  email: string;
  status: string;
  role: string;
  phone?: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
}

export interface AdminUserListResponse {
  items: AdminUserEntry[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminUserDetail extends AdminUserEntry {
  activityLogs: AdminUserActivityLog[];
}

const ADMIN_API_BASE_URL = `${API_ROOT}/admin/api`;
const ADMIN_USERS_BASE_URL = `${API_ROOT}/admin/users`;
const ADMIN_INQUIRIES_BASE_URL = `${API_ROOT}/admin/inquiries`;

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

export interface FetchAdminUsersParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export async function fetchAdminUsers(params: FetchAdminUsersParams = {}): Promise<AdminUserListResponse> {
  try {
    const response = await axios.get(ADMIN_USERS_BASE_URL, {
      ...getAuthorizedConfig(),
      params,
    });
    return unwrapData<AdminUserListResponse>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function fetchAdminUserDetail(id: string): Promise<AdminUserDetail> {
  try {
    const response = await axios.get(`${ADMIN_USERS_BASE_URL}/${id}`, getAuthorizedConfig());
    return unwrapData<AdminUserDetail>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export type AdminInquiryStatus = 'RECEIVED' | 'IN_PROGRESS' | 'ANSWERED';

export interface AdminInquiryEntry {
  id: string;
  inquiryNo: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  categoryCode: string;
  title: string;
  preview: string;
  status: AdminInquiryStatus;
  hasAttachments: boolean;
  createdAt: string;
  updatedAt: string;
  answeredAt?: string;
}

export interface AdminInquiryFile {
  id: string;
  inquiryId: string;
  ownerType: 'INQUIRY' | 'ANSWER';
  fileRole: 'ATTACHMENT' | 'INLINE_IMAGE';
  originalFileName: string;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface AdminInquiryDetail extends AdminInquiryEntry {
  contentText: string;
  answerContentText?: string;
  files: AdminInquiryFile[];
}

export interface AdminInquiryListResponse {
  items: AdminInquiryEntry[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface FetchAdminInquiriesParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: AdminInquiryStatus;
  categoryCode?: 'PAYMENT_ERROR' | 'API_INTEGRATION' | 'ACCOUNT_PERMISSION' | 'ETC';
  fromDate?: string;
  toDate?: string;
}

export async function fetchAdminInquiries(params: FetchAdminInquiriesParams = {}): Promise<AdminInquiryListResponse> {
  try {
    const response = await axios.get(ADMIN_INQUIRIES_BASE_URL, {
      ...getAuthorizedConfig(),
      params,
    });
    return unwrapData<AdminInquiryListResponse>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function fetchAdminInquiryDetail(id: string): Promise<AdminInquiryDetail> {
  try {
    const response = await axios.get(`${ADMIN_INQUIRIES_BASE_URL}/${id}`, getAuthorizedConfig());
    return unwrapData<AdminInquiryDetail>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminInquiryStatus(
  id: string,
  status: AdminInquiryStatus,
): Promise<AdminInquiryEntry> {
  try {
    const response = await axios.patch(
      `${ADMIN_INQUIRIES_BASE_URL}/${id}/status`,
      { status },
      getAuthorizedConfig(),
    );
    return unwrapData<AdminInquiryEntry>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export interface UpdateAdminInquiryAnswerRequest {
  answerContentText: string;
  status: AdminInquiryStatus;
}

export async function updateAdminInquiryAnswer(
  id: string,
  payload: UpdateAdminInquiryAnswerRequest,
): Promise<AdminInquiryEntry> {
  try {
    const response = await axios.patch(
      `${ADMIN_INQUIRIES_BASE_URL}/${id}/answer`,
      payload,
      getAuthorizedConfig(),
    );
    return unwrapData<AdminInquiryEntry>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export interface AdminInquiryDashboardSummary {
  todayReceivedCount: number;
  unhandledCount: number;
  avgResponseMinutes: number;
}

export async function fetchAdminInquiryDashboardSummary(): Promise<AdminInquiryDashboardSummary> {
  try {
    const response = await axios.get(`${ADMIN_INQUIRIES_BASE_URL}/dashboard-summary`, getAuthorizedConfig());
    return unwrapData<AdminInquiryDashboardSummary>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function fetchAdminInquiryDashboardUnhandled(limit = 5): Promise<AdminInquiryEntry[]> {
  try {
    const response = await axios.get(`${ADMIN_INQUIRIES_BASE_URL}/dashboard-unhandled`, {
      ...getAuthorizedConfig(),
      params: { limit },
    });
    return unwrapData<AdminInquiryEntry[]>(response.data);
  } catch (error) {
    throw toAdminApiError(error);
  }
}
