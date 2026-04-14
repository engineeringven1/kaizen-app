export default function DashboardCards({ stats }) {
  const cards = [
    { label: 'Leads visibles', value: stats.total },
    { label: 'Pendientes hoy', value: stats.pending },
    { label: 'Mostraron interes', value: stats.interested },
    { label: 'Con objecion', value: stats.objection },
    { label: 'Score promedio', value: stats.avgScore }
  ];

  return (
    <section className="card-grid">
      {cards.map((card) => (
        <article key={card.label} className="card stat-card">
          <span className="card-label">{card.label}</span>
          <strong className="card-value">{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
