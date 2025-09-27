import { Router } from 'express';
import { closesession_ } from '../services/logout/closesession_.service';
import { api_logoutValidator } from '../validators/api_logoutValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_logoutValidator), async (req, res, next) => {
  try {
    const result = await closesession_(req.body);
    res.json(result);
  } catch (error:any) {
    return next(error);
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
