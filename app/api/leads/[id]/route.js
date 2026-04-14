import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { TABLE_NAME } from '@/lib/constants';
import { getLeadById } from '@/lib/leads';
import { getSupabaseAdmin, hasSupabaseEnv } from '@/lib/supabase';
import { buildOperationalUpdate } from '@/lib/utils';

async function updateDemoLead(id, patch) {
  const filePath = path.join(process.cwd(), 'data', 'sample-leads.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const leads = JSON.parse(raw);
  const index = leads.findIndex((lead) => String(lead.id) === String(id));

  if (index === -1) {
    throw new Error('Lead no encontrado');
  }

  leads[index] = { ...leads[index], ...patch };
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2));
  return leads[index];
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const previousLead = await getLeadById(params.id);

    if (!previousLead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const patch = buildOperationalUpdate(previousLead, body);

    if (hasSupabaseEnv()) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(patch)
        .eq('id', params.id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ ok: true, lead: data });
    }

    const updated = await updateDemoLead(params.id, patch);
    return NextResponse.json({ ok: true, lead: updated, mode: 'demo' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error inesperado' }, { status: 500 });
  }
}
