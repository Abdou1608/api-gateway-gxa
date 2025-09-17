import { Router } from 'express';
import { cont_newpiece } from '../services/ajout_piece_au_contrat/cont_newpiece.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { api_ajout_piece_au_contratValidator } from '../validators/api_ajout_piece_au_contratValidator';
import { validateBody } from '../middleware/zodValidator';



const router = Router();

router.post('/', validateBody(api_ajout_piece_au_contratValidator), async (req, res) => {
  try {
    const _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.body.BasSecurityContext?._SessionId
   const contrat=req.body.contrat
   const produit= req.body.produit 
   const effet=req.body.effet 
   const data= req.body.data
    const result = await cont_newpiece(contrat,produit,effet,data,_BasSecurityContext);
    res.json(result);
  } catch (error:any) {
    res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error)
     });
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
