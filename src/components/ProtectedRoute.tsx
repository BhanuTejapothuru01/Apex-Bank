import { useEffect, useState, type ReactNode } from 'react';
import { hasPortalAccess, type PortalRole } from '@/auth/session';

function AccessLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
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
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="h-10 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
