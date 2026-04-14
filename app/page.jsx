import DashboardCards from '@/components/DashboardCards';
import LeadFilters from '@/components/LeadFilters';
import LeadTable from '@/components/LeadTable';
import { getAllLeads, getDashboardStats } from '@/lib/leads';

export default async function HomePage({ searchParams }) {
  const filters = {
    q: searchParams?.q || '',
    country: searchParams?.country || '',
    onlyPending: searchParams?.onlyPending === 'true'
  };

  const [stats, leads] = await Promise.all([
    getDashboardStats(filters),
    getAllLeads(filters)
  ]);

  return (
    <div className="page-stack">
      <section className="hero card">
        <div>
          <p className="eyebrow">Operacion diaria</p>
          <h2>Seguimiento comercial con fechas automaticas</h2>
          <p>
            Esta app esta pensada para que la secretaria solo edite campos operativos: interes,
            objeciones, cotizacion, newsletter, seguimientos 24h / 72h / 7d, observaciones y responsable.
          </p>
        </div>
      </section>

      <DashboardCards stats={stats} />
      <LeadFilters searchParams={searchParams} countries={stats.countries} />
      <LeadTable leads={leads} />
    </div>
  );
}
