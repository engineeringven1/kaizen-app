import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';

const rows = [
  ['ID', 'id'],
  ['Lead Meta ID', 'id_lead_meta'],
  ['Nombre', 'nombre_completo'],
  ['Email', 'email'],
  ['Telefono', 'telefono'],
  ['Pais', 'pais'],
  ['Ciudad', 'ciudad'],
  ['Servicio', 'servicio_requerido'],
  ['Urgencia', 'urgencia_proyecto'],
  ['Rol', 'rol_en_proyecto'],
  ['Tipo de obra', 'tipo_obra'],
  ['Tamano', 'tamano_proyecto'],
  ['Material', 'material_preferido'],
  ['Score', 'p_promedio_ponderado'],
  ['Registro', 'fecha_registro'],
  ['Actualizado', 'updated_at']
];

export default function LeadSummaryCard({ lead }) {
  return (
    <aside className="card detail-card">
      <div className="detail-header">
        <div>
          <h2>{lead.nombre_completo || 'Lead sin nombre'}</h2>
          <p>{lead.email || 'Sin email'}</p>
        </div>
        <StatusBadge status={lead._status} />
      </div>

      <dl className="summary-grid">
        {rows.map(([label, key]) => (
          <div key={key} className="summary-row">
            <dt>{label}</dt>
            <dd>{key.includes('fecha') || key === 'updated_at' ? formatDate(lead[key]) : lead[key] || '—'}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
