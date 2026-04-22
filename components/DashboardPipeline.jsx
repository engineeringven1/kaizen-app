export default function DashboardPipeline({ stats }) {
  const { total, sent24h, sent72h, sent7d, newsletterSent, cotizacion, responded } = stats;

  const pct = (n) => (total > 0 ? Math.min(100, Math.round((n / total) * 100)) : 0);

  const items = [
    {
      label: 'Mensaje 24h',
      value: sent24h,
      color: 'var(--primary-light)',
      note: 'Primer seguimiento enviado'
    },
    {
      label: 'Mensaje 72h',
      value: sent72h,
      color: 'var(--warning)',
      note: 'Segundo seguimiento enviado'
    },
    {
      label: 'Mensaje 7 días',
      value: sent7d,
      color: 'var(--purple)',
      note: 'Tercer seguimiento enviado'
    },
    {
      label: 'Newsletter',
      value: newsletterSent,
      color: 'var(--info)',
      note: 'Newsletter enviada'
    },
    {
      label: 'Cotización',
      value: cotizacion,
      color: 'var(--success)',
      note: 'Propuesta económica enviada'
    },
    {
      label: 'Respondieron',
      value: responded,
      color: '#5ef5bc',
      note: 'Al menos una respuesta recibida'
    }
  ];

  return (
    <div>
      <div className="section-heading">
        <h3>Pipeline de seguimiento</h3>
      </div>
      <div className="pipeline-grid">
        {items.map((item) => (
          <article key={item.label} className="card pipeline-card">
            <div className="pipeline-header">
              <span className="pipeline-label">{item.label}</span>
              <span className="pipeline-pct" style={{ color: item.color }}>
                {pct(item.value)}%
              </span>
            </div>
            <div className="pipeline-count">
              {item.value}{' '}
              <span className="pipeline-count-of">/ {total}</span>
            </div>
            <div className="pipeline-bar-track">
              <div
                className="pipeline-bar-fill"
                style={{ width: `${pct(item.value)}%`, background: item.color }}
              />
            </div>
            <div className="card-note">{item.note}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
