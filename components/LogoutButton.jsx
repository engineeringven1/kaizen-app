'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    });
  }

  return (
    <button
      className="button button-secondary button-small"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? 'Saliendo...' : 'Cerrar sesión'}
    </button>
  );
}
