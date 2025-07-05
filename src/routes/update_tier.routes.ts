import { Router } from 'express';
import { tiers_update } from '../services/update_tier/tiers_update.service';

const router = Router();

router.put('/tiers-update', async (req, res) => {
  const dossier = JSON.parse(req.body.dossier)
  try {
    const result = await tiers_update(dossier,req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;