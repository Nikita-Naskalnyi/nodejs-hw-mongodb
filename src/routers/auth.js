import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';

import validateBody from '../middlewares/validateBody.js';
import resetEmailSchema from '../schemas/resetEmailSchema.js';
import resetPwdSchema from '../schemas/resetPwdSchema.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  sendResetEmail
);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);

export default router;
