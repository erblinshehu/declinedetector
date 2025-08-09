import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const scores = await prisma.score.findMany({ where: { timestamp: { gte: new Date(Date.now()-30*24*3600*1000) } } });
  const total = scores.length || 1;
  const high = scores.filter(s => s.tier === 'High' || s.tier === 'Critical').length;
  const pctHigh = high / total;
  return res.json({ totalScored: total, pctHigh });
}
