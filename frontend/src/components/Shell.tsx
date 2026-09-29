import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Bell, BrainCircuit, ChevronRight, GraduationCap, LayoutDashboard, LogOut, Menu, Settings2, ShieldCheck, TriangleAlert, UsersRound, X } from 'lucide-react';
import { useDemoSession } from '../SessionContext';
import { ApiStatus } from './ApiStatus';

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', path: '/students', icon: UsersRound },
  { label: 'Early Alerts', path: '/alerts', icon: TriangleAlert, badge: '4' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Model Insights', path: '/model-insights', icon: BrainCircuit },
];

type Popover = 'notifications' | 'settings' | 'profile' | null;

export function AppShell({ children }: { children?: ReactNode }) {
  const { signOut } = useDemoSession();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popover, setPopover] = useState<Popover>(null);
  const closePopover = () => setPopover(null);

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <img className="brand-icon" src="/eduguard-icon.png" alt="" />
          <div><strong>EduGuard <span>AI</span></strong><small>Early Academic Risk Intelligence</small></div>
          <button className="mobile-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="sidebar-section-label">FACULTY WORKSPACE</div>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map(({ label, path, icon: Icon, badge }) => (
            <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /> <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
              {label === 'Dashboard' && <ChevronRight className="nav-chevron" size={14} />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-quiet-card">
          <div className="quiet-icon"><ShieldCheck size={16} /></div>
          <strong>Support, not verdicts</strong>
          <p>Signals help faculty review context and offer support. They never decide outcomes.</p>
        </div>
        <div className="sidebar-bottom">
          <div className="mentor-avatar">AM</div>
          <div className="mentor-meta"><strong>Alex Morgan</strong><span>Faculty mentor · Demo</span></div>
          <button className="icon-button sidebar-logout" onClick={handleSignOut} aria-label="Exit demo"><LogOut size={16} /></button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="topbar-context"><span className="context-dot" /><span>Faculty decision support</span><span className="context-divider">/</span><span className="context-term">Autumn term · Week 8</span></div>
          <div className="topbar-right">
            <ApiStatus />
            <div className="popover-anchor">
              <button className={`icon-button top-action${popover === 'notifications' ? ' is-active' : ''}`} aria-label="Notifications" aria-expanded={popover === 'notifications'} onClick={() => setPopover(popover === 'notifications' ? null : 'notifications')}><Bell size={17} /><span className="notification-dot" /></button>
              {popover === 'notifications' && <div className="top-popover"><strong>Faculty review queue</strong><p>4 early-warning signals are ready for review.</p><NavLink to="/alerts" onClick={closePopover}>Open Early Alerts <ChevronRight size={14} /></NavLink></div>}
            </div>
            <div className="popover-anchor settings-anchor">
              <button className={`icon-button top-action${popover === 'settings' ? ' is-active' : ''}`} aria-label="Settings" aria-expanded={popover === 'settings'} onClick={() => setPopover(popover === 'settings' ? null : 'settings')}><Settings2 size={17} /></button>
              {popover === 'settings' && <div className="top-popover settings-popover"><strong>Workspace settings</strong><p>Demo mode is active. No student data is saved to a database.</p><span className="settings-tag"><Activity size={13} /> Local mock-data prototype</span></div>}
            </div>
            <div className="popover-anchor profile-anchor">
              <button className="profile-button" onClick={() => setPopover(popover === 'profile' ? null : 'profile')} aria-expanded={popover === 'profile'}><span className="mentor-avatar small">AM</span><span className="profile-name">Alex Morgan</span></button>
              {popover === 'profile' && <div className="top-popover profile-popover"><strong>Alex Morgan</strong><p>Faculty mentor · Demo workspace</p><button className="popover-button" onClick={handleSignOut}><LogOut size={14} /> Exit demo dashboard</button></div>}
            </div>
          </div>
        </header>
        <main className="main-content" onClick={() => popover && closePopover()}>
          {children ?? <Outlet />}
        </main>
        <footer className="app-footer"><span><GraduationCap size={14} /> Early support signals · Faculty retains final decision</span><span>EduGuard AI <span className="footer-separator">·</span> Prototype</span></footer>
      </div>
    </div>
  );
}
