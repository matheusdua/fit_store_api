import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';
import {
    criarUsuarioValidation,
    atualizarUsuarioValidation
} from '../validators/usuario.validator.js';
import { verificarToken, apenasCargos } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verificarToken);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todas as credenciais e contas registradas na FitStore
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsuarioResponse'
 *       403:
 *         description: Negado. Apenas Gerentes possuem permissao de auditoria completa da equipe
 */
router.get('/', UsuarioController.getAll);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   get:
 *     summary: Obtem as propriedades cadastrais de uma conta pelo username
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome de usuario unico da credencial
 *     responses:
 *       200:
 *         description: Dados do usuario recuperados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       404:
 *         description: Conta nao localizada na base de dados
 */
router.get('/:username', UsuarioController.getByUsername);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Registra/Contrata um novo colaborador operacional na organizacao
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Colaborador inserido com sucesso com o cargo corporativo definido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 */
router.post(
    '/',
    apenasCargos(['gerente']),
    criarUsuarioValidation,
    UsuarioController.contratar
);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   patch:
 *     summary: Altera de forma parcial dados de um colaborador existente
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Credenciales modificadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 */
router.patch(
    '/:username',
    apenasCargos(['gerente']),
    atualizarUsuarioValidation,
    UsuarioController.atualizar
);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   delete:
 *     summary: Inativa o acesso de um colaborador do time corporativo
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Credencial revogada com sucesso (Inativado logicamente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 */
router.delete(
    '/:username',
    apenasCargos(['gerente']),
    UsuarioController.inativar
);

export default router;