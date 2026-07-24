import { Router } from 'express';
import { prisma } from '../db';
import pino from 'pino';

const router = Router();
const logger = pino({ name: 'profile-route' });

router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ error: "Missing address parameter" });
    }

    const profile = await prisma.profile.findUnique({
      where: { owner: address },
      include: {
        links: true,
        attestations: {
          orderBy: { ledger: 'desc' },
          take: 20,
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(profile);
  } catch (err: any) {
    logger.error({ err }, "Error fetching profile");
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { owner, metadataUri, createdLedger } = req.body;
    if (!owner || !metadataUri) {
      return res.status(400).json({ error: "Missing owner or metadataUri" });
    }

    const profile = await prisma.profile.upsert({
      where: { owner },
      update: { metadataUri },
      create: {
        owner,
        metadataUri,
        createdLedger: Number(createdLedger || 0),
      },
    });

    return res.json(profile);
  } catch (err: any) {
    logger.error({ err }, "Error upserting profile");
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
