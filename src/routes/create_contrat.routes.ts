import { Router } from 'express';
import { cont_create } from '../services/create_contrat/cont_create.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await cont_create(req.body, "cont-create");
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;