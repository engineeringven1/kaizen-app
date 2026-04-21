import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { TABLE_NAME } from '@/lib/constants';
import { getSupabaseAdmin, hasSupabaseEnv } from '@/lib/supabase';

const EDITABLE_FIELDS = [
  'nombre_completo',
  'email',
  'telefono',
  'pais',
  'ciudad',
  'whatsapp',
  'mostro_interes',
  'hubo_objecion',
  'cotizacion_enviada',
  'newsletter_enviado',
  'fecha_newsletter',
  'respondio_newsletter',
  'fecha_respuesta_newsletter',
  'mensaje_24h_enviado',
  'fecha_mensaje_24h',
  'respondio_24h',
  'fecha_respuesta_24h',
  'mensaje_72h_enviado',
  'fecha_mensaje_72h',
  'respondio_72h',
  'fecha_respuesta_72h',
  'mensaje_7d_enviado',
  'fecha_mensaje_7d',
  'respondio_7d',
  'fecha_respuesta_7d',
  'ultimo_contacto',
  'observaciones',
  'actualizado_por'
];

function pickEditableFields(payload) {
  return Object.fromEntries(
    Object.entries(payload || {}).filter(([key]) => EDITABLE_FIELDS.includes(key))
  );
}

function cleanText(value) {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
}

function applyAutomaticDates(nextPayload, currentLead) {
  const now = new Date().toISOString();

  const payload = { ...nextPayload };

  if (payload.newsletter_enviado === true && !currentLead.fecha_newsletter && !payload.fecha_newsletter) {
    payload.fecha_newsletter = now;
  }

  if (
    payload.respondio_newsletter === true &&
    !currentLead.fecha_respuesta_newsletter &&
    !payload.fecha_respuesta_newsletter
  ) {
    payload.fecha_respuesta_newsletter = now;
  }

  if (payload.mensaje_24h_enviado === true && !currentLead.fecha_mensaje_24h && !payload.fecha_mensaje_24h) {
    payload.fecha_mensaje_24h = now;
  }

  if (payload.respondio_24h === true && !currentLead.fecha_respuesta_24h && !payload.fecha_respuesta_24h) {
    payload.fecha_respuesta_24h = now;
  }

  if (payload.mensaje_72h_enviado === true && !currentLead.fecha_mensaje_72h && !payload.fecha_mensaje_72h) {
    payload.fecha_mensaje_72h = now;
  }

  if (payload.respondio_72h === true && !currentLead.fecha_respuesta_72h && !payload.fecha_respuesta_72h) {
    payload.fecha_respuesta_72h = now;
  }

  if (payload.mensaje_7d_enviado === true && !currentLead.fecha_mensaje_7d && !payload.fecha_mensaje_7d) {
    payload.fecha_mensaje_7d = now;
  }

  if (payload.respondio_7d === true && !currentLead.fecha_respuesta_7d && !payload.fecha_respuesta_7d) {
    payload.fecha_respuesta_7d = now;
  }

  payload.ultimo_contacto = now;

  return payload;
}

export async function PUT(request, { params }) {
  try {
    if (!hasSupabaseEnv()) {
      return NextResponse.json(
        { error: 'Supabase no está configurado en este entorno.' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { data: currentLead, error: findError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        { error: `No se pudo cargar el lead actual: ${findError.message}` },
        { status: 500 }
      );
    }

    if (!currentLead) {
      return NextResponse.json({ error: 'Lead no encontrado.' }, { status: 404 });
    }

    let payload = pickEditableFields(body);

    payload.observaciones = cleanText(payload.observaciones);
    payload.actualizado_por =
      cleanText(payload.actualizado_por) ||
      process.env.APP_DEFAULT_EDITOR ||
      currentLead.actualizado_por ||
      'Secretaria Kaizen';

    payload = applyAutomaticDates(payload, currentLead);

    const { data: updatedLead, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq('id', params.id)
      .select('*')
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { error: `No se pudo actualizar el lead: ${updateError.message}` },
        { status: 500 }
      );
    }

    revalidatePath('/');
    revalidatePath(`/leads/${params.id}`);

    return NextResponse.json({ ok: true, lead: updatedLead });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Error inesperado actualizando lead.' },
      { status: 500 }
    );
  }
}