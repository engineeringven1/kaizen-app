import './globals.css';

export const metadata = {
  title: 'Kaizen Leads Secretary App',
  description: 'Panel operativo para seguimiento de leads y gestion de secretaria.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="shell">
          <header className="topbar">
            <div>
              <p className="eyebrow">Kaizen Structures</p>
              <h1>Leads · Panel de secretaria</h1>
            </div>
            <nav>
              <a href="/">Dashboard</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
