// Routes pour la fonctionnalité : Valider Offre(transformé projet en nouveau contrat ou nouvelle pièce)
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
import { api_projects_project_validateofferValidator } from '../validators/api_projects_project_validateofferValidator';
import { validateBody } from '../middleware/zodValidator';


const router = Router();

router.post('/', validateBody(api_projects_project_validateofferValidator),  async (req, res) => {
  try {
    const response = await sendSoapRequest(req.body);
    res.json(response);
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
