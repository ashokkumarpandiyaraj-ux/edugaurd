import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { DemoSessionProvider, useDemoSession } from './SessionContext';
import { AppShell } from './components/Shell';
import { LoginPage } from './pages/LoginPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const StudentsPage = lazy(() => import('./pages/StudentsPage').then((module) => ({ default: module.StudentsPage })));
const AlertsPage = lazy(() => import('./pages/AlertsPage').then((module) => ({ default: module.AlertsPage })));
const StudentDetailPage = lazy(() => import('./pages/StudentDetailPage').then((module) => ({ default: module.StudentDetailPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const ModelInsightsPage = lazy(() => import('./pages/ModelInsightsPage').then((module) => ({ default: module.ModelInsightsPage })));

function ProtectedLayout() {
  const { signedIn } = useDemoSession();
  const location = useLocation();
  if (!signedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return (
    <AppShell>
      <Suspense fallback={<div className="page-loading"><span className="spinner" /> Loading workspace…</div>}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}

function LandingRedirect() {
  const { signedIn } = useDemoSession();
  return <Navigate to={signedIn ? '/dashboard' : '/login'} replace />;
}

function NotFoundPage() {
  return (
    <div className="not-found panel">
      <span className="eyebrow">Page not found</span>
      <h1>That workspace path is not available.</h1>
      <p>Use the navigation to return to the faculty dashboard.</p>
      <a className="button button-primary" href="/dashboard">Return to dashboard</a>
    </div>
  );
}

function AppRoutes() {
  const { signedIn } = useDemoSession();
  return (
    <Routes>
      <Route path="/" element={<LandingRedirect />} />
      <Route path="/login" element={signedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/model-insights" element={<ModelInsightsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <DemoSessionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoSessionProvider>
  );
}
