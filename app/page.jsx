import { getAllLeads } from '@/lib/leads';

export default async function HomePage() {
  try {
    const leads = await getAllLeads({});

    return (
      <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Kaizen Secretary App</h1>
        <p>Conexion a Supabase exitosa.</p>
        <p>Total leads: {Array.isArray(leads) ? leads.length : 0}</p>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#111827',
            color: '#f9fafb',
            padding: '16px',
            borderRadius: '12px',
            overflowX: 'auto',
            marginTop: '20px'
          }}
        >
          {JSON.stringify(leads?.slice?.(0, 2) || leads, null, 2)}
        </pre>
      </main>
    );
  } catch (error) {
    return (
      <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Error real detectado</h1>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#111827',
            color: '#f9fafb',
            padding: '16px',
            borderRadius: '12px',
            overflowX: 'auto'
          }}
        >
          {error?.message || String(error)}
        </pre>
      </main>
    );
  }
}