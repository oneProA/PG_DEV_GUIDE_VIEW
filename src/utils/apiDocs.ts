import type { AdminApiEntry, AdminApiField } from '../api/admin';

const API_MENU_ORDER: Record<string, number> = {
  payment: 1,
  cancel: 2,
  status: 3,
};

export function getApiDocSlug(entry: AdminApiEntry): string {
  const endpoint = entry.endpoint.toLowerCase();

  if (endpoint.includes('/cancel')) {
    return 'cancel';
  }

  if (endpoint.includes('/status')) {
    return 'status';
  }

  if (endpoint.includes('/ready') || endpoint.includes('/request')) {
    return 'payment';
  }

  const segments = endpoint
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && !segment.startsWith(':') && !segment.startsWith('{'));

  const fallback = segments[segments.length - 1] ?? entry.id;
  return fallback.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || entry.id;
}

export function sortApiEntries(entries: AdminApiEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }

    const aOrder = API_MENU_ORDER[getApiDocSlug(a)] ?? Number.MAX_SAFE_INTEGER;
    const bOrder = API_MENU_ORDER[getApiDocSlug(b)] ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return Number(a.id) - Number(b.id);
  });
}

export function sortFieldsByScopeAndOrder(fields: AdminApiField[], scope: AdminApiField['fieldScope']) {
  return fields.filter((field) => field.fieldScope === scope).sort((a, b) => a.fieldOrder - b.fieldOrder);
}

export function getApiMenuIcon(entry: AdminApiEntry): string {
  const endpoint = entry.endpoint.toLowerCase();

  if (endpoint.includes('/cancel')) {
    return 'history_toggle_off';
  }

  if (endpoint.includes('/status')) {
    return 'manage_search';
  }

  return 'payments';
}
