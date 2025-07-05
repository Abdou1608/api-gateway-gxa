// Routes pour la fonctionnalité : Recherche Reglement
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
const router = Router();

router.post('/oui', async (req, res) => {
  try {
    const response = await sendSoapRequest(req.body);
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
