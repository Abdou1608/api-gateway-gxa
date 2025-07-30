import { Router } from 'express';
import * as Riskservice from '../services/Risque.services';
//import { api_riskValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';



const riskrouter = Router();

riskrouter.post( '/risk_listitems',Riskservice.Risk_ListItems);
riskrouter.post( '/risk_create', Riskservice.Risk_Create);
riskrouter.post( '/risk_update', Riskservice.Risk_Update);
export default riskrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
