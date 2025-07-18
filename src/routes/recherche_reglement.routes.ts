// Routes pour la fonctionnalité : Recherche Reglement
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
import { api_create_reglementValidator } from '../validators/api_create_reglementValidator';
import { validateBody } from '../middleware/zodValidator';


const router = Router();

router.post('/', validateBody(api_create_reglementValidator), async (req, res) => {
  try {
    const response = await sendSoapRequest(req.body);
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
