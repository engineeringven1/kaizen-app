import LogoutButton from '@/components/LogoutButton';

export default function AppLayout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Kaizen Structures</p>
          <h1>Leads · Panel de secretaria</h1>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/">Dashboard</a>
          <LogoutButton />
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
