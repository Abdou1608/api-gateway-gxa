import { Router } from 'express';
import { produit_details } from '../services/detail_produit/produit_details.service';

const router = Router();

router.post('/produit-details', async (req, res) => {
  try {
    const result = await produit_details(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;