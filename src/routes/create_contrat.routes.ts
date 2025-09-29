import { Router } from 'express';
import { cont_create } from '../services/create_contrat/cont_create.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_create_contratValidator } from '../validators/api_create_contratValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_create_contratValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   const dossier=req.body.dossier
   const produit= req.body.produit 
   const effet=req.body.effet 
   const data= req.body.data
    const result = await cont_create(
      dossier,
      produit,
      effet,
      data,
      _BasSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
