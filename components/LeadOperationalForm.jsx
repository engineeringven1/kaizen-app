'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

function initialStateFromLead(lead) {
  return {
    nombre_completo: lead.nombre_completo || '',
    email: lead.email || '',
    telefono: lead.telefono || '',
    pais: lead.pais || '',
    ciudad: lead.ciudad || '',
    whatsapp: lead.whatsapp !== false,
    mostro_interes: !!lead.mostro_interes,
    hubo_objecion: !!lead.hubo_objecion,
    cotizacion_enviada: !!lead.cotizacion_enviada,
    newsletter_enviado: !!lead.newsletter_enviado,
    respondio_newsletter: !!lead.respondio_newsletter,
    mensaje_24h_enviado: !!lead.mensaje_24h_enviado,
    respondio_24h: !!lead.respondio_24h,
    mensaje_72h_enviado: !!lead.mensaje_72h_enviado,
    respondio_72h: !!lead.respondio_72h,
    mensaje_7d_enviado: !!lead.mensaje_7d_enviado,
    respondio_7d: !!lead.respondio_7d,
    observaciones: lead.observaciones || '',
    actualizado_por: lead.actualizado_por || ''
  };
}

function formatReadonlyDate(value) {
  if (!value) return '—';
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Date(value).toLocaleString();
}

export default function LeadOperationalForm({ lead }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentLead, setCurrentLead] = useState(lead);
  const [form, setForm] = useState(() => initialStateFromLead(lead));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const readonlyDates = useMemo(
    () => ({
      fecha_newsletter: currentLead.fecha_newsletter,
      fecha_respuesta_newsletter: currentLead.fecha_respuesta_newsletter,
      fecha_mensaje_24h: currentLead.fecha_mensaje_24h,
      fecha_respuesta_24h: currentLead.fecha_respuesta_24h,
      fecha_mensaje_72h: currentLead.fecha_mensaje_72h,
      fecha_respuesta_72h: currentLead.fecha_respuesta_72h,
      fecha_mensaje_7d: currentLead.fecha_mensaje_7d,
      fecha_respuesta_7d: currentLead.fecha_respuesta_7d,
      ultimo_contacto: currentLead.ultimo_contacto
    }),
    [currentLead]
  );

  function updateCheckbox(name) {
    return (event) => {
      const checked = event.target.checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked
      }));
    };
  }

  function updateText(name) {
    return (event) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/leads/${lead.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo actualizar el lead');
        }

        setCurrentLead(data.lead);
        setForm(initialStateFromLead(data.lead));
        setMessage('Lead actualizado correctamente.');
        router.refresh();
      } catch (err) {
        setError(err.message || 'Ocurrió un error actualizando el lead.');
      }
    });
  }

  return (
    <section className="card">
      <h3>Panel operativo de secretaria</h3>
      <p className="muted-row">
        Aquí solo se actualiza el seguimiento comercial y operativo del lead.
      </p>

      <form className="ops-form" onSubmit={handleSubmit}>
        <div className="ops-section">
          <h4>Datos de contacto</h4>
          <div className="checkbox-grid">
            <div className="field-group">
              <label htmlFor="nombre_completo">Nombre completo</label>
              <input
                id="nombre_completo"
                type="text"
                value={form.nombre_completo}
                onChange={updateText('nombre_completo')}
              />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={form.email}
                onChange={updateText('email')}
              />
            </div>
            <div className="field-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={form.telefono}
                onChange={updateText('telefono')}
              />
            </div>
            <div className="field-group">
              <label htmlFor="pais">País</label>
              <input
                id="pais"
                type="text"
                value={form.pais}
                onChange={updateText('pais')}
              />
            </div>
            <div className="field-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                type="text"
                value={form.ciudad}
                onChange={updateText('ciudad')}
              />
            </div>
          </div>
        </div>

        <div className="ops-section">
          <h4>Gestión comercial</h4>
          <div className="checkbox-grid">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.whatsapp}
                onChange={updateCheckbox('whatsapp')}
              />
              Tiene WhatsApp
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.mostro_interes}
                onChange={updateCheckbox('mostro_interes')}
              />
              Mostró interés
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.hubo_objecion}
                onChange={updateCheckbox('hubo_objecion')}
              />
              Hubo objeción
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.cotizacion_enviada}
                onChange={updateCheckbox('cotizacion_enviada')}
              />
              Cotización enviada
            </label>
          </div>
        </div>

        <div className="ops-section">
          <h4>Newsletter</h4>
          <div className="checkbox-grid">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.newsletter_enviado}
                onChange={updateCheckbox('newsletter_enviado')}
              />
              Newsletter enviada
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.respondio_newsletter}
                onChange={updateCheckbox('respondio_newsletter')}
              />
              Respondió newsletter
            </label>
          </div>

          <div className="readonly-grid">
            <div className="readonly-item">
              <span className="detail-label">Fecha newsletter</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_newsletter)}</span>
            </div>

            <div className="readonly-item">
              <span className="detail-label">Fecha respuesta newsletter</span>
              <span className="detail-value">
                {formatReadonlyDate(readonlyDates.fecha_respuesta_newsletter)}
              </span>
            </div>
          </div>
        </div>

        <div className="ops-section">
          <h4>Seguimiento 24 horas</h4>
          <div className="checkbox-grid">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.mensaje_24h_enviado}
                onChange={updateCheckbox('mensaje_24h_enviado')}
              />
              Mensaje 24h enviado
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.respondio_24h}
                onChange={updateCheckbox('respondio_24h')}
              />
              Respondió 24h
            </label>
          </div>

          <div className="readonly-grid">
            <div className="readonly-item">
              <span className="detail-label">Fecha mensaje 24h</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_mensaje_24h)}</span>
            </div>

            <div className="readonly-item">
              <span className="detail-label">Fecha respuesta 24h</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_respuesta_24h)}</span>
            </div>
          </div>
        </div>

        <div className="ops-section">
          <h4>Seguimiento 72 horas</h4>
          <div className="checkbox-grid">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.mensaje_72h_enviado}
                onChange={updateCheckbox('mensaje_72h_enviado')}
              />
              Mensaje 72h enviado
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.respondio_72h}
                onChange={updateCheckbox('respondio_72h')}
              />
              Respondió 72h
            </label>
          </div>

          <div className="readonly-grid">
            <div className="readonly-item">
              <span className="detail-label">Fecha mensaje 72h</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_mensaje_72h)}</span>
            </div>

            <div className="readonly-item">
              <span className="detail-label">Fecha respuesta 72h</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_respuesta_72h)}</span>
            </div>
          </div>
        </div>

        <div className="ops-section">
          <h4>Seguimiento 7 días</h4>
          <div className="checkbox-grid">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.mensaje_7d_enviado}
                onChange={updateCheckbox('mensaje_7d_enviado')}
              />
              Mensaje 7d enviado
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.respondio_7d}
                onChange={updateCheckbox('respondio_7d')}
              />
              Respondió 7d
            </label>
          </div>

          <div className="readonly-grid">
            <div className="readonly-item">
              <span className="detail-label">Fecha mensaje 7d</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_mensaje_7d)}</span>
            </div>

            <div className="readonly-item">
              <span className="detail-label">Fecha respuesta 7d</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.fecha_respuesta_7d)}</span>
            </div>
          </div>
        </div>

        <div className="ops-section">
          <h4>Observaciones</h4>
          <div className="field-group">
            <label htmlFor="observaciones">Observaciones internas</label>
            <textarea
              id="observaciones"
              rows={5}
              value={form.observaciones}
              onChange={updateText('observaciones')}
              placeholder="Escribe comentarios, objeciones, contexto comercial o acuerdos..."
            />
          </div>

          <div className="field-group">
            <label htmlFor="actualizado_por">Actualizado por</label>
            <input
              id="actualizado_por"
              type="text"
              value={form.actualizado_por}
              onChange={updateText('actualizado_por')}
              placeholder="Secretaria Kaizen"
            />
          </div>

          <div className="readonly-grid">
            <div className="readonly-item">
              <span className="detail-label">Último contacto</span>
              <span className="detail-value">{formatReadonlyDate(readonlyDates.ultimo_contacto)}</span>
            </div>
          </div>
        </div>

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </section>
  );
}