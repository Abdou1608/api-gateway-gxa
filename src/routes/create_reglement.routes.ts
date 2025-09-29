import { Router } from 'express';
import { kco_cashtransaction } from '../services/create_reglement/kco_cashtransaction.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_reglementValidator } from '../validators/api_create_reglementValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_create_reglementValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await kco_cashtransaction(
      req.body,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
