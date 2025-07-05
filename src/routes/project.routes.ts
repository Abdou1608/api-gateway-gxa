import { Router } from 'express';
import * as ProjectService from '../services/project.service';

const router = Router();

router.post('/project_listitems', ProjectService.Project_ListItemsHandler);
router.post('/Project_OfferListItems', ProjectService.Project_OfferListItemsHandler);
router.post('/project_detail', ProjectService.Project_DetailHandler);
router.post('/project_create', ProjectService.Project_CreateHandler);
router.post('/project_update', ProjectService.Project_updateHandler);
router.post('/project_addoffer', ProjectService.Project_AddOfferHandler);
router.post('/project_deleteoffer', ProjectService.Project_DeleteOfferHandler);
router.post('/project_validateoffer', ProjectService.Project_ValidateOfferHandler);
export default router