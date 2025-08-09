
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = req.query.id as string | undefined;
    if (id) {
      const p = await prisma.patient.findUnique({ where: { id } });
      return res.json({ patient: p ? { ...p, probability: 0.18, tier: 'Moderate', checkinUrl: `https://your.app/checkin/TOKEN` } : null });
    }
    const patients = await prisma.patient.findMany({ take: 50 });
    return res.json({ patients: patients.map(p => ({ id: p.id, name: p.name, probability: 0.18, tier: 'Moderate' })) });
  }
  res.status(405).end();
}
