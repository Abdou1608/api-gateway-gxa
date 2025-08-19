import { Router } from 'express';
import { quittance_details } from '../services/detail_quittance/quittance_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_quittanceValidator } from '../validators/api_detail_quittanceValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_detail_quittanceValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
    const quittance=req.body.quittance
    const details=req.body.details ?? true
    const garanties= req.body.garanties ?? true
    const addinfospqg= req.body.addinfospqg ?? true
    const intervenants = req.body.intervenants  ?? true
    const addinfosqint = req.body.addinfosqint  ?? true
    const result = await quittance_details(quittance,details,garanties,addinfospqg,intervenants,addinfosqint,  _BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
