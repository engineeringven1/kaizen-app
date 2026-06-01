import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { TABLE_NAME } from '@/lib/constants';
import { getSupabaseAdmin, hasSupabaseEnv } from '@/lib/supabase';

function cleanText(value) {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
}

export async function POST(request) {
  try {
    if (!hasSupabaseEnv()) {
      return NextResponse.json(
        { error: 'Supabase no está configurado en este entorno.' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const nombre = cleanText(body.nombre_completo);
    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es requerido.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const payload = {
      nombre_completo: nombre,
      email: cleanText(body.email),
      telefono: cleanText(body.telefono),
      pais: cleanText(body.pais),
      ciudad: cleanText(body.ciudad),
      servicio_requerido: cleanText(body.servicio_requerido),
      whatsapp: body.whatsapp !== false,
      observaciones: cleanText(body.observaciones),
      actualizado_por:
        cleanText(body.actualizado_por) ||
        process.env.APP_DEFAULT_EDITOR ||
        'Secretaria Kaizen',
      fecha_registro: now,
      formulario_origen: 'Manual',
      plataforma: 'Manual',
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo crear el lead: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath('/');
    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
