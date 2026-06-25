import { Router } from 'express';
import ProdutoController from '../controllers/produto.controller.js';
import {
    regrasValidacaoProduto,
    regrasValidacaoReferencia,
    regrasValidacaoQuantidade
} from '../validators/produto.validator.js';
import {
    verificarToken,
    apenasCargos,
    coletarCargoOpcional
} from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista as pecas do catalogo da loja
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Filtro textual opcional por nome ou referencia do produto
 *     responses:
 *       200:
 *         description: Vetor de produtos cadastrados (Filtrado automaticamente se nao for Gerente)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProdutoResponse'
 */
router.get('/produtos', coletarCargoOpcional, ProdutoController.getAll);

/**
 * @swagger
 * /api/produtos/{referencia}:
 *   get:
 *     summary: Localiza as propriedades de uma peca pela referencia
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *         description: Codigo identificador unico da peca
 *     responses:
 *       200:
 *         description: Produto localizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       404:
 *         description: Nao existe produto com a referencia informada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.get('/produtos/:referencia', regrasValidacaoReferencia, ProdutoController.getByReferencia);

router.use('/produtos', verificarToken);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cadastra um novo produto no banco de dados
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       403:
 *         description: Permissao negada. Apenas Gerentes e Vendedores podem executar
 *       409:
 *         description: Ja existe um produto utilizando esta Referencia ou Nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.post(
    '/produtos',
    apenasCargos(['gerente', 'vendedor']),
    regrasValidacaoProduto,
    ProdutoController.create
);

/**
 * @swagger
 * /api/produtos/{referencia}:
 *   put:
 *     summary: Modifica integralmente um produto existente
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Alteracoes aplicadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       404:
 *         description: Produto nao localizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.put(
    '/produtos/:referencia',
    apenasCargos(['gerente', 'vendedor']),
    regrasValidacaoReferencia,
    regrasValidacaoProduto,
    ProdutoController.update
);

/**
 * @swagger
 * /api/produtos/{referencia}/vender:
 *   patch:
 *     summary: Reduz unidades do estoque fisico por acao de venda
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuantidadeInput'
 *     responses:
 *       200:
 *         description: Baixa efetuada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 *       400:
 *         description: Requisicao invalida. Estoque insuficiente ou item fora de linha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroFiltroGlobal'
 */
router.patch(
    '/produtos/:referencia/vender',
    apenasCargos(['gerente', 'vendedor']),
    regrasValidacaoReferencia,
    regrasValidacaoQuantidade,
    ProdutoController.vender
);

/**
 * @swagger
 * /api/produtos/{referencia}/repor:
 *   patch:
 *     summary: Adiciona unidades ao estoque de uma peca
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuantidadeInput'
 *     responses:
 *       200:
 *         description: Entrada de estoque processada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 */
router.patch(
    '/produtos/:referencia/repor',
    apenasCargos(['gerente']),
    regrasValidacaoReferencia,
    regrasValidacaoQuantidade,
    ProdutoController.repor
);

/**
 * @swagger
 * /api/produtos/{referencia}/inativar:
 *   patch:
 *     summary: Altera o estado do produto para inativo (Fora de linha)
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto desativado com sucesso no ecossistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoResponse'
 */
router.patch(
    '/produtos/:referencia/inativar',
    apenasCargos(['gerente']),
    regrasValidacaoReferencia,
    ProdutoController.inativar
);

/**
 * @swagger
 * /api/produtos/{referencia}:
 *   delete:
 *     summary: Remove de forma fisica e definitiva um produto da base
 *     tags: [Produtos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referencia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro deletado permanentemente do banco de dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 */
router.delete(
    '/produtos/:referencia',
    apenasCargos(['gerente']),
    regrasValidacaoReferencia,
    ProdutoController.delete
);

export default router;