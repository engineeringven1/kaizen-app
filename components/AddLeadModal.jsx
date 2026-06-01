'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const EMPTY = {
  nombre_completo: '',
  email: '',
  telefono: '',
  pais: '',
  ciudad: '',
  servicio_requerido: '',
  whatsapp: true,
  observaciones: '',
};

export default function AddLeadModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function updateText(name) {
    return (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }));
  }

  function updateCheck(name) {
    return (e) => setForm((prev) => ({ ...prev, [name]: e.target.checked }));
  }

  function handleOpen() {
    setForm(EMPTY);
    setError('');
    setOpen(true);
  }

  function handleClose() {
    if (!isPending) setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || 'No se pudo crear el lead.');
          return;
        }

        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err.message || 'Error al conectar con el servidor.');
      }
    });
  }

  return (
    <>
      <button className="button button-primary button-small" onClick={handleOpen}>
        + Agregar lead
      </button>

      {open && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-panel card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>Nuevo lead</p>
                <h3 style={{ margin: 0 }}>Agregar lead manual</h3>
              </div>
              <button
                type="button"
                className="button button-secondary button-small"
                onClick={handleClose}
                disabled={isPending}
              >
                ✕
              </button>
            </div>

            <form className="ops-form" onSubmit={handleSubmit}>
              <div className="ops-section">
                <h4>Datos de contacto</h4>
                <div className="checkbox-grid">
                  <div className="field-group">
                    <label htmlFor="al-nombre">Nombre completo *</label>
                    <input
                      id="al-nombre"
                      type="text"
                      required
                      value={form.nombre_completo}
                      onChange={updateText('nombre_completo')}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="al-email">Email</label>
                    <input
                      id="al-email"
                      type="text"
                      value={form.email}
                      onChange={updateText('email')}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="al-telefono">Teléfono</label>
                    <input
                      id="al-telefono"
                      type="text"
                      value={form.telefono}
                      onChange={updateText('telefono')}
                      placeholder="+58 412 0000000"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="al-pais">País</label>
                    <input
                      id="al-pais"
                      type="text"
                      value={form.pais}
                      onChange={updateText('pais')}
                      placeholder="Venezuela"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="al-ciudad">Ciudad</label>
                    <input
                      id="al-ciudad"
                      type="text"
                      value={form.ciudad}
                      onChange={updateText('ciudad')}
                      placeholder="Caracas"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="al-servicio">Servicio requerido</label>
                    <input
                      id="al-servicio"
                      type="text"
                      value={form.servicio_requerido}
                      onChange={updateText('servicio_requerido')}
                      placeholder="Ej: Construcción, Remodelación..."
                    />
                  </div>
                </div>

                <label className="inline-check" style={{ paddingTop: 0 }}>
                  <input
                    type="checkbox"
                    checked={form.whatsapp}
                    onChange={updateCheck('whatsapp')}
                  />
                  Tiene WhatsApp
                </label>
              </div>

              <div className="ops-section">
                <h4>Observaciones</h4>
                <div className="field-group">
                  <label htmlFor="al-obs">Notas iniciales</label>
                  <textarea
                    id="al-obs"
                    rows={3}
                    value={form.observaciones}
                    onChange={updateText('observaciones')}
                    placeholder="Contexto, cómo llegó el lead, notas relevantes..."
                  />
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-primary" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
