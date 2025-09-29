// Routes pour la fonctionnalité : Update pièce du contrat
import { Router } from 'express';

import { cont_piece_update } from '../services/update_contrat/cont_update.service';
import { api_update_piece_contratValidator } from '../validators/api_update_piece_contratValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';


const router = Router();

router.post('/', validateBody(api_update_piece_contratValidator), asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const contrat = req.body.contrat
     const produit=req.body.produit ? req.body.produit :undefined
    const piece=req.body.piece
    const Effet=req.body.effet ? req.body.effet :null
    const data = req.body.data ? req.body.data :""
    const response = await cont_piece_update(
      contrat,
      produit,
      piece,
      Effet,
      data,
      _BasSecurityContext ?? req.body.basSecurityContext,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(response);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
