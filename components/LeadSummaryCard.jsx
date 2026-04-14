function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';

  if (typeof value === 'string') {
    const maybeDate = Date.parse(value);
    if (!Number.isNaN(maybeDate) && value.includes('T')) {
      return new Date(value).toLocaleString();
    }
  }

  return String(value);
}

export default function LeadSummaryCard({ lead }) {
  const originalRows = [
    ['Nombre completo', lead.nombre_completo],
    ['Email', lead.email],
    ['Teléfono', lead.telefono],
    ['País', lead.pais],
    ['Ciudad', lead.ciudad],
    ['Servicio requerido', lead.servicio_requerido],
    ['Tipo de obra', lead.tipo_obra],
    ['Rol en proyecto', lead.rol_en_proyecto],
    ['Urgencia', lead.urgencia_proyecto],
    ['Frecuencia subcontratación', lead.frecuencia_subcontratacion],
    ['Material preferido', lead.material_preferido],
    ['Tamaño proyecto', lead.tamano_proyecto],
    ['Edad', lead.edad],
    ['Fecha registro', lead.fecha_registro],
    ['Score ponderado', lead.p_promedio_ponderado]
  ];

  const trackingRows = [
    ['Mostró interés', lead.mostro_interes],
    ['Hubo objeción', lead.hubo_objecion],
    ['Cotización enviada', lead.cotizacion_enviada],
    ['Newsletter enviada', lead.newsletter_enviado],
    ['Respondió newsletter', lead.respondio_newsletter],
    ['Mensaje 24h enviado', lead.mensaje_24h_enviado],
    ['Respondió 24h', lead.respondio_24h],
    ['Mensaje 72h enviado', lead.mensaje_72h_enviado],
    ['Respondió 72h', lead.respondio_72h],
    ['Mensaje 7d enviado', lead.mensaje_7d_enviado],
    ['Respondió 7d', lead.respondio_7d],
    ['Último contacto', lead.ultimo_contacto],
    ['Actualizado por', lead.actualizado_por],
    ['Observaciones', lead.observaciones]
  ];

  return (
    <div className="page-stack">
      <section className="card">
        <h3>Datos originales del lead</h3>
        <div className="detail-grid">
          {originalRows.map(([label, value]) => (
            <div key={label} className="detail-row">
              <span className="detail-label">{label}</span>
              <span className="detail-value">{formatValue(value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Seguimiento actual</h3>
        <div className="detail-grid">
          {trackingRows.map(([label, value]) => (
            <div key={label} className="detail-row">
              <span className="detail-label">{label}</span>
              <span className="detail-value">{formatValue(value)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}