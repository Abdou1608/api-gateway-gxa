import { Router } from 'express';

import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { tiers_search } from '../services/liste_des_tiers/tiers_search.service';
import { api_tiers_searchValidator } from '../validators/api_tiers_searchValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_tiers_searchValidator), asyncHandler(async (req, res) => {
  let _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
const reference=req.body.reference ?? ""
  const dppname=req.body.dppname ?? null
  const ntel =req.body.ntel ?? null
  const datenais= req.body.datenais ?? null
  const typetiers=req.body.typetiers ?? null
  const rsociale=req.body.rsociale ?? null
  
  
//console.log("-----------------------------Données Reccus dans Recherche Tier Route req.body.SessionId =="+ req.body.BasSecurityContext._SessionId)


  const result = await tiers_search(
    _BasSecurityContext,
    reference,
    dppname,
    ntel,
    datenais,
    typetiers,
    rsociale,
    { userId: (req as any).user?.sub, domain: req.body?.domain }
  );
  res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
