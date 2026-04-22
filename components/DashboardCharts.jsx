function DonutChart({ segments, total }) {
  const R = 42;
  const cx = 60, cy = 60;
  const circ = 2 * Math.PI * R;
  const active = segments.filter((s) => s.count > 0);
  let cum = 0;

  return (
    <svg viewBox="0 0 120 120" width="130" height="130" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {active.map((seg, i) => {
        const pct = seg.count / Math.max(total, 1);
        const offset = -(cum * circ);
        cum += pct;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#dff0ee" fontSize="20" fontWeight="800">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6ba8a3" fontSize="9">leads</text>
    </svg>
  );
}

function HBar({ items, color = 'var(--primary-light)' }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
      {items.map((item) => (
        <div key={item.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
              {item.name}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text)', fontWeight: '700', flexShrink: 0 }}>
              {item.count}
            </span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px' }}>
            <div style={{ height: '100%', width: `${(item.count / max) * 100}%`, background: color, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function VBar({ items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '100px', flex: 1 }}>
      {items.map((item) => {
        const h = Math.max(4, (item.count / max) * 100);
        return (
          <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text)', fontWeight: '700' }}>{item.count}</span>
            <div style={{ width: '100%', height: `${h}px`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', minHeight: '4px', opacity: 0.85 + (item.count / max) * 0.15 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardCharts({ stats }) {
  const { statusBreakdown, topCountries, scoreBuckets, topServices, total } = stats;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>

      {/* Gráfica 1 – Estado de leads */}
      <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-label" style={{ marginBottom: '2px' }}>Estado de leads</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <DonutChart segments={statusBreakdown} total={total} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
            {statusBreakdown.filter((s) => s.count > 0).map((seg) => (
              <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seg.label}</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text)', fontWeight: '700' }}>{seg.count}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Gráfica 2 – Top países */}
      <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-label" style={{ marginBottom: '2px' }}>Leads por país</div>
        <HBar items={topCountries} color="var(--primary-light)" />
      </article>

      {/* Gráfica 3 – Distribución de score */}
      <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-label" style={{ marginBottom: '2px' }}>Distribución de score</div>
        <VBar items={scoreBuckets} />
      </article>

      {/* Gráfica 4 – Servicios */}
      <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-label" style={{ marginBottom: '2px' }}>Servicios solicitados</div>
        <HBar items={topServices} color="var(--purple)" />
      </article>

    </div>
  );
}
