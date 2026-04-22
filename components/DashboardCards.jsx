export default function DashboardCards({ stats }) {
  const cards = [
    {
      label: 'Leads visibles',
      value: stats.total,
      note: 'Total según filtros activos',
      accent: 'stat-card-primary',
      icon: '👥'
    },
    {
      label: 'Pendientes hoy',
      value: stats.pending,
      note: 'Requieren acción comercial',
      accent: 'stat-card-warning',
      icon: '⏰'
    },
    {
      label: 'Mostraron interés',
      value: stats.interested,
      note: 'Interés confirmado',
      accent: 'stat-card-success',
      icon: '⭐'
    },
    {
      label: 'Con objeción',
      value: stats.objection,
      note: 'Necesitan manejo comercial',
      accent: 'stat-card-danger',
      icon: '⚠️'
    },
    {
      label: 'Score promedio',
      value: stats.avgScore,
      note: 'Promedio ponderado visible',
      accent: 'stat-card-info',
      icon: '📊'
    },
    {
      label: 'Países activos',
      value: stats.countries.length,
      note: 'Cobertura geográfica actual',
      accent: 'stat-card-purple',
      icon: '🌍'
    }
  ];

  return (
    <section className="card-grid">
      {cards.map((card) => (
        <article key={card.label} className={`card stat-card ${card.accent}`}>
          <div className="stat-icon">{card.icon}</div>
          <div>
            <div className="card-label">{card.label}</div>
            <strong className="card-value">{card.value}</strong>
          </div>
          <span className="card-note">{card.note}</span>
        </article>
      ))}
    </section>
  );
}
