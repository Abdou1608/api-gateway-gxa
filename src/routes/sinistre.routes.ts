import { Router } from 'express';
import * as sinistreService from '../services/sinistre.service';
import * as Validators  from '../validators';
import { validateBody } from '../middleware/zodValidator';



const sinrouter = Router();

// NOTE: Validators names may need sync with actual exported validator constants. Adjust if mismatch.
sinrouter.post( '/sinistre_listitems',validateBody((Validators as any).api_sinistres_sinistre_listitemsValidator || (Validators as any).api_sinistres_listitemsValidator), sinistreService.Sinistre_ListItemsHandler);
sinrouter.post( '/sinistre_detail',validateBody((Validators as any).api_sinistres_sinistre_detailValidator || (Validators as any).api_sinistres_detailValidator), sinistreService.Sinistre_DetailHandler);
sinrouter.post( '/sinistre_create',validateBody((Validators as any).api_sinistres_sinistre_createValidator || (Validators as any).api_sinistres_createValidator), sinistreService.Sinistre_CreateHandler);
sinrouter.post( '/sinistre_update',validateBody((Validators as any).api_sinistres_sinistre_updateValidator || (Validators as any).api_sinistres_updateValidator), sinistreService.Sinistre_updateHandler);

export default sinrouter
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
