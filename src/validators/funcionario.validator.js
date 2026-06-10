import { body } from 'express-validator';
import { verificarErros } from '../middlewares/validation.middleware.js';

const cargosPermitidos = ['gerente', 'vendedor', 'estagiario', 'cliente'];

export const criarFuncionarioValidation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
        .trim()
        .notEmpty().withMessage('O e-mail é obrigatório.')
        .isEmail().withMessage('Formato de e-mail inválido.'),

    body('senha')
        .notEmpty().withMessage('A senha é obrigatória para o cadastro.')
        .isLength({ min: 3 }).withMessage('A senha deve ter no mínimo 3 caracteres.'),

    body('cargo')
        .trim()
        .notEmpty().withMessage('O cargo é obrigatório.')
        .isIn(cargosPermitidos).withMessage(`Cargo inválido. Escolha entre: ${cargosPermitidos.join(', ')}`),

    verificarErros
];

export const atualizarFuncionarioValidation = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Formato de e-mail inválido.'),

    body('cargo')
        .optional()
        .trim()
        .notEmpty().withMessage('O cargo não pode ser vazio.')
        .isIn(cargosPermitidos).withMessage(`Cargo inválido. Escolha entre: ${cargosPermitidos.join(', ')}`),

    body('senha')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('A nova senha deve ter no mínimo 3 caracteres.'),


    verificarErros
];