
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Patient() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (id) axios.get('/api/patients', { params: { id } }).then(r => setPatient(r.data.patient)).catch(console.error);
  }, [id]);

  if (!patient) return <div className="p-6">Loading…</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{patient.name}</h1>
      <p className="mb-2"><b>Tier:</b> {patient.tier || '-'}</p>
      <p className="mb-2"><b>Risk:</b> {patient.probability !== undefined ? (patient.probability*100).toFixed(1)+'%' : '-'}</p>

      <h2 className="font-medium mt-6 mb-2">Caregiver check-in link</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={async () => {
            const r = await fetch('/api/caregiver/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: patient.id }) });
            const d = await r.json();
            (window as any).prompt('Copy caregiver link', d.url);
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Create link
        </button>
        <span className="text-sm text-gray-600">(generates a 90-day magic URL)</span>
      </div>
    </main>
  );
}
