import { Router } from 'express';
import { quittance_listitems } from '../services/liste_des_quittances/quittance_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_quittancesValidator } from '../validators/api_liste_des_quittancesValidator';
import { validateBody } from '../middleware/zodValidator';
import groupByTypename from '../utils/groupByTypename';



const router = Router();

router.post('/', validateBody(api_liste_des_quittancesValidator), async (req, res, next) => {
  try {
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
 
 const dossier =req.body.dossier ?? req.body.Dossier ?? null
 const contrat=req.body.contrat ?? req.body.Contrat ?? null
 //console.log("dossier==="+dossier)

    const result = await quittance_listitems(dossier,contrat,_BasSecurityContext);
    const grouped = groupByTypename(result, { keepUnknown: true }); 
    res.json(grouped);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
