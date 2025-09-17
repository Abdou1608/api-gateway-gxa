import { Router } from 'express';
import { quittance_listitems } from '../services/liste_des_quittances/quittance_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_quittancesValidator } from '../validators/api_liste_des_quittancesValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_liste_des_quittancesValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
 const dossier =req.body.dossier
 const contrat=req.body.contrat 
 //console.log("dossier==="+dossier)

    const result = await quittance_listitems(dossier,contrat,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
