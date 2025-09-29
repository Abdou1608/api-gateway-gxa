import { Router } from 'express';
import * as Riskservice from '../services/Risque.services';
//import { api_riskValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const riskrouter = Router();

riskrouter.post( '/risk_listitems', asyncHandler(Riskservice.Risk_ListItems));
riskrouter.post( '/risk_create', asyncHandler(Riskservice.Risk_Create));
riskrouter.post( '/risk_update', asyncHandler(Riskservice.Risk_Update));
export default riskrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
