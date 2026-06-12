import { body, param } from 'express-validator';
import { verificarErros } from '../middlewares/validation.middleware.js';

export const regrasValidacaoProduto = [
    body('id')
        .not().exists().withMessage('O ID é gerado automaticamente e não deve ser enviado no corpo da requisição.'),

    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('referencia')
        .trim()
        .notEmpty().withMessage('A referência é obrigatória.')
        .toUpperCase(),

    body('preco')
        .notEmpty().withMessage('O preço é obrigatório.')
        .isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo.'),

    body('estoque')
        .notEmpty().withMessage('O estoque é obrigatório.')
        .isInt({ min: 0 }).withMessage('O estoque deve ser um número inteiro (positivo ou zero).'),

    body('ativo')
        .optional()
        .isBoolean().withMessage('O status ativo deve ser um valor booleano (true ou false).'),

    verificarErros
];

export const regrasValidacaoID = [
    param('id')
        .isMongoId().withMessage('O ID da URL não é um formato válido do MongoDB.'),
    verificarErros
];


export const regrasValidacaoQuantidade = [
    body('quantidade')
        .notEmpty().withMessage('A quantidade é obrigatória.')
        .isInt({ min: 1 }).withMessage('A quantidade deve ser um número inteiro maior que zero.'),

    verificarErros
];