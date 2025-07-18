import { Router } from 'express';
import { tiers_update } from '../services/update_tier/tiers_update.service';
//import { api_update_tierValidator } from '../validators/api_update_tierValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.put('/',  async (req, res) => {
  const dossier = JSON.parse(req.body.dossier)
  try {
    const result = await tiers_update(dossier,req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
