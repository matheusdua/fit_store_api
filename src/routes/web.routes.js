import { Router } from 'express';
import WebController from '../controllers/web.controller.js';
import { verificarToken, apenasCargos, coletarCargoOpcional } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/vitrine', coletarCargoOpcional, WebController.listarCatalogo);
router.get('/vitrine/:referencia', coletarCargoOpcional, WebController.listarProdutoUnico);

router.get('/login', WebController.exibirLogin);
router.post('/login', WebController.processarLogin);

router.get('/register', WebController.exibirRegister);
router.post('/register', WebController.processarRegister);

router.get('/produtos/novo', verificarToken, apenasCargos(['gerente', 'vendedor']), WebController.exibirCadastroProduto);
router.post('/produtos/novo', verificarToken, apenasCargos(['gerente', 'vendedor']), WebController.processarCadastroProduto);

router.post('/produtos/:referencia/comprar', verificarToken, WebController.processarCompraWeb);
router.post('/produtos/:referencia/repor', verificarToken, apenasCargos(['gerente']), WebController.processarReporWeb);
router.post('/produtos/:referencia/inativar', verificarToken, apenasCargos(['gerente']), WebController.processarInativarWeb);

router.get('/equipe', verificarToken, apenasCargos(['gerente']), WebController.listarEquipe);

export default router;