import { Router } from 'express';

import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { tiers_search } from '../services/liste_des_tiers/tiers_search.service';
import { api_tiers_searchValidator } from '../validators/api_tiers_searchValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_tiers_searchValidator), async (req, res) => {
try {
    const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
  const reference=req.body.reference ?? ""
  const dppname=req.body.dppname ?? reference
  
//console.log("-----------------------------Données Reccus dans Recherche Tier Route req.body.SessionId =="+ req.body.BasSecurityContext._SessionId)


  const result = await tiers_search(_BasSecurityContext,reference,dppname);
  res.json(result);
} catch (error:any) {
  res.status(500).json({message:error.message, detail: error });
}
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
