export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import LeadOperationalForm from '@/components/LeadOperationalForm';
import LeadSummaryCard from '@/components/LeadSummaryCard';
import { getLeadById } from '@/lib/leads';

export default async function LeadDetailPage({ params }) {
  const lead = await getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Lead #{lead.id}</p>
            <h2>{lead.nombre_completo || 'Sin nombre'}</h2>
            <p className="muted-row">
              {lead.servicio_requerido || 'Sin servicio'} · {lead.pais || 'Sin país'} · Score{' '}
              {lead.p_promedio_ponderado ?? '—'}
            </p>
          </div>

          <Link className="button button-secondary" href="/">
            Volver al dashboard
          </Link>
        </div>
      </section>

      <LeadSummaryCard lead={lead} />
      <LeadOperationalForm lead={lead} />
    </div>
  );
}