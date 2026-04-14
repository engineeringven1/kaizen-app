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
      reason: 'Se envió propuesta y queda seguimiento pendiente.',
      order: 2,
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

  if (isTrue(lead.mensaje_7d_enviado) && !isTrue(lead.respondio_7d)) {
    return {
      label: 'Seguimiento abierto',
      tone: 'info',
      reason: 'Ya se envió el seguimiento de 7 días y se espera respuesta.',
      order: 4,
      isPending: true
    };
  }

  if (
    isTrue(lead.mensaje_72h_enviado) &&
    !isTrue(lead.respondio_72h) &&
    !isTrue(lead.mensaje_7d_enviado)
  ) {
    return {
      label: 'Pendiente 7d',
      tone: 'warning',
      reason: 'Corresponde enviar el seguimiento de 7 días.',
      order: 5,
      isPending: true
    };
  }

  if (
    isTrue(lead.mensaje_24h_enviado) &&
    !isTrue(lead.respondio_24h) &&
    !isTrue(lead.mensaje_72h_enviado)
  ) {
    return {
      label: 'Pendiente 72h',
      tone: 'warning',
      reason: 'Corresponde enviar el seguimiento de 72 horas.',
      order: 6,
      isPending: true
    };
  }

  if (!isTrue(lead.mensaje_24h_enviado)) {
    return {
      label: 'Pendiente 24h',
      tone: 'warning',
      reason: 'Debe enviarse el seguimiento inicial.',
      order: 7,
      isPending: true
    };
  }

  if (isTrue(lead.newsletter_enviado) && !isTrue(lead.respondio_newsletter)) {
    return {
      label: 'Newsletter enviada',
      tone: 'info',
      reason: 'Se envió newsletter y se espera reacción.',
      order: 8,
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
    return 'Enviar mensaje de 24 horas';
  }

  if (
    isTrue(lead.mensaje_24h_enviado) &&
    !isTrue(lead.respondio_24h) &&
    !isTrue(lead.mensaje_72h_enviado)
  ) {
    return 'Enviar mensaje de 72 horas';
  }

  if (
    isTrue(lead.mensaje_72h_enviado) &&
    !isTrue(lead.respondio_72h) &&
    !isTrue(lead.mensaje_7d_enviado)
  ) {
    return 'Enviar mensaje de 7 días';
  }

  if (isTrue(lead.mensaje_7d_enviado) && !isTrue(lead.respondio_7d)) {
    return 'Esperar respuesta final o cerrar seguimiento';
  }

  if (isTrue(lead.newsletter_enviado) && !isTrue(lead.respondio_newsletter)) {
    return 'Monitorear respuesta al newsletter';
  }

  return 'Sin acción inmediata';
}

export function shouldShowPending(lead) {
  return !!getLeadStatus(lead).isPending;
}