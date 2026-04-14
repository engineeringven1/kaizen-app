import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { formatDateShort } from '@/lib/utils';

export default function LeadTable({ leads }) {
  if (!leads.length) {
    return (
      <div className="card empty-state">
        <h3>No hay leads para mostrar</h3>
        <p>Ajusta los filtros o conecta Supabase para ver tus datos reales.</p>
      </div>
    );
  }

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Servicio</th>
            <th>Pais / ciudad</th>
            <th>Score</th>
            <th>Estado</th>
            <th>Ultimo contacto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.nombre_completo || 'Sin nombre'}</strong>
                <span className="muted-row">{lead.email || 'Sin email'}</span>
              </td>
              <td>{lead.servicio_requerido || '—'}</td>
              <td>
                {lead.pais || '—'}
                <span className="muted-row">{lead.ciudad || 'Sin ciudad'}</span>
              </td>
              <td>{lead.p_promedio_ponderado ?? '—'}</td>
              <td>
                <StatusBadge status={lead._status} />
                <span className="muted-row">{lead._status.reason}</span>
              </td>
              <td>{formatDateShort(lead.ultimo_contacto || lead.fecha_registro)}</td>
              <td>
                <Link className="button button-secondary button-small" href={`/leads/${lead.id}`}>
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
