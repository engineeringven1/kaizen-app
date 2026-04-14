'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

const toggleGroups = [
  {
    title: 'Calificacion comercial',
    fields: [
      ['mostro_interes', 'Mostro interes'],
      ['hubo_objecion', 'Hubo objecion'],
      ['cotizacion_enviada', 'Cotizacion enviada']
    ]
  },
  {
    title: 'Newsletter',
    fields: [
      ['newsletter_enviado', 'Newsletter enviado'],
      ['respondio_newsletter', 'Respondio newsletter']
    ]
  },
  {
    title: 'Seguimientos',
    fields: [
      ['mensaje_24h_enviado', 'Mensaje 24h enviado'],
      ['respondio_24h', 'Respondio 24h'],
      ['mensaje_72h_enviado', 'Mensaje 72h enviado'],
      ['respondio_72h', 'Respondio 72h'],
      ['mensaje_7d_enviado', 'Mensaje 7 dias enviado'],
      ['respondio_7d', 'Respondio 7 dias']
    ]
  }
];

export default function LeadOperationalForm({ lead }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    const form = new FormData(event.currentTarget);
    const payload = {
      actualizado_por: form.get('actualizado_por') || '',
      observaciones: form.get('observaciones') || ''
    };

    const booleanFields = [
      'mostro_interes',
      'hubo_objecion',
      'cotizacion_enviada',
      'newsletter_enviado',
      'respondio_newsletter',
      'mensaje_24h_enviado',
      'respondio_24h',
      'mensaje_72h_enviado',
      'respondio_72h',
      'mensaje_7d_enviado',
      'respondio_7d'
    ];

    booleanFields.forEach((field) => {
      payload[field] = form.get(field) === 'on';
    });

    startTransition(async () => {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo guardar');
        return;
      }

      setMessage('Cambios guardados correctamente.');
      router.refresh();
    });
  }

  return (
    <section className="card detail-card">
      <div className="detail-header stacked">
        <div>
          <h2>Panel de secretaria</h2>
          <p>Los timestamps se autocompletan cuando se marca una accion o respuesta.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="secretary-form">
        <div className="field-group">
          <label htmlFor="actualizado_por">Actualizado por</label>
          <input
            id="actualizado_por"
            name="actualizado_por"
            type="text"
            defaultValue={lead.actualizado_por || 'Secretaria Kaizen'}
          />
        </div>

        {toggleGroups.map((group) => (
          <div key={group.title} className="toggle-group">
            <h3>{group.title}</h3>
            <div className="toggle-grid">
              {group.fields.map(([field, label]) => (
                <label key={field} className="switch-row">
                  <input type="checkbox" name={field} defaultChecked={lead[field] === true} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="field-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" rows="6" defaultValue={lead.observaciones || ''} />
        </div>

        <div className="timestamp-grid">
          <div>
            <strong>Fecha newsletter:</strong>
            <span>{formatDate(lead.fecha_newsletter)}</span>
          </div>
          <div>
            <strong>Respuesta newsletter:</strong>
            <span>{formatDate(lead.fecha_respuesta_newsletter)}</span>
          </div>
          <div>
            <strong>Fecha 24h:</strong>
            <span>{formatDate(lead.fecha_mensaje_24h)}</span>
          </div>
          <div>
            <strong>Respuesta 24h:</strong>
            <span>{formatDate(lead.fecha_respuesta_24h)}</span>
          </div>
          <div>
            <strong>Fecha 72h:</strong>
            <span>{formatDate(lead.fecha_mensaje_72h)}</span>
          </div>
          <div>
            <strong>Respuesta 72h:</strong>
            <span>{formatDate(lead.fecha_respuesta_72h)}</span>
          </div>
          <div>
            <strong>Fecha 7 dias:</strong>
            <span>{formatDate(lead.fecha_mensaje_7d)}</span>
          </div>
          <div>
            <strong>Respuesta 7 dias:</strong>
            <span>{formatDate(lead.fecha_respuesta_7d)}</span>
          </div>
          <div>
            <strong>Ultimo contacto:</strong>
            <span>{formatDate(lead.ultimo_contacto)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button className="button button-primary" disabled={isPending} type="submit">
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <a className="button button-secondary" href="/">
            Volver al dashboard
          </a>
        </div>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </section>
  );
}
