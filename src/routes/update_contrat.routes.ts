import { Router } from 'express';
import { cont_update } from '../services/update_contrat/cont_update.service';
import { api_contrat_updateValidator } from '../validators/api_contrat_updateValidator';
import { validateBody } from '../middleware/zodValidator';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';



const router = Router();

router.post('/', validateBody(api_contrat_updateValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const piece= req.body.piece
   const effet= req.body.effet
   const data= req.body.data
    const result = await cont_update(contrat,effet,piece,data,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
