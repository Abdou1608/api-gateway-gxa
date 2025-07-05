// Routes pour la fonctionnalité : Update pièce du contrat
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
import { cont_piece_update } from '../services/update_contrat/cont_update.service';
const router = Router();

router.put('/', async (req, res) => {
  try {
    const dossier = parseInt(req.body.dossier)
    const piece=req.body.piece
    const data = req.body.data
    const response = await cont_piece_update( dossier,piece,data,req.body.BasSecurityContext ?? req.body.basSecurityContext );
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
