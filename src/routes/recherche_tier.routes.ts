import { Router } from 'express';

import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { tiers_search } from '../services/liste_des_tiers/tiers_search.service';

const router = Router();

router.post('/', async (req, res) => {

    const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
  const reference=req.body.reference ?? ""
  const dppname=req.body.dppname ?? ""
  
console.log("-----------------------------Données Reccus dans Recherche Tier Route req.body.SessionId =="+ req.body.BasSecurityContext._SessionId)

try {
  const result = await tiers_search(_BasSecurityContext,reference,dppname);
  res.json(result);
} catch (error:any) {
  res.status(500).json({ error: error });
}
});

export default router;