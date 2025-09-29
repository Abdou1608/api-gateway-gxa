import { Router } from 'express';
import { cont_update } from '../services/update_contrat/cont_update.service';
import { api_contrat_updateValidator } from '../validators/api_contrat_updateValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';



const router = Router();

router.post('/', validateBody(api_contrat_updateValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const piece= req.body.piece
   const effet= req.body.effet
   const data= req.body.data
    const result = await cont_update(
      contrat,
      effet,
      piece,
      data,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
