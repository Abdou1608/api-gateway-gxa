// Routes pour la fonctionnalité : Update pièce du contrat
import { Router } from 'express';

import { cont_piece_update } from '../services/update_contrat/cont_update.service';
import { api_update_piece_contratValidator } from '../validators/api_update_piece_contratValidator';
import { validateBody } from '../middleware/zodValidator';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';


const router = Router();

router.post('/', validateBody(api_update_piece_contratValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const contrat = req.body.contrat
     const produit=req.body.produit ? req.body.produit :undefined
    const piece=req.body.piece
    const Effet=req.body.effet ? req.body.effet :null
    const data = req.body.data ? req.body.data :""
    const response = await cont_piece_update( contrat,produit,piece,Effet,data,_BasSecurityContext ?? req.body.basSecurityContext );
    res.json(response);
  } catch (error:any) {
   res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
