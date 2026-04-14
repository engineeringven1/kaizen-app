import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdmin, hasSupabaseEnv } from '@/lib/supabase';
import { TABLE_NAME } from '@/lib/constants';
import { getLeadStatus, shouldShowPending, safeNumber } from '@/lib/utils';

async function getDemoLeads() {
  const filePath = path.join(process.cwd(), 'data', 'sample-leads.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function getAllLeads(filters = {}) {
  const { q = '', country = '', onlyPending = false } = filters;
  let leads = [];

  if (hasSupabaseEnv()) {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('p_promedio_ponderado', { ascending: false })
      .limit(200);

    if (country) {
      query = query.eq('pais', country);
    }

    const { data, error } = await query;
    if (error) {
      console.error('SUPABASE_QUERY_ERROR', {
        table: TABLE_NAME,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });

      throw new Error(
        `No se pudieron cargar leads. Tabla: ${TABLE_NAME}. Mensaje: ${error.message}. Code: ${error.code || 'sin code'}. Hint: ${error.hint || 'sin hint'}`
      );
    }
    leads = data || [];
  } else {
    leads = await getDemoLeads();
  }

  const normalized = leads
    .map((lead) => ({ ...lead, _status: getLeadStatus(lead) }))
    .filter((lead) => {
      if (!q) return true;
      const haystack = [
        lead.nombre_completo,
        lead.email,
        lead.telefono,
        lead.servicio_requerido,
        lead.ciudad,
        lead.pais
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q.toLowerCase());
    })
    .filter((lead) => (onlyPending ? shouldShowPending(lead) : true));

  return normalized;
}

export async function getLeadById(id) {
  const leads = await getAllLeads();
  return leads.find((lead) => String(lead.id) === String(id)) || null;
}

export async function getDashboardStats(filters = {}) {
  const leads = await getAllLeads(filters);
  const pending = leads.filter((lead) => shouldShowPending(lead)).length;
  const interested = leads.filter((lead) => lead.mostro_interes === true).length;
  const objection = leads.filter((lead) => lead.hubo_objecion === true).length;
  const avgScore = leads.length
    ? (leads.reduce((sum, lead) => sum + safeNumber(lead.p_promedio_ponderado), 0) / leads.length).toFixed(2)
    : '0.00';

  const countries = [...new Set(leads.map((lead) => lead.pais).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return {
    total: leads.length,
    pending,
    interested,
    objection,
    avgScore,
    countries
  };
}
