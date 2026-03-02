'use client';

import { useState } from 'react';
import { PAYMENT_RECEIVERS, SERVICE_FIELDS } from '@/lib/constants';

type Material = { id: number; name: string };

export function NewReportForm({ materials, blocked }: { materials: Material[]; blocked: boolean }) {
  const [result, setResult] = useState<{ id: number; computedTotal: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (formData: FormData) => {
    setLoading(true);
    setError('');
    const services = Object.fromEntries(SERVICE_FIELDS.map((f) => [f, Number(formData.get(f) || 0)]));
    const mediaFiles = formData.getAll('media') as File[];
    const paymentFiles = formData.getAll('paymentMedia') as File[];
    const payload = {
      contractorName: String(formData.get('contractorName') || ''),
      date: String(formData.get('date') || ''),
      orderNumber: String(formData.get('orderNumber') || ''),
      paidByCustomer: Number(formData.get('paidByCustomer') || 0),
      paymentReceiver: String(formData.get('paymentReceiver') || ''),
      distanceMiles: Number(formData.get('distanceMiles') || 0),
      techsQuantity: Number(formData.get('techsQuantity') || 1),
      addons: formData.get('addons') === 'on',
      extraWork: Number(formData.get('extraWork') || 0),
      extraMaterial: Number(formData.get('extraMaterial') || 0),
      tolls: Number(formData.get('tolls') || 0),
      tips: Number(formData.get('tips') || 0),
      comments: String(formData.get('comments') || ''),
      messageFlag: formData.get('messageFlag') === 'on',
      services,
      materials: materials.map((m) => ({ materialId: m.id, qty: Number(formData.get(`material_${m.id}`) || 0) })),
      media: [
        ...paymentFiles.filter((f) => f.size > 0).map((f) => ({ kind: 'payment', filename: f.name, mimetype: f.type, size: f.size })),
        ...mediaFiles.filter((f) => f.size > 0).map((f) => ({ kind: 'media', filename: f.name, mimetype: f.type, size: f.size }))
      ]
    };

    const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setLoading(false);
    if (!res.ok) return setError(await res.text());
    setResult(await res.json());
  };

  if (result) return <div className="card"><h2 className="font-bold text-xl">Report submitted</h2><p>ID #{result.id}</p><p>Total: ${result.computedTotal}</p></div>;

  return (
    <form action={submit} className="space-y-4">
      {blocked && <p className="card text-amber-700">Contact admin</p>}
      <section className="card grid gap-2">
        <h2 className="font-semibold">1) Invoice Info</h2>
        <input name="contractorName" placeholder="Contractor Name" required />
        <input name="date" type="date" required />
        <input name="orderNumber" placeholder="Order Number" required />
        <input name="paidByCustomer" type="number" step="0.01" placeholder="Paid by Customer" required />
        <select name="paymentReceiver" required>{PAYMENT_RECEIVERS.map((v) => <option key={v}>{v}</option>)}</select>
        <input name="distanceMiles" type="number" min="0" required placeholder="Distance miles" />
        <select name="techsQuantity" required><option value="1">1 tech</option><option value="2">2 techs</option></select>
        <label><input type="checkbox" name="addons" /> Addons</label>
      </section>
      <section className="card"><h2 className="font-semibold mb-2">2) Services</h2><div className="grid grid-cols-1 gap-2">{SERVICE_FIELDS.map((f) => <label key={f} className="text-sm">{f}<input type="number" min="0" name={f} defaultValue={0} /></label>)}</div></section>
      <section className="card"><h2 className="font-semibold mb-2">3) Materials</h2><div className="grid gap-2">{materials.map((m) => <label key={m.id} className="flex items-center justify-between text-sm"><span>{m.name}</span><input className="w-20" type="number" name={`material_${m.id}`} min="0" max="9" defaultValue={0} /></label>)}</div></section>
      <section className="card grid gap-2"><h2 className="font-semibold">4) Financial</h2><input type="number" step="0.01" name="extraWork" placeholder="Extra work" defaultValue={0}/><input type="number" step="0.01" name="extraMaterial" placeholder="Extra material" defaultValue={0}/><input type="number" step="0.01" name="tolls" placeholder="Tolls" defaultValue={0}/><input type="number" step="0.01" name="tips" placeholder="Tips" defaultValue={0}/></section>
      <section className="card"><h2 className="font-semibold">5) Comments + Message</h2><textarea name="comments" /><label><input type="checkbox" name="messageFlag" /> Message</label></section>
      <section className="card"><h2 className="font-semibold">6) Media (metadata only)</h2><label className="text-sm">Payment proof<input type="file" name="paymentMedia" multiple /></label><label className="text-sm">Job media<input type="file" name="media" multiple /></label></section>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading || blocked} className="w-full bg-slate-900 text-white">{loading ? 'Submitting...' : 'Submit Report'}</button>
    </form>
  );
}
