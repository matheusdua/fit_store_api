import { body } from 'express-validator';
import { verificarErros } from '../middlewares/validation.middleware.js';

export const loginValidation = [
    body('loginInput')
        .trim()
        .notEmpty().withMessage('O e-mail ou nome de usuário é obrigatório.'),

    body('senha')
        .notEmpty().withMessage('A senha é obrigatória.'),

    verificarErros
];

export const registerValidation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('username')
        .trim()
        .notEmpty().withMessage('O nome de usuário (username) é obrigatório.')
        .toLowerCase()
        .matches(/^[a-z0-9_]+$/).withMessage('O username deve conter apenas letras minúsculas, números e underline (_).'),

    body('email')
        .trim()
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Formato de e-mail inválido.'),

    body('senha')
        .notEmpty().withMessage('A senha é obrigatória.')
        .isLength({ min: 3 }).withMessage('A senha deve ter no mínimo 3 caracteres.'),

    verificarErros
];