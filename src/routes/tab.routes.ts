import { Router } from 'express';
import * as Tabservice from '../services/Tab.services';
//import { api_tabValidator } from '../validators/';
import { validateBody } from '../middleware/zodValidator';



const tabrouter = Router();

tabrouter.post( '/Tab_ListItems',Tabservice.Tab_ListItems);
tabrouter.post( '/Tab_ListValues', Tabservice.Tab_ListValues);
tabrouter.post( '/Tab_GetValue', Tabservice.Tab_GetValue);
export default tabrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
