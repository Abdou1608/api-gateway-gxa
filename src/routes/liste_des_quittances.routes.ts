import { Router } from 'express';
import { quittance_listitems } from '../services/liste_des_quittances/quittance_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_quittancesValidator } from '../validators/api_liste_des_quittancesValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';
import groupByTypename from '../utils/groupByTypename';



const router = Router();

router.post('/', validateBody(api_liste_des_quittancesValidator), asyncHandler(async (req, res) => {
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
 
 const dossier =req.body.dossier ?? req.body.Dossier ?? null
 const contrat=req.body.contrat ?? req.body.Contrat ?? null
 //console.log("dossier==="+dossier)

    const result = await quittance_listitems(
      dossier,
      contrat,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    const grouped = groupByTypename(result, { keepUnknown: true }); 
    res.json(grouped);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
