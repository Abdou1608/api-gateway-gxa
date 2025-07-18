import { Router } from 'express';
import { quittance_create } from '../services/create_quittance/quittance_create.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_quittanceValidator } from '../validators/api_create_quittanceValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_create_quittanceValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const piece= req.body.piece 
   const bordereau= req.body.bordereau 
   const effet=req.body.effet 
   const data= req.body.data
    const result = await quittance_create(contrat,piece,bordereau,effet,data, _BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
