const LOCAL_API_ROOT = 'http://localhost:8080';
const DEPLOYED_VIEW_ORIGIN = 'https://pg-dev-guide-view-six.vercel.app';
const DEPLOYED_API_ROOT = 'https://pg-dev-guide-api-692488808235.us-central1.run.app';

function resolveApiRoot(): string {
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST;
  }

  if (typeof window !== 'undefined' && window.location.origin === DEPLOYED_VIEW_ORIGIN) {
    return DEPLOYED_API_ROOT;
  }

  return LOCAL_API_ROOT;
}

export const API_ROOT = resolveApiRoot();

export const API_BASE_URL = `${API_ROOT}/api`;
export const AUTH_BASE_URL = `${API_ROOT}/auth`;
