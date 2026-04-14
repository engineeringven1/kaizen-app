# Kaizen Leads Secretary App

App base en **Next.js (Node.js)** para que la secretaria gestione el seguimiento operativo de leads cargados en `leads_meta` dentro de Supabase.

## Que decisiones tome por criterio

La app separa claramente dos mundos:

- **Solo lectura**: datos originales del lead, score, origen, servicio, pais, ciudad, etc.
- **Edicion operativa**: interes, objeciones, cotizacion, newsletter, seguimiento 24h, 72h, 7 dias, observaciones y responsable.

Tambien deje esta regla:

- Cuando la secretaria marca una accion o respuesta, la app **autocompleta el timestamp correspondiente**.
- Si se toca un evento de contacto, la app actualiza `ultimo_contacto` automaticamente.
- `updated_at` se refresca al guardar.

## Campos operativos editables

- `mostro_interes`
- `hubo_objecion`
- `cotizacion_enviada`
- `newsletter_enviado`
- `respondio_newsletter`
- `mensaje_24h_enviado`
- `respondio_24h`
- `mensaje_72h_enviado`
- `respondio_72h`
- `mensaje_7d_enviado`
- `respondio_7d`
- `observaciones`
- `actualizado_por`

## Fechas que se completan automatico

- `fecha_newsletter`
- `fecha_respuesta_newsletter`
- `fecha_mensaje_24h`
- `fecha_respuesta_24h`
- `fecha_mensaje_72h`
- `fecha_respuesta_72h`
- `fecha_mensaje_7d`
- `fecha_respuesta_7d`
- `ultimo_contacto`

## Estados visuales incluidos

- Pendiente 24h
- Pendiente 72h
- Pendiente 7d
- Interesado
- Con objecion
- Newsletter enviado sin respuesta
- Cotizacion enviada

## Estructura principal

- `/app/page.jsx` dashboard y listado
- `/app/leads/[id]/page.jsx` ficha de cada lead
- `/app/api/leads/[id]/route.js` actualizacion operativa
- `/lib/leads.js` lectura de datos
- `/lib/utils.js` reglas de timestamps y estado

## Modo demo

Si no configuras variables de entorno, la app usa `data/sample-leads.json` con datos de ejemplo.

## Conectar a Supabase

1. Copia `.env.example` a `.env.local`
2. Llena:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_TABLE=leads_meta`
3. Instala dependencias y corre el proyecto

## Correr local

```bash
npm install
npm run dev
```

## Recomendacion importante de seguridad

Tu notebook original contiene una clave secreta de Supabase incrustada. **No reutilices ni compartas esa clave tal como esta**. Lo correcto es rotarla en Supabase y luego usar la nueva clave mediante variables de entorno.

## Siguiente paso recomendado

Despues de probar esta base, el paso natural es agregar:

1. login interno
2. filtros por pais / score / estado
3. plantilla de mensajes 24h, 72h y 7 dias
4. panel de tareas pendientes por dia
5. integracion con n8n para automatizar avisos
