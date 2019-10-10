import { Router } from 'express';
import responseCode from '../config/response-code-config';
const router = Router();

router.post('/test', async (req, res) => {
  try {
    res.json({ code: responseCode.SUCCESS.ID, msg: responseCode.SUCCESS.MESSAGE });
  } catch (e) {
    res.json({ code: responseCode.UNKOWN_ERROR.ID, msg: e.message });
  }
});

export default router;
