import { Router } from 'express';
import { cont_search } from '../services/liste_des_contrats/cont_search.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_contratsValidator } from '../validators/api_liste_des_contratsValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_liste_des_contratsValidator), asyncHandler(async (req, res) => {
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
  const reference=req.body.reference ?? ""
    const detailorigine=req.body.detailorigine
    const origine= req.body.origine 
    const codefic=req.body.codefic ?? ""
    const nomchamp=req.body.nomchamp ??""
    const result = await cont_search(
      reference,
      detailorigine,
      origine,
      codefic,
      nomchamp,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
