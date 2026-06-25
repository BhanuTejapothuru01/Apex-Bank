import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DemoSiteBanner from '@/components/DemoSiteBanner';

const CustomerApp = lazy(() => import('@/features/customer/App'));
const EmployeeApp = lazy(() => import('@/features/employee/App'));
const AdminApp = lazy(() => import('@/features/admin/App'));
const SuperAdminApp = lazy(() => import('@/features/super-admin/App'));

function RouteLoader() {
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
      Loading…
    </div>
  );
}

function LandingPage() {
  return (
    <iframe
      src="/landing.html"
      title="Apex Bank"
      scrolling="yes"
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '-webkit-fill-available',
        border: 'none',
        display: 'block',
      }}
    />
  );
}

export default function App() {
  const location = useLocation();
  const showDemoBanner = /^\/(customer|employee|admin|super-admin)/.test(location.pathname);

  return (
    <>
      {showDemoBanner && <DemoSiteBanner />}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/customer"
        element={
          <ProtectedRoute portal="customer">
            <Suspense fallback={<RouteLoader />}>
              <CustomerApp />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute portal="employee">
            <Suspense fallback={<RouteLoader />}>
              <EmployeeApp />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute portal="admin">
            <Suspense fallback={<RouteLoader />}>
              <AdminApp />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute portal="super-admin">
            <Suspense fallback={<RouteLoader />}>
              <SuperAdminApp />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
