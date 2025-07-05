import { Router } from 'express';
import { closesession_ } from '../services/logout/closesession_.service';

const router = Router();

router.post('/closesession-', async (req, res) => {
  try {
    const result = await closesession_(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;