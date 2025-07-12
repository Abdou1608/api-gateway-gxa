import { Router } from 'express';
import { cont_search } from '../services/liste_des_contrats/cont_search.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await cont_search(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;