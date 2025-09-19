import { Router } from 'express';
import { produit_details } from '../services/detail_produit/produit_details.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_detail_produitValidator } from '../validators/api_detail_produitValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_detail_produitValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const code=req.body.code
    const options=req.body.options ?? true
    const basecouv= req.body.basecouvs ?? true
    const clauses= req.body.clauses?? true
    const result = await produit_details(code,_BasSecurityContext, options,basecouv,clauses);
    res.json(result);
  } catch (error:any) {
   res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
