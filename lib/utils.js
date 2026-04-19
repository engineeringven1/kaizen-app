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

function isTrue(value) {
  return value === true;
}

function getBaseDate(lead) {
  const raw = lead.fecha_registro || lead.created_at || null;
  if (!raw) return null;

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return null;

  return new Date(parsed);
}

function getElapsedMsSinceBase(lead) {
  const baseDate = getBaseDate(lead);
  if (!baseDate) return 0;
  return Date.now() - baseDate.getTime();
}

function hasHoursElapsed(lead, hours) {
  return getElapsedMsSinceBase(lead) >= hours * 60 * 60 * 1000;
}

function hasDaysElapsed(lead, days) {
  return getElapsedMsSinceBase(lead) >= days * 24 * 60 * 60 * 1000;
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

  // Acciones pendientes tienen prioridad sobre "Interesado"
  if (!isTrue(lead.mensaje_24h_enviado) && hasHoursElapsed(lead, 24)) {
    return {
      label: 'Pendiente 24h',
      tone: 'warning',
      reason: 'Ya se cumplió la ventana para enviar el seguimiento de 24 horas.',
      order: 10,
      isPending: true
    };
  }

  if (!isTrue(lead.mensaje_72h_enviado) && hasHoursElapsed(lead, 72)) {
    return {
      label: 'Pendiente 72h',
      tone: 'warning2',
      reason: 'Ya se cumplió la ventana para enviar el seguimiento de 72 horas.',
      order: 11,
      isPending: true
    };
  }

  if (!isTrue(lead.mensaje_7d_enviado) && hasDaysElapsed(lead, 7)) {
    return {
      label: 'Pendiente 7d',
      tone: 'danger',
      reason: 'Ya se cumplió la ventana para enviar el seguimiento de 7 días.',
      order: 12,
      isPending: true
    };
  }

  if (isTrue(lead.mostro_interes)) {
    return {
      label: 'Interesado',
      tone: 'success',
      reason: 'Lead con interés confirmado.',
      order: 3,
      isPending: false
    };
  }

  if (!isTrue(lead.mensaje_24h_enviado)) {
    return {
      label: 'En espera 24h',
      tone: 'info',
      reason: 'Todavía no se cumplen 24 horas desde el registro del lead.',
      order: 40,
      isPending: false
    };
  }

  if (!isTrue(lead.mensaje_72h_enviado)) {
    return {
      label: 'En espera 72h',
      tone: 'info',
      reason: 'Todavía no se cumplen 72 horas desde el registro del lead.',
      order: 41,
      isPending: false
    };
  }

  if (!isTrue(lead.mensaje_7d_enviado)) {
    return {
      label: 'En espera 7d',
      tone: 'info',
      reason: 'Todavía no se cumplen 7 días desde el registro del lead.',
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

  if (isTrue(lead.mostro_interes)) {
    return 'Agendar próximo paso comercial';
  }

  if (!isTrue(lead.mensaje_24h_enviado)) {
    return hasHoursElapsed(lead, 24)
      ? 'Enviar mensaje de 24 horas'
      : 'Esperar a que se cumplan 24 horas';
  }

  if (!isTrue(lead.mensaje_72h_enviado)) {
    return hasHoursElapsed(lead, 72)
      ? 'Enviar mensaje de 72 horas'
      : 'Esperar a que se cumplan 72 horas';
  }

  if (!isTrue(lead.mensaje_7d_enviado)) {
    return hasDaysElapsed(lead, 7)
      ? 'Enviar mensaje de 7 días'
      : 'Esperar a que se cumplan 7 días';
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