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

export const registerValidation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
        .trim()
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Formato de e-mail inválido.'),

    body('senha')
        .trim()
        .notEmpty().withMessage('A senha é obrigatória.')
        .isLength({ min: 3 }).withMessage('A senha deve ter no mínimo 3 caracteres.'),

    verificarErros
];