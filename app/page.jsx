export const dynamic = 'force-dynamic';

import DashboardCards from '@/components/DashboardCards';
import LeadFilters from '@/components/LeadFilters';
import LeadTable from '@/components/LeadTable';
import { buildDashboardStats, getAllLeads } from '@/lib/leads';

export default async function HomePage({ searchParams }) {
  const filters = {
    q: searchParams?.q || '',
    country: searchParams?.country || '',
    onlyPending: searchParams?.onlyPending === 'true'
  };

  try {
    const leads = await getAllLeads(filters);
    const stats = buildDashboardStats(leads);

    return (
      <div className="page-stack">
        <section className="hero card">
          <div>
            <p className="eyebrow">Operacion diaria</p>
            <h2>Seguimiento comercial y panel de secretaria</h2>
            <p>
              La secretaria solo debe actualizar seguimiento comercial: interes, objeciones,
              cotizacion, newsletter, seguimientos 24h / 72h / 7 dias, observaciones y responsable.
            </p>
          </div>
        </section>

        <DashboardCards stats={stats} />
        <LeadFilters searchParams={searchParams} countries={stats.countries} />
        <LeadTable leads={leads} />
      </div>
    );
  } catch (error) {
    return (
      <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Error cargando dashboard</h1>
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