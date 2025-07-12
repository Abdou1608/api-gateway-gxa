import { Router } from 'express';
import { quittance_create } from '../services/create_quittance/quittance_create.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await quittance_create(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;