import { Router } from 'express';
import { bran_listitems } from '../services/Bran_listitems.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_liste_des_bransValidator } from '../validators/api_liste_des_bransValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_liste_des_bransValidator), async (req, res) => {
  try {
  const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId

//console.log("-----------------------------Données Reccus Route listedesbrans req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  
    const result = await bran_listitems(_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
