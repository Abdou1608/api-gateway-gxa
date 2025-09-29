import { Router } from 'express';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_adhesionValidator } from '../validators/api_detail_adhesionValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';
import { adh_details } from '../services/detail_adhesion/adh_details.service';



const router = Router();

router.post('/', validateBody(api_detail_adhesionValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await adh_details(
      req.body,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
