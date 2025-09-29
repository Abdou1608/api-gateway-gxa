import { Router } from 'express';
import { bran_listitems } from '../services/Bran_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_bransValidator } from '../validators/api_liste_des_bransValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_liste_des_bransValidator), asyncHandler(async (req, res) => {
  const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId

//console.log("-----------------------------Données Reccus Route listedesbrans req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  
    const result = await bran_listitems(
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
