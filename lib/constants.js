export const TABLE_NAME = process.env.SUPABASE_TABLE || 'leads_meta';

export const READONLY_FIELDS = [
  'id',
  'id_lead_meta',
  'fecha_registro',
  'nombre_anuncio',
  'formulario_origen',
  'plataforma',
  'servicio_requerido',
  'urgencia_proyecto',
  'frecuencia_subcontratacion',
  'rol_en_proyecto',
  'tipo_obra',
  'tamano_proyecto',
  'material_preferido',
  'email',
  'nombre_completo',
  'telefono',
  'ciudad',
  'pais',
  'fecha_nacimiento',
  'edad',
  'p_servicio_requerido',
  'p_urgencia_proyecto',
  'p_frecuencia_subcontratacion',
  'p_rol_en_proyecto',
  'p_tipo_obra',
  'p_tamano_proyecto',
  'p_material_preferido',
  'p_edad',
  'p_promedio_ponderado',
  'created_at',
  'updated_at'
];

export const EDITABLE_BOOLEAN_FIELDS = [
  'whatsapp',
  'mostro_interes',
  'hubo_objecion',
  'cotizacion_enviada',
  'newsletter_enviado',
  'respondio_newsletter',
  'mensaje_24h_enviado',
  'respondio_24h',
  'mensaje_72h_enviado',
  'respondio_72h',
  'mensaje_7d_enviado',
  'respondio_7d'
];

export const AUTO_TIMESTAMP_MAP = {
  newsletter_enviado: 'fecha_newsletter',
  respondio_newsletter: 'fecha_respuesta_newsletter',
  mensaje_24h_enviado: 'fecha_mensaje_24h',
  respondio_24h: 'fecha_respuesta_24h',
  mensaje_72h_enviado: 'fecha_mensaje_72h',
  respondio_72h: 'fecha_respuesta_72h',
  mensaje_7d_enviado: 'fecha_mensaje_7d',
  respondio_7d: 'fecha_respuesta_7d'
};

export const MANUAL_TEXT_FIELDS = ['observaciones', 'actualizado_por'];
