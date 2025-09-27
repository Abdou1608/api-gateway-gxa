// Routes pour la fonctionnalité : Update Reglement
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
//import { api_update_reglementValidator } from '../validators/api_update_reglementValidator';
import { validateBody } from '../middleware/zodValidator';
import { InternalError } from '../common/errors';


const router = Router();

router.put('/', 
 async (req, res, next) => {
  try {
    //const response = req.body;
   // res.json(response);
   return next(new InternalError('Fonction Non Disponible'));
   
  } catch (error:any) {
   return next(error);  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
