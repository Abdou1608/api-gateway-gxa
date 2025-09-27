import { Router } from 'express';
import { kco_cashtransaction } from '../services/create_reglement/kco_cashtransaction.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_reglementValidator } from '../validators/api_create_reglementValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_create_reglementValidator), async (req, res, next) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await kco_cashtransaction(req.body, _BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
