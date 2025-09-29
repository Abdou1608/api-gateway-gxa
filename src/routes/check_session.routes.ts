import { Router } from 'express';
import { checksession_ } from '../services/check_session/checksession_.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_check_sessionValidator } from '../validators/api_check_sessionValidator';
import { validateBody } from '../middleware/zodValidator';
import { asyncHandler } from '../middleware/async-handler';



const router = Router();

router.post('/', asyncHandler(async (req, res) => {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    const result = await checksession_(_BasSecurityContext);
    res.json(result);
}));

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
