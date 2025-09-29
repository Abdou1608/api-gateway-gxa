import { Router } from 'express';
import { quittance_create } from '../services/create_quittance/quittance_create.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_quittanceValidator } from '../validators/api_create_quittanceValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_create_quittanceValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const piece= req.body.piece 
   const bordereau= req.body.bordereau 
   const autocalcul=false 
   const affectation=true
   const data= req.body.data
    const result = await quittance_create(
      contrat,
      piece,
      bordereau,
      autocalcul,
      affectation,
      data,
      _BasSecurityContext,
      undefined,
      undefined,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

router.post('/autocalcule', validateBody(api_create_quittanceValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const piece= req.body.piece 
   const bordereau= req.body.bordereau 
   const autocalcul=true 
   const affectation=true
   const data= req.body.data
   const datedebut= req.body.datedebut
   const datedefin= req.body.datedefin
    const result = await quittance_create(
      contrat,
      piece,
      bordereau,
      autocalcul,
      affectation,
      data,
      _BasSecurityContext,
      datedebut,
      datedefin,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
