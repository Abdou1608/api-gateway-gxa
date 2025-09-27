import { Router } from 'express';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_adhesionValidator } from '../validators/api_detail_adhesionValidator';
import { validateBody } from '../middleware/zodValidator';
import { adh_details } from '../services/detail_adhesion/adh_details.service';



const router = Router();

router.post('/', validateBody(api_detail_adhesionValidator), async (req, res, next) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await adh_details(req.body,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
