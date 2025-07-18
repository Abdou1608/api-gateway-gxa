import { Router } from 'express';
import { xtlog_search } from '../services/profile/xtlog_search.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_profileValidator } from '../validators/api_profileValidator';
import { validateBody } from '../middleware/zodValidator';




const router = Router();

router.post('/', validateBody(api_profileValidator), async (req, res) => {
  try {
  const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
 const username= req.body.login
 const domain=req.body.domain

//console.log("-----------------------------Données Reccus dans profile Route req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

    const result = await xtlog_search(_BasSecurityContext,username,domain);
    console.log("-----------------------------Données de profile Route renvoyer au CLIENT----------------------------------- =="+JSON.stringify( result))
    console.warn("----------------------------------------------------------------")

   // console.log("-----------------------------Données de profile Route renvoyer au CLIENT sans JSON.stringify----------------------------------- =="+result)

    res.json(result);
  } catch (error:any) {
    console.log("Erreur dans profile route =="+JSON.stringify(error))
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
