import { Router } from 'express';
import { cont_search } from '../services/liste_des_contrats/cont_search.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_contratsValidator } from '../validators/api_liste_des_contratsValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_liste_des_contratsValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
  const reference=req.body.reference ?? ""
    const detailorigine=req.body.detailorigine
    const origine= req.body.origine 
    const codefic=req.body.codefic ?? ""
    const nomchamp=req.body.nomchamp ??""
    const result = await cont_search(reference,detailorigine,origine,codefic,nomchamp,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
