export default function DashboardCards({ stats }) {
  const cards = [
    {
      label: 'Leads visibles',
      value: stats.total,
      note: 'Cantidad total segun filtros activos'
    },
    {
      label: 'Pendientes hoy',
      value: stats.pending,
      note: 'Requieren accion comercial'
    },
    {
      label: 'Mostraron interes',
      value: stats.interested,
      note: 'Leads con interes confirmado'
    },
    {
      label: 'Con objecion',
      value: stats.objection,
      note: 'Necesitan manejo comercial'
    },
    {
      label: 'Score promedio',
      value: stats.avgScore,
      note: 'Promedio ponderado visible'
    },
    {
      label: 'Paises visibles',
      value: stats.countries.length,
      note: 'Cobertura geografica actual'
    }
  ];

  return (
    <section className="card-grid">
      {cards.map((card) => (
        <article key={card.label} className="card stat-card">
          <span className="card-label">{card.label}</span>
          <strong className="card-value">{card.value}</strong>
          <span className="muted-row">{card.note}</span>
        </article>
      ))}
    </section>
  );
}