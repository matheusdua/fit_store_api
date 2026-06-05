import { body } from 'express-validator';
import { verificarErros } from '../middlewares/validation.middleware.js';

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Formato de e-mail inválido.'),

    body('senha')
        .trim()
        .notEmpty().withMessage('A senha é obrigatória.'),

    verificarErros
];