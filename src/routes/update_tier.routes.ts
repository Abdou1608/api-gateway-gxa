import { Router } from 'express';
import { tiers_update } from '../services/update_tier/tiers_update.service';
//import { api_update_tierValidator } from '../validators/api_update_tierValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';



const router = Router();

router.put('/', asyncHandler(async (req, res) => {
  const dossier = JSON.parse(req.body.dossier)
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
const	numtiers=req.body.numtiers?? null
const	numdpp=req.body.numdpp?? null
const	data =req.body.data
    const result = await tiers_update(
      dossier,
      data,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
