export default function LeadFilters({ searchParams, countries }) {
  return (
    <form className="card filters" action="/">
      <div className="field-group">
        <label htmlFor="q">Buscar</label>
        <input
          id="q"
          name="q"
          type="text"
          placeholder="Nombre, email, telefono, servicio..."
          defaultValue={searchParams?.q || ''}
        />
      </div>

      <div className="field-group">
        <label htmlFor="country">Pais</label>
        <select id="country" name="country" defaultValue={searchParams?.country || ''}>
          <option value="">Todos</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <label className="inline-check">
        <input
          name="onlyPending"
          type="checkbox"
          value="true"
          defaultChecked={searchParams?.onlyPending === 'true'}
        />
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
  );
}
