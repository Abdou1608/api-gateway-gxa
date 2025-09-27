import { Router } from 'express';
import { tiers_update } from '../services/update_tier/tiers_update.service';
//import { api_update_tierValidator } from '../validators/api_update_tierValidator';
import { validateBody } from '../middleware/zodValidator';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';



const router = Router();

router.put('/',  async (req, res, next) => {
  const dossier = JSON.parse(req.body.dossier)
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
const	numtiers=req.body.numtiers?? null
const	numdpp=req.body.numdpp?? null
const	data =req.body.data
    const result = await tiers_update(dossier,data,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
