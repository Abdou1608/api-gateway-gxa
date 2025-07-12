import { Router } from 'express';
import { cont_details } from '../services/detail_contrat/cont_details.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await cont_details(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;