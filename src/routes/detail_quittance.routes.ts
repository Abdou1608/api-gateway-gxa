import { Router } from 'express';
import { quittance_details } from '../services/detail_quittance/quittance_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_quittanceValidator } from '../validators/api_detail_quittanceValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_detail_quittanceValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const quittance=req.body.quittance
    const details=req.body.details ?? true
    const garanties= req.body.garanties ?? true
    const addinfospqg= req.body.addinfospqg ?? true
    const intervenants = req.body.intervenants  ?? true
    const addinfosqint = req.body.addinfosqint  ?? true
    const result = await quittance_details(
      quittance,
      details,
      garanties,
      addinfospqg,
      intervenants,
      addinfosqint,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
