export type PortalRole = 'customer' | 'employee' | 'admin' | 'super-admin';

export const PORTAL_PATHS: Record<PortalRole, string> = {
  customer: '/customer',
  employee: '/employee',
  admin: '/admin',
  'super-admin': '/super-admin',
};

export function getSessionPortal(): PortalRole | null {
  const portal = localStorage.getItem('bank_portal');
  if (
    portal === 'customer' ||
    portal === 'employee' ||
    portal === 'admin' ||
    portal === 'super-admin'
  ) {
    return portal;
  }
  return null;
}

export function getSessionUser(): Record<string, unknown> | null {
  const raw = localStorage.getItem('bank_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function setSession(portal: PortalRole, user: Record<string, unknown>) {
  localStorage.setItem('bank_portal', portal);
  localStorage.setItem('bank_user', JSON.stringify({ ...user, portal }));
}

export function clearSession() {
  localStorage.removeItem('bank_portal');
  localStorage.removeItem('bank_user');
}

export function hasPortalAccess(portal: PortalRole): boolean {
  return getSessionPortal() === portal && getSessionUser() !== null;
}
