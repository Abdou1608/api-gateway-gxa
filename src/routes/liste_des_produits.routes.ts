import { Router } from 'express';
import { produit_listitems } from '../services/liste_des_produits/produit_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_produitsValidator } from '../validators/api_liste_des_produitsValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_liste_des_produitsValidator), asyncHandler(async (req, res) => {
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
 const branche =req.body.branche  ?? null
 const entites=req.body.extentions ?? null
 const typeecran=req.body.typeecran ?? null
const disponible=req.body.disponible ?? true
console.log("-----------------------------Données Reccus Route listedesproduits req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  
    const result = await produit_listitems(
      typeecran,
      branche,
      disponible,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
