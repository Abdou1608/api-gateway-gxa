import { Router } from 'express';
import { cont_details } from '../services/detail_contrat/cont_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_contratValidator } from '../validators/api_detail_contratValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_detail_contratValidator), asyncHandler(async (req, res) => {
   let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await cont_details(
      req.body,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
