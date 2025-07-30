import { Router } from 'express';
import * as Riskservice from '../services/Risque.services';
//import { api_riskValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';



const riskrouter = Router();

riskrouter.post( '/Risk_ListItems',Riskservice.Risk_ListItems);
riskrouter.post( '/Risk_Create', Riskservice.Risk_Create);
riskrouter.post( '/Risk_Update', Riskservice.Risk_Update);
export default riskrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
