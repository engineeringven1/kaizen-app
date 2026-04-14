import { getAllLeads, getDashboardStats } from '@/lib/leads';

export default async function HomePage() {
  try {
    const [stats, leads] = await Promise.all([
      getDashboardStats({}),
      getAllLeads({})
    ]);

    return (
      <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Kaizen Secretary App</h1>
        <p>Conexion a Supabase exitosa.</p>

        <h2>Resumen</h2>
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
            marginBottom: '24px'
          }}
        >
          {JSON.stringify(stats, null, 2)}
        </pre>

        <h2>Primeros 10 leads</h2>
        <ul>
          {(leads || []).slice(0, 10).map((lead) => (
            <li key={lead.id}>
              #{lead.id} - {lead.nombre_completo || 'Sin nombre'} - {lead.servicio_requerido || 'Sin servicio'}
            </li>
          ))}
        </ul>
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