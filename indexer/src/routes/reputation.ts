import { Router } from 'express';
import { prisma } from '../db';
import pino from 'pino';

const router = Router();
const logger = pino({ name: 'reputation-route' });

router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ error: "Missing address parameter" });
    }

    const attestations = await prisma.attestation.findMany({
      where: { owner: address },
      orderBy: { ledger: 'desc' },
      take: 50,
    });

    const score = attestations.reduce((acc: number, curr: any) => acc + curr.delta, 0);

    return res.json({
      score,
      attestations,
    });
  } catch (err: any) {
    logger.error({ err }, "Error fetching reputation");
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
