// Routes pour la fonctionnalité : Update Reglement
import { Router } from 'express';
import { sendSoapRequest } from '../services/soap.service';
const router = Router();

router.put('/', async (req, res) => {
  try {
    //const response = req.body;
   // res.json(response);
   throw new Error("Fonction Non Disponible");
   
  } catch (error:any) {
    res.status(500).json({ error: 'SOAP request failed', details: error });
  }
});

export default router;
