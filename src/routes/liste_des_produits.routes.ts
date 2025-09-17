import { Router } from 'express';
import { produit_listitems } from '../services/liste_des_produits/produit_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_produitsValidator } from '../validators/api_liste_des_produitsValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_liste_des_produitsValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
 const branche =req.body.branche  ?? null
 const entites=req.body.extentions ?? null
 const typeecran=req.body.typeecran ?? null
const disponible=req.body.disponible ?? true
console.log("-----------------------------Données Reccus Route listedesproduits req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  
    const result = await produit_listitems(typeecran,branche,disponible,_BasSecurityContext);
    res.json(result);
  }  catch (error:any) {
   const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });}
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
