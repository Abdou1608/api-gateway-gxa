import { Router } from 'express';
import { tiers_details } from '../services/detail_tier/tiers_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_tierValidator } from '../validators/api_detail_tierValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_detail_tierValidator), async (req, res) => {
  
  try {
    const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId ?? req.body.BasSecurityContext?.SessionId 
  const Dossier=req.body.Dossier ?? 0
  const comp= req.body.composition ?? false
  const ext=req.body.extentions ?? false
    const result = await tiers_details(_BasSecurityContext,Dossier,comp,ext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message ?? error });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
