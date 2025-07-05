import { Router } from 'express';
import { produit_listitems } from '../services/liste_des_produits/produit_listitems.service';

const router = Router();

router.post('/produit-listitems', async (req, res) => {
  try {
    const result = await produit_listitems(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;