import { Router } from 'express';
import { cont_newpiece } from '../services/ajout_pièce_au_contrat/cont_newpiece.service';

const router = Router();

router.post('/cont-newpiece', async (req, res) => {
  try {
    const result = await cont_newpiece(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error?.message });
  }
});

export default router;