import { Router } from 'express';
import * as Tabservice from '../services/Tab.services';
//import { api_tabValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const tabrouter = Router();

tabrouter.post( '/Tab_ListItems', asyncHandler(Tabservice.Tab_ListItems));
tabrouter.post( '/Tab_ListValues', asyncHandler(Tabservice.Tab_ListValues));
tabrouter.post( '/Tab_GetValue', asyncHandler(Tabservice.Tab_GetValue));
export default tabrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
