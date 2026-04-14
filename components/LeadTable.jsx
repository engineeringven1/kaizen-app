import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { formatDateShort, getNewsletterStatusLabel } from '@/lib/utils';

export default function LeadTable({ leads }) {
  if (!leads.length) {
    return (
      <div className="card empty-state">
        <h3>No hay leads para mostrar</h3>
        <p>No se encontraron resultados con los filtros actuales.</p>
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
            <th>Ubicación</th>
            <th>Score</th>
            <th>Estado</th>
            <th>Próxima acción</th>
            <th>Último contacto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.nombre_completo || 'Sin nombre'}</strong>
                <span className="muted-row">{lead.email || 'Sin email'}</span>
                <span className="muted-row">{lead.telefono || 'Sin teléfono'}</span>
              </td>

              <td>
                {lead.servicio_requerido || '—'}
                <span className="muted-row">{lead.tipo_obra || 'Sin tipo de obra'}</span>
              </td>

              <td>
                {lead.pais || '—'}
                <span className="muted-row">{lead.ciudad || 'Sin ciudad'}</span>
              </td>

              <td>
                {lead.p_promedio_ponderado ?? '—'}
                <span className="muted-row">{lead.urgencia_proyecto || 'Sin urgencia'}</span>
              </td>

              <td>
                <StatusBadge status={lead._status} />
                <span className="muted-row">{lead._status?.reason || 'Sin detalle'}</span>
              </td>

              <td>
                {lead._nextAction || 'Sin acción inmediata'}
                <span className="muted-row">{getNewsletterStatusLabel(lead)}</span>
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