import { Router } from 'express';
import { cont_listitems } from '../services/liste_des_contrats_d_un_tier/cont_listitems.service';

const router = Router();

router.post('/cont-listitems', async (req, res) => {
  try {
    const result = await cont_listitems(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;