import { Router } from 'express';
import * as sinistreService from '../services/sinistre.service';
import * as Validators  from '../validators';
import { validateBody } from '../middleware/zodValidator';



const sinrouter = Router();

// NOTE: Validators names may need sync with actual exported validator constants. Adjust if mismatch..api_sinistres_sinistre
sinrouter.post( '/sinistre_listitems',validateBody(Validators.api_sinistres_sinistre_listitemsValidator), sinistreService.Sinistre_ListItemsHandler);
sinrouter.post( '/sinistre_detail',validateBody(Validators.api_sinistres_sinistre_detailValidator), sinistreService.Sinistre_DetailHandler);
sinrouter.post( '/sinistre_create',validateBody(Validators.api_sinistres_sinistre_createValidator), sinistreService.Sinistre_CreateHandler);
sinrouter.post( '/sinistre_update',validateBody(Validators.api_sinistres_sinistre_updateValidator), sinistreService.Sinistre_updateHandler);

export default sinrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
