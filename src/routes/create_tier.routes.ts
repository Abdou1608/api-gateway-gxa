import { Router } from 'express';
import { tiers_create } from '../services/create_tier/tiers_create.service';
import { api_Create_tierValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';



const router = Router();

router.post('/', validateBody(api_Create_tierValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId

  const  typtiers=req.body.typtiers
	const nature =req.body.nature
const	numtiers=req.body.numtiers?? null
const	numdpp=req.body.numdpp?? null
const	data =req.body.data
    const result = await tiers_create(_BasSecurityContext,typtiers,nature,numtiers,numdpp,data);
    res.json(result);
  } catch (error:any) {
    res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
