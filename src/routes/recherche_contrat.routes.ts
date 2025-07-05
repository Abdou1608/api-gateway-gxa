import { Router } from 'express';
import { _ } from '../services/recherche_contrat/_.service';

const router = Router();

router.post('/-', async (req, res) => {
  try {
    const result = await _(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;