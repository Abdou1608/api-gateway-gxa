import { Router } from 'express';
import { cont_newpiece } from '../services/ajout_piece_au_contrat/cont_newpiece.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_ajout_piece_au_contratValidator } from '../validators/api_ajout_piece_au_contratValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', validateBody(api_ajout_piece_au_contratValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const produit= req.body.produit 
   const effet=req.body.effet 
   const data= req.body.data
    const result = await cont_newpiece(
      contrat,
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
