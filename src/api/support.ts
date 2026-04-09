import axios from 'axios';
import { API_ROOT } from './index';

const SUPPORT_BASE_URL = `${API_ROOT}/support/inquiries`;

export interface MySupportInquiryEntry {
  inquiryId: string;
  inquiryNo: string;
  categoryCode: 'PAYMENT_ERROR' | 'API_INTEGRATION' | 'ACCOUNT_PERMISSION' | 'ETC';
  title: string;
  status: 'RECEIVED' | 'IN_PROGRESS' | 'ANSWERED';
  createdAt: string;
}

export interface CreateSupportInquiryPayload {
  username: string;
  categoryCode: MySupportInquiryEntry['categoryCode'];
  title: string;
  contentText: string;
  files: Array<{ key: string; file: File }>;
}

function getAuthorizedConfig() {
  const token = localStorage.getItem('token');
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function createSupportInquiry(payload: CreateSupportInquiryPayload): Promise<{ inquiryNo: string }> {
  const formData = new FormData();
  formData.append('username', payload.username);
  formData.append('categoryCode', payload.categoryCode);
  formData.append('title', payload.title);
  formData.append('contentText', payload.contentText);
  payload.files.forEach((item) => {
    formData.append('files', item.file);
    formData.append('fileKeys', item.key);
  });

  const response = await axios.post(SUPPORT_BASE_URL, formData, {
    ...getAuthorizedConfig(),
    headers: {
      ...(getAuthorizedConfig().headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  });
  return unwrapData<{ inquiryNo: string }>(response.data);
}

export async function fetchMySupportInquiries(username: string, size = 100): Promise<MySupportInquiryEntry[]> {
  const response = await axios.get(SUPPORT_BASE_URL, {
    ...getAuthorizedConfig(),
    params: { username, size },
  });
  return unwrapData<MySupportInquiryEntry[]>(response.data);
}
