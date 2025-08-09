import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { token, ...payload } = req.body || {};
  const patient = await prisma.patient.findFirst();
  if (!patient) return res.status(400).json({ error: 'no patient in DB (run seed or add)' });

  await prisma.checkin.create({
    data: {
      patientId: patient.id,
      fallsLast30d: payload.fallsLast30d ?? 0,
      sleepHours: payload.sleepHours ?? 7,
      painScore: payload.painScore ?? 3,
      moodScore: payload.moodScore ?? 6,
      adl_bathing: payload.adl_bathing ?? 0,
      adl_dressing: payload.adl_dressing ?? 0,
      adl_toileting: payload.adl_toileting ?? 0,
      adl_transferring: payload.adl_transferring ?? 0,
      adl_continence: payload.adl_continence ?? 0,
      adl_feeding: payload.adl_feeding ?? 0,
      iadl_shopping: payload.iadl_shopping ?? 0,
      iadl_cooking: payload.iadl_cooking ?? 0,
      iadl_housekeeping: payload.iadl_housekeeping ?? 0,
      iadl_finances: payload.iadl_finances ?? 0,
      iadl_meds: payload.iadl_meds ?? 0,
      iadl_phone: payload.iadl_phone ?? 0,
      iadl_transport: payload.iadl_transport ?? 0,
    }
  });

  const probability = 0.27;
  const tier = probability >= 0.5 ? 'Critical' : probability >= 0.25 ? 'High' : probability >= 0.10 ? 'Moderate' : 'Low';
  await prisma.score.create({ data: { patientId: patient.id, modelVersion: 1, probability, tier } });
  return res.json({ probability, tier });
}
