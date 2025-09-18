import { Router } from 'express';
import { xtlog_search } from '../services/profile/xtlog_search.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_profileValidator } from '../validators/api_profileValidator';
import { validateBody } from '../middleware/zodValidator';
import { isTokenRevoked, invalidateToken } from '../auth/token-revocation.service';
import { closesession_ } from '../services/logout/closesession_.service';




const router = Router();

router.post('/', validateBody(api_profileValidator), async (req, res) => {
  try {
  // ----- Revocation pre-check (line ~15 after imports) -----
  const authHeader = req.header('authorization');
  const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (await isTokenRevoked(bearer)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const _BasSecurityContext= new BasSecurityContext()
  _BasSecurityContext.IsAuthenticated=true
  _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
 const username= req.body.login
 const domain=req.body.domain

//console.log("-----------------------------Données Reccus dans profile Route req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
 

  const result = await xtlog_search(_BasSecurityContext,username,domain);
  const asAny: any = result as any;
  const empty = asAny == null || asAny === '' || (typeof asAny === 'object' && Object.keys(asAny).length === 0);
    if (empty) {
      await invalidateToken(bearer);
      if (_BasSecurityContext.SessionId) {
        try { await closesession_(_BasSecurityContext.SessionId); } catch {/* ignore */}
      }
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log("-----------------------------Données de profile Route renvoyer au CLIENT----------------------------------- =="+JSON.stringify( result))
    console.warn("----------------------------------------------------------------")

   // console.log("-----------------------------Données de profile Route renvoyer au CLIENT sans JSON.stringify----------------------------------- =="+result)

    res.json(result);
  } catch (error:any) {
    console.log("Erreur dans profile route =="+JSON.stringify(error))
    // On révoque et logout si erreur
    const authHeader = req.header('authorization');
    const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (bearer) {
      await invalidateToken(bearer);
    }
    if (req.auth?.sid) {
      try { await closesession_(req.auth.sid); } catch {/* ignore */}
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
