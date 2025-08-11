// Routes pour la fonctionnalité : Update pièce du contrat
import { Router } from 'express';

import { cont_piece_update } from '../services/update_contrat/cont_update.service';
import { api_update_piece_contratValidator } from '../validators/api_update_piece_contratValidator';
import { validateBody } from '../middleware/zodValidator';


const router = Router();

router.post('/', validateBody(api_update_piece_contratValidator), async (req, res) => {
  try {
    const contrat = req.body.contrat
    const produit=req.body.produit
    const piece=req.body.piece
    const Effet=req.body.effet
    const data = req.body.data
    const response = await cont_piece_update( contrat,produit,piece,Effet,data,req.body.BasSecurityContext ?? req.body.basSecurityContext );
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
