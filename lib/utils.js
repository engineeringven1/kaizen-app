export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatDateShort(value) {
  if (!value) return '—';
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return String(value);

  return new Intl.DateTimeFormat('es-VE', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  }).format(new Date(value));
}

const MS_24H = 24 * 60 * 60 * 1000;
const MS_48H = 48 * 60 * 60 * 1000;   // gap 24h → 72h message
const MS_5D  =  5 * 24 * 60 * 60 * 1000; // gap 72h → 7d message

function isTrue(value) {
  return value === true;
}

function parseDate(str) {
  if (!str) return null;
  const t = Date.parse(str);
  return isNaN(t) ? null : new Date(t);
}

function msSince(date) {
  return date ? Date.now() - date.getTime() : 0;
}

function getBaseDate(lead) {
  return parseDate(lead.fecha_registro || lead.created_at || null);
}

// 24h: time since registration
function ready24h(lead) {
  return msSince(getBaseDate(lead)) >= MS_24H;
}

// 72h: time since the 24h message was sent (falls back to registration if date missing)
function ready72h(lead) {
  const ref = parseDate(lead.fecha_mensaje_24h) || getBaseDate(lead);
  return msSince(ref) >= MS_48H;
}

// 7d: time since the 72h message was sent (falls back to registration if date missing)
function ready7d(lead) {
  const ref = parseDate(lead.fecha_mensaje_72h) || getBaseDate(lead);
  return msSince(ref) >= MS_5D;
}

export function getNewsletterStatusLabel(lead) {
  if (isTrue(lead.respondio_newsletter)) return 'Newsletter respondida';
  if (isTrue(lead.newsletter_enviado)) return 'Newsletter enviada';
  return 'Pendiente newsletter';
}

export function getLeadStatus(lead) {
  if (isTrue(lead.hubo_objecion)) {
    return {
      label: 'Con objeción',
      tone: 'danger',
      reason: 'Requiere manejo comercial antes de avanzar.',
      order: 1,
      isPending: true
    };
  }

  if (isTrue(lead.cotizacion_enviada) && !isTrue(lead.mostro_interes)) {
    return {
      label: 'Cotización enviada',
      tone: 'info',
      reason: 'Se envió propuesta y queda seguimiento comercial.',
      order: 2,
      isPending: true
    };
  }

  // Pendiente 24h: 24h desde fecha_registro y mensaje no enviado
  if (!isTrue(lead.mensaje_24h_enviado) && ready24h(lead)) {
    return {
      label: 'Pendiente 24h',
      tone: 'warning',
      reason: 'Han pasado 24h desde el registro. Enviar primer seguimiento.',
      order: 10,
      isPending: true
    };
  }

  // Pendiente 72h: 48h desde que se envió el mensaje de 24h
  if (isTrue(lead.mensaje_24h_enviado) && !isTrue(lead.mensaje_72h_enviado) && ready72h(lead)) {
    return {
      label: 'Pendiente 72h',
      tone: 'warning2',
      reason: 'Han pasado 48h desde el mensaje de 24h. Enviar segundo seguimiento.',
      order: 11,
      isPending: true
    };
  }

  // Pendiente 7d: 5 días desde que se envió el mensaje de 72h
  if (isTrue(lead.mensaje_72h_enviado) && !isTrue(lead.mensaje_7d_enviado) && ready7d(lead)) {
    return {
      label: 'Pendiente 7d',
      tone: 'danger',
      reason: 'Han pasado 5 días desde el mensaje de 72h. Enviar tercer seguimiento.',
      order: 12,
      isPending: true
    };
  }

  if (!isTrue(lead.mensaje_24h_enviado)) {
    return {
      label: 'En espera 24h',
      tone: 'info',
      reason: 'Esperando que pasen 24h desde el registro del lead.',
      order: 40,
      isPending: false
    };
  }

  if (!isTrue(lead.mensaje_72h_enviado)) {
    return {
      label: 'En espera 72h',
      tone: 'info',
      reason: 'Esperando 48h desde el envío del mensaje de 24h.',
      order: 41,
      isPending: false
    };
  }

  if (!isTrue(lead.mensaje_7d_enviado)) {
    return {
      label: 'En espera 7d',
      tone: 'info',
      reason: 'Esperando 5 días desde el envío del mensaje de 72h.',
      order: 42,
      isPending: false
    };
  }

  if (isTrue(lead.mensaje_7d_enviado) && !isTrue(lead.respondio_7d)) {
    return {
      label: 'Seguimiento abierto',
      tone: 'neutral',
      reason: 'Ya se ejecutaron los seguimientos y se espera respuesta final.',
      order: 50,
      isPending: false
    };
  }

  if (isTrue(lead.newsletter_enviado) && !isTrue(lead.respondio_newsletter)) {
    return {
      label: 'Newsletter enviada',
      tone: 'info',
      reason: 'Se envió newsletter y se espera reacción.',
      order: 60,
      isPending: false
    };
  }

  return {
    label: 'Gestionado',
    tone: 'neutral',
    reason: 'Lead sin tareas visibles pendientes.',
    order: 99,
    isPending: false
  };
}

export function getNextActionLabel(lead) {
  if (isTrue(lead.hubo_objecion)) {
    return 'Revisar objeción y definir respuesta comercial';
  }

  if (isTrue(lead.cotizacion_enviada) && !isTrue(lead.mostro_interes)) {
    return 'Dar seguimiento a la cotización enviada';
  }

  if (!isTrue(lead.mensaje_24h_enviado)) {
    return ready24h(lead)
      ? 'Enviar mensaje de 24 horas'
      : isTrue(lead.mostro_interes)
        ? 'Agendar próximo paso comercial'
        : 'Esperar a que pasen 24h desde el registro';
  }

  if (!isTrue(lead.mensaje_72h_enviado)) {
    return ready72h(lead)
      ? 'Enviar mensaje de 72 horas'
      : 'Esperar 48h desde el mensaje de 24h';
  }

  if (!isTrue(lead.mensaje_7d_enviado)) {
    return ready7d(lead)
      ? 'Enviar mensaje de 7 días'
      : 'Esperar 5 días desde el mensaje de 72h';
  }

  if (isTrue(lead.mensaje_7d_enviado) && !isTrue(lead.respondio_7d)) {
    return 'Esperar respuesta final o cerrar seguimiento';
  }

  if (!isTrue(lead.newsletter_enviado)) {
    return 'Enviar newsletter';
  }

  if (isTrue(lead.newsletter_enviado) && !isTrue(lead.respondio_newsletter)) {
    return 'Monitorear respuesta al newsletter';
  }

  return 'Sin acción inmediata';
}

export function shouldShowPending(lead) {
  return !!getLeadStatus(lead).isPending;
}

export function getInterestLabel(lead) {
  if (isTrue(lead.respondio_7d))   return { label: 'Respondió 7d',  tone: 'success' };
  if (isTrue(lead.respondio_72h))  return { label: 'Respondió 72h', tone: 'success' };
  if (isTrue(lead.respondio_24h))  return { label: 'Respondió 24h', tone: 'success' };
  if (isTrue(lead.mostro_interes)) return { label: 'Interesado',     tone: 'success' };
  return null;
}