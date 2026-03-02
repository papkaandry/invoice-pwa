'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [telegramJson, setTelegramJson] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async () => {
    setError('');
    try {
      const payload = JSON.parse(telegramJson);
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/app');
    } catch (e) {
      setError((e as Error).message || 'Login failed');
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Technician Login</h1>
      <div className="card text-sm text-slate-600">Telegram widget integration is ready server-side. For local/dev, paste Telegram auth payload JSON here.</div>
      <textarea className="h-48" value={telegramJson} onChange={(e) => setTelegramJson(e.target.value)} placeholder='{"id":"123", "first_name":"John", "hash":"..."}' />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="bg-slate-900 text-white w-full" onClick={onSubmit}>Login via Telegram</button>
    </main>
  );
}
