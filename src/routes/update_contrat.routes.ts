import { Router } from 'express';
import { cont_update } from '../services/update_contrat/cont_update.service';
import { api_contrat_updateValidator } from '../validators/api_contrat_updateValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_contrat_updateValidator), async (req, res) => {
  try {
    const result = await cont_update(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
