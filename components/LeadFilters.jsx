function buildTabUrl(searchParams, interest) {
  const params = new URLSearchParams();
  if (searchParams?.q) params.set('q', searchParams.q);
  if (searchParams?.country) params.set('country', searchParams.country);
  if (searchParams?.onlyPending) params.set('onlyPending', searchParams.onlyPending);
  if (interest !== 'todos') params.set('interest', interest);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default function LeadFilters({ searchParams, countries }) {
  const currentQ = searchParams?.q || '';
  const currentCountry = searchParams?.country || '';
  const onlyPending = searchParams?.onlyPending === 'true';
  const currentInterest = searchParams?.interest || 'todos';

  const tabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'seguimiento', label: 'Seguimiento' },
    { key: 'interesados', label: 'Interesados' }
  ];

  return (
    <div className="card filters-wrapper">
      <form className="filters" action="/">
        {currentInterest !== 'todos' && (
          <input type="hidden" name="interest" value={currentInterest} />
        )}
        <div className="field-group">
          <label htmlFor="q">Buscar lead</label>
          <input
            id="q"
            name="q"
            type="text"
            placeholder="Nombre, email, telefono, servicio, pais..."
            defaultValue={currentQ}
          />
        </div>

        <div className="field-group">
          <label htmlFor="country">Pais</label>
          <select id="country" name="country" defaultValue={currentCountry}>
            <option value="">Todos</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <label className="inline-check">
          <input name="onlyPending" type="checkbox" value="true" defaultChecked={onlyPending} />
          Solo pendientes
        </label>

        <div className="filter-actions">
          <button className="button button-primary" type="submit">
            Aplicar
          </button>
          <a className="button button-secondary" href="/">
            Limpiar
          </a>
        </div>
      </form>

      <div className="tab-group">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={buildTabUrl(searchParams, tab.key)}
            className={`tab-btn${currentInterest === tab.key ? ' tab-btn-active' : ''}`}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  );
}