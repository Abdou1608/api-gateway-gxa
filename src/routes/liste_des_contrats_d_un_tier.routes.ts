import { Router } from 'express';
import { cont_listitems } from '../services/liste_des_contrats_d_un_tier/cont_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_contrats_d_un_tierValidator } from '../validators/api_liste_des_contrats_d_un_tierValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_liste_des_contrats_d_un_tierValidator), async (req, res, next) => {
  try {
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
 
    const dossier=req.body.dossier ?? req.body.Dossier
    const includeall=req.body.includeall ?? true
    const defaut= req.body.defaut ?? false
    const result = await cont_listitems(dossier,includeall,defaut,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
