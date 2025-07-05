import { Router } from 'express';
import { quittance_listitems } from '../services/liste_des_quittances/quittance_listitems.service';

const router = Router();

router.post('/quittance-listitems', async (req, res) => {
  try {
    const result = await quittance_listitems(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;