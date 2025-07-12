// Routes pour la fonctionnalité : Ajouté Offre au projet
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const response = await sendSoapRequest(req.body, "ajouté_offre_au_projet");
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
