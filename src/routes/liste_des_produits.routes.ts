import { Router } from 'express';
import { produit_listitems } from '../services/liste_des_produits/produit_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';

const router = Router();

router.post('/', async (req, res) => {
  const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
 const branche =req.body.branche  ?? null
 const entites=req.body.extentions ?? null
 const typeecran=req.body.typeecran ?? null
const disponible=req.body.disponible ?? true
console.log("-----------------------------Données Reccus Route listedesproduits req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  try {
    const result = await produit_listitems(typeecran,branche,disponible,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;