'use client';

import { useMemo, useState } from 'react';

type Props = {
  cities: any[];
  materials: any[];
  users: any[];
  reports: any[];
};

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function AdminPanel({ cities, materials, users, reports }: Props) {
  const [cityName, setCityName] = useState('');
  const [materialName, setMaterialName] = useState('');

  const [cityFilter, setCityFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const filteredReports = useMemo(() => reports.filter((r) => {
    if (cityFilter !== 'all' && String(r.cityId) !== cityFilter) return false;
    if (techFilter !== 'all' && String(r.userId) !== techFilter) return false;
    const date = new Date(r.date);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  }), [reports, cityFilter, techFilter, fromDate, toDate]);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <section className="card space-y-2">
        <h2 className="font-semibold">Cities</h2>
        <div className="flex gap-2"><input value={cityName} onChange={(e) => setCityName(e.target.value)} /><button className="bg-slate-900 text-white" onClick={async () => { await post('/api/admin/cities', { name: cityName }); location.reload(); }}>Add</button></div>
        <ul>{cities.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      </section>
      <section className="card space-y-2">
        <h2 className="font-semibold">Materials</h2>
        <div className="flex gap-2"><input value={materialName} onChange={(e) => setMaterialName(e.target.value)} /><button className="bg-slate-900 text-white" onClick={async () => { await post('/api/admin/materials', { name: materialName }); location.reload(); }}>Add</button></div>
        <ul>{materials.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
      </section>
      <section className="card">
        <h2 className="font-semibold">Users</h2>
        <div className="space-y-2">{users.map((u) => <div key={u.id} className="border rounded p-2 text-sm"><div>{u.name} (@{u.username})</div><div>City: {u.city?.name ?? 'none'}</div><div className="flex gap-2 mt-1"><select defaultValue={u.cityId ?? ''} onChange={async (e) => { await post('/api/admin/users', { userId: u.id, cityId: e.target.value ? Number(e.target.value) : null }); location.reload(); }}><option value="">No city</option>{cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button className="bg-rose-600 text-white" onClick={async () => { await post('/api/admin/users', { userId: u.id, deactivate: true }); location.reload(); }}>Deactivate</button></div></div>)}</div>
      </section>
      <section className="card">
        <h2 className="font-semibold">Reports</h2>
        <a className="underline text-blue-700" href="/api/admin/reports/export">Export CSV</a>
        <div className="grid sm:grid-cols-4 gap-2 mt-2"><select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}><option value="all">All cities</option>{cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={techFilter} onChange={(e) => setTechFilter(e.target.value)}><option value="all">All techs</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div><div className="space-y-2 mt-2">{filteredReports.map((r) => <details key={r.id} className="border rounded p-2 text-sm"><summary>#{r.id} {r.orderNumber} • {r.city.name} • {r.user.name}</summary><pre className="overflow-auto">{JSON.stringify(r, null, 2)}</pre></details>)}</div>
      </section>
    </main>
  );
}
