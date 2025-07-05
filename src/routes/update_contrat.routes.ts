import { Router } from 'express';
import { cont_update } from '../services/update_contrat/cont_update.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await cont_update(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;