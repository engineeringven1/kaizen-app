export default function LeadNotFound() {
  return (
    <div className="card empty-state">
      <h2>Lead no encontrado</h2>
      <p>Verifica el ID o vuelve al dashboard principal.</p>
      <a className="button button-primary" href="/">
        Volver al dashboard
      </a>
    </div>
  );
}
