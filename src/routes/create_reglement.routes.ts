import { Router } from 'express';
import { kco_cashtransaction } from '../services/create_reglement/kco_cashtransaction.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_reglementValidator } from '../validators/api_create_reglementValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_create_reglementValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
    const result = await kco_cashtransaction(req.body, _BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
