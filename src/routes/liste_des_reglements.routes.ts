// Routes pour la fonctionnalité : Liste des Reglements
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
//import { api_liste_des_reglementsValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';


const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const response = await sendSoapRequest(req.body);
    res.json(response);
  } catch (error:any) {
   return next(error);  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
