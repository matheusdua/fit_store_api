import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validators/auth.validator.js';
import { coletarCargoOpcional } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginValidation, AuthController.login);
router.post('/register', coletarCargoOpcional, registerValidation, AuthController.register);

export default router;