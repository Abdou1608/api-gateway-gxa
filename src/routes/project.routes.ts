import { Router } from 'express';
import * as ProjectService from '../services/project.service';
import * as Validators  from '../validators';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post( '/project_listitems',validateBody(Validators.api_projects_project_listitemsValidator), ProjectService.Project_ListItemsHandler);
router.post( '/Project_OfferListItems',validateBody(Validators.api_projects_project_offerlistitemsValidator), ProjectService.Project_OfferListItemsHandler);
router.post( '/project_detail',validateBody(Validators.api_projects_project_detailValidator), ProjectService.Project_DetailHandler);
router.post( '/project_create',validateBody(Validators.api_projects_project_createValidator), ProjectService.Project_CreateHandler);
router.post( '/project_update',validateBody(Validators.api_projects_project_updateValidator), ProjectService.Project_updateHandler);
router.post( '/project_addoffer',validateBody(Validators.api_projects_project_addofferValidator), ProjectService.Project_AddOfferHandler);
router.post( '/project_deleteoffer',validateBody(Validators.api_projects_project_deleteofferValidator), ProjectService.Project_DeleteOfferHandler);
router.post( '/project_validateoffer',validateBody(Validators.api_projects_project_validateofferValidator), ProjectService.Project_ValidateOfferHandler);
export default router
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
