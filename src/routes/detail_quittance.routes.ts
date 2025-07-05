import { Router } from 'express';
import { quittance_details } from '../services/detail_quittance/quittance_details.service';

const router = Router();

router.post('/quittance-details', async (req, res) => {
  try {
    const result = await quittance_details(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;