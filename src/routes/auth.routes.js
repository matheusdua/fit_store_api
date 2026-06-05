import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { loginValidation } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', loginValidation, AuthController.login);

export default router;