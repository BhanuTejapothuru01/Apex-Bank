import { useEffect, useState, type ReactNode } from 'react';
import { hasPortalAccess, type PortalRole } from '@/auth/session';

function AccessLoader() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fbf5f7',
        color: '#3a2072',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Verifying secure session…
    </div>
  );
}

export default function ProtectedRoute({
  portal,
  children,
}: {
  portal: PortalRole;
  children: ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!hasPortalAccess(portal)) {
      window.location.href = '/';
      return;
    }
    setAllowed(true);
  }, [portal]);

  if (!allowed) return <AccessLoader />;
  const scrollClass = portal === 'super-admin' ? ' portal-route-shell--scroll' : '';
  return (
    <div className={`portal-route-shell${scrollClass}`}>
      <div className="portal-app-root">{children}</div>
    </div>
  );
}
