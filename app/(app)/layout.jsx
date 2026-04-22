import LogoutButton from '@/components/LogoutButton';

export default function AppLayout({ children }) {
  return (
    <div className="shell">
      <div className="topbar-wrap">
        <header className="topbar">
          <div className="topbar-brand">
            <div className="topbar-logo">K</div>
            <div className="topbar-brand-text">
              <span className="topbar-eyebrow">Kaizen Structures</span>
              <span className="topbar-title">Panel de secretaria</span>
            </div>
          </div>
          <nav className="topbar-nav">
            <a href="/">Dashboard</a>
            <LogoutButton />
          </nav>
        </header>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
