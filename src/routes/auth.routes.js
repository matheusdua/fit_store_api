import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validators/auth.validator.js';
import { coletarCargoOpcional } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza a autenticacao de um usuario
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Autenticacao bem-sucedida. Retorna o Token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         description: Credenciais invalidas ou conta de usuario inativa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.post('/login', loginValidation, AuthController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastro publico de novos clientes para o e-commerce
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso (Forcada nativamente como cargo cliente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Dados inconsistentes enviados no corpo da requisicao
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroExpressValidator'
 *       409:
 *         description: Conflito. Username ou Email ja pertencem a outra conta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.post(
    '/register',
    coletarCargoOpcional,
    registerValidation,
    AuthController.register
);

export default router;