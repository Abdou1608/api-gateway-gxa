import { Router } from 'express';
import { kco_cashtransaction } from '../services/create_reglement/kco_cashtransaction.service';

const router = Router();

router.post('/kco-cashtransaction', async (req, res) => {
  try {
    const result = await kco_cashtransaction(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;