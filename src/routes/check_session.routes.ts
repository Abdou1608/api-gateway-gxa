import { Router } from 'express';
import { checksession_ } from '../services/check_session/checksession_.service';

const router = Router();

router.post('/checksession-', async (req, res) => {
  try {
    const result = await checksession_(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;