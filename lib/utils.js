import { AUTO_TIMESTAMP_MAP } from '@/lib/constants';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function isTruthy(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
}

export function toNullableBoolean(value) {
  if (value === '' || value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-VE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function formatDateShort(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-VE', {
    dateStyle: 'short'
  }).format(date);
}

export function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function hoursSince(value) {
  if (!value) return 0;
  const ms = Date.now() - new Date(value).getTime();
  return Math.floor(ms / (1000 * 60 * 60));
}

export function daysSince(value) {
  if (!value) return 0;
  const ms = Date.now() - new Date(value).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getLeadStatus(lead) {
  const registration = lead.fecha_registro;
  const ageHours = hoursSince(registration);
  const ageDays = daysSince(registration);

  if (lead.mostro_interes === true) {
    return { label: 'Interesado', tone: 'success', reason: 'Mostro interes' };
  }

  if (lead.hubo_objecion === true) {
    return { label: 'Con objecion', tone: 'warning', reason: 'Requiere manejo comercial' };
  }

  if (!lead.mensaje_24h_enviado && ageHours >= 24) {
    return { label: 'Pendiente 24h', tone: 'danger', reason: 'Debe enviarse el seguimiento inicial' };
  }

  if (lead.mensaje_24h_enviado && !lead.mensaje_72h_enviado && ageHours >= 72) {
    return { label: 'Pendiente 72h', tone: 'danger', reason: 'Corresponde segundo seguimiento' };
  }

  if (lead.mensaje_72h_enviado && !lead.mensaje_7d_enviado && ageDays >= 7) {
    return { label: 'Pendiente 7d', tone: 'danger', reason: 'Corresponde seguimiento de 7 dias' };
  }

  if (lead.newsletter_enviado && !lead.respondio_newsletter) {
    return { label: 'Esperando newsletter', tone: 'info', reason: 'Newsletter enviado sin respuesta' };
  }

  if (lead.cotizacion_enviada) {
    return { label: 'Cotizacion enviada', tone: 'info', reason: 'Esperando siguiente movimiento' };
  }

  return { label: 'En seguimiento', tone: 'neutral', reason: 'Sin alerta operativa inmediata' };
}

export function shouldShowPending(lead) {
  return getLeadStatus(lead).label.startsWith('Pendiente');
}

export function buildOperationalUpdate(previousLead, payload) {
  const now = new Date().toISOString();
  const next = { ...payload };

  Object.entries(AUTO_TIMESTAMP_MAP).forEach(([flagField, dateField]) => {
    const incomingFlag = payload[flagField];
    const prevFlag = previousLead?.[flagField];
    const prevDate = previousLead?.[dateField];

    if (incomingFlag === true && !prevFlag && !payload[dateField] && !prevDate) {
      next[dateField] = now;
    }

    if (incomingFlag === false && prevFlag === true && !payload[dateField]) {
      next[dateField] = null;
    }
  });

  const touchedContactFields = [
    'newsletter_enviado',
    'respondio_newsletter',
    'mensaje_24h_enviado',
    'respondio_24h',
    'mensaje_72h_enviado',
    'respondio_72h',
    'mensaje_7d_enviado',
    'respondio_7d',
    'cotizacion_enviada'
  ];

  const shouldRefreshLastContact = touchedContactFields.some((field) => {
    if (!(field in payload)) return false;
    return payload[field] === true;
  });

  if (shouldRefreshLastContact) {
    next.ultimo_contacto = now;
  }

  if (!next.actualizado_por) {
    next.actualizado_por = process.env.APP_DEFAULT_EDITOR || 'Secretaria Kaizen';
  }

  next.updated_at = now;

  return next;
}
