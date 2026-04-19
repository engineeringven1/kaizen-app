import './globals.css';

export const metadata = {
  title: 'Kaizen Leads Secretary App',
  description: 'Panel operativo para seguimiento de leads y gestion de secretaria.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
