import { Router } from 'express';
import { tiers_create } from '../services/create_tier/tiers_create.service';
//import { api_create_tierValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/',  async (req, res) => {
  try {
  const  typtiers=req.body.typtiers
	const nature =req.body.nature
const	numtiers=req.body.numtiers
const	numdpp=req.body.numdpp
const	data =req.body.data
    const result = await tiers_create(typtiers,nature,numtiers,numdpp,data);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
