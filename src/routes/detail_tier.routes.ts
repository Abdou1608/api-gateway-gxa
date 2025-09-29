import { Router } from 'express';
import { tiers_details } from '../services/detail_tier/tiers_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_tierValidator } from '../validators/api_detail_tierValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_detail_tierValidator), asyncHandler(async (req, res) => { 
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
  const Dossier=req.body.Dossier ?? req.body.dossier 
  const comp= req.body.composition ?? true
  const ext=false
    const result = await tiers_details(
      _BasSecurityContext,
      Dossier,
      comp,
      ext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
