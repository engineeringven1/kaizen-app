import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdmin, hasSupabaseEnv } from '@/lib/supabase';
import { TABLE_NAME } from '@/lib/constants';
import {
  getLeadStatus,
  getNextActionLabel,
  shouldShowPending,
  safeNumber
} from '@/lib/utils';

async function getDemoLeads() {
  const filePath = path.join(process.cwd(), 'data', 'sample-leads.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function buildSearchText(lead) {
  return [
    lead.nombre_completo,
    lead.email,
    lead.telefono,
    lead.servicio_requerido,
    lead.ciudad,
    lead.pais,
    lead.tipo_obra,
    lead.rol_en_proyecto
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function normalizeLead(lead) {
  const status = getLeadStatus(lead);

  return {
    ...lead,
    _status: status,
    _nextAction: getNextActionLabel(lead)
  };
}

function compareLeads(a, b) {
  const orderDiff = safeNumber(a?._status?.order) - safeNumber(b?._status?.order);
  if (orderDiff !== 0) return orderDiff;

  const scoreDiff = safeNumber(b?.p_promedio_ponderado) - safeNumber(a?.p_promedio_ponderado);
  if (scoreDiff !== 0) return scoreDiff;

  const dateA = Date.parse(a?.fecha_registro || '') || 0;
  const dateB = Date.parse(b?.fecha_registro || '') || 0;
  return dateB - dateA;
}

function applyFilters(leads, filters = {}) {
  const { q = '', onlyPending = false } = filters;
  const normalizedQuery = String(q || '').trim().toLowerCase();

  return leads
    .filter((lead) => {
      if (!normalizedQuery) return true;
      return buildSearchText(lead).includes(normalizedQuery);
    })
    .filter((lead) => (onlyPending ? shouldShowPending(lead) : true))
    .sort(compareLeads);
}

async function fetchRawLeads(filters = {}) {
  const { country = '' } = filters;

  if (hasSupabaseEnv()) {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('p_promedio_ponderado', { ascending: false })
      .order('fecha_registro', { ascending: false })
      .limit(300);

    if (country) {
      query = query.eq('pais', country);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`No se pudieron cargar leads desde ${TABLE_NAME}: ${error.message}`);
    }

    return data || [];
  }

  const demoLeads = await getDemoLeads();
  return country ? demoLeads.filter((lead) => lead.pais === country) : demoLeads;
}

export async function getAllLeads(filters = {}) {
  const rawLeads = await fetchRawLeads(filters);
  const normalized = rawLeads.map(normalizeLead);
  return applyFilters(normalized, filters);
}

export function buildDashboardStats(leads = []) {
  const total = leads.length;
  const pending = leads.filter((lead) => shouldShowPending(lead)).length;
  const interested = leads.filter((lead) => lead.mostro_interes === true).length;
  const objection = leads.filter((lead) => lead.hubo_objecion === true).length;

  const avgScore = total
    ? (
        leads.reduce((sum, lead) => sum + safeNumber(lead.p_promedio_ponderado), 0) / total
      ).toFixed(2)
    : '0.00';

  const countries = [...new Set(leads.map((lead) => lead.pais).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    total,
    pending,
    interested,
    objection,
    avgScore,
    countries
  };
}

export async function getDashboardStats(filters = {}) {
  const leads = await getAllLeads(filters);
  return buildDashboardStats(leads);
}

export async function getLeadById(id) {
  if (hasSupabaseEnv()) {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`No se pudo cargar el lead ${id}: ${error.message}`);
    }

    return data ? normalizeLead(data) : null;
  }

  const demoLeads = await getDemoLeads();
  const found = demoLeads.find((lead) => String(lead.id) === String(id));
  return found ? normalizeLead(found) : null;
}