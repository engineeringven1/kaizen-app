'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data?.error || 'Contraseña incorrecta.');
      }
    });
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <p className="eyebrow">Kaizen Structures</p>
        <h2>Panel de secretaria</h2>
        <p className="login-sub">Ingresa la contraseña para continuar.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="button button-primary" type="submit" disabled={isPending}>
            {isPending ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
