// Routes pour la fonctionnalité : Update Reglement
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
//import { api_update_reglementValidator } from '../validators/api_update_reglementValidator';
import { validateBody } from '../middleware/zodValidator';


const router = Router();

router.put('/', 
 async (req, res) => {
  try {
    //const response = req.body;
   // res.json(response);
   throw new Error("Fonction Non Disponible");
   
  } catch (error:any) {
   res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
