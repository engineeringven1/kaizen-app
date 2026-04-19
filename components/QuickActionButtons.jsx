'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickActionButtons({ lead }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [sent24h, setSent24h]         = useState(lead.mensaje_24h_enviado === true);
  const [sent72h, setSent72h]         = useState(lead.mensaje_72h_enviado === true);
  const [sent7d, setSent7d]           = useState(lead.mensaje_7d_enviado === true);
  const [sentNews, setSentNews]       = useState(lead.newsletter_enviado === true);

  async function markSent(field, setter) {
    setter(true);
    startTransition(async () => {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: true }),
      });
      router.refresh();
    });
  }

  // Mensaje: avanza 24h → 72h → 7días
  let msgLabel = null;
  let msgField = null;
  let msgSetter = null;
  if (!sent24h) {
    msgLabel = 'Mensaje 24hrs'; msgField = 'mensaje_24h_enviado'; msgSetter = setSent24h;
  } else if (!sent72h) {
    msgLabel = 'Mensaje 72hrs'; msgField = 'mensaje_72h_enviado'; msgSetter = setSent72h;
  } else if (!sent7d) {
    msgLabel = 'Mensaje 7días'; msgField = 'mensaje_7d_enviado'; msgSetter = setSent7d;
  }

  // Newsletter: solo un paso
  const newsLabel = !sentNews ? 'Newsletter' : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'stretch' }}>
      {msgLabel && (
        <button
          className="button button-secondary button-small"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={isPending}
          onClick={() => markSent(msgField, msgSetter)}
        >
          {msgLabel}
        </button>
      )}
      {newsLabel && (
        <button
          className="button button-secondary button-small"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={isPending}
          onClick={() => markSent('newsletter_enviado', setSentNews)}
        >
          {newsLabel}
        </button>
      )}
    </div>
  );
}
