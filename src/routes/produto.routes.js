import { Router } from 'express';
import ProdutoController from '../controllers/produto.controller.js';
import {
    regrasValidacaoProduto,
    regrasValidacaoReferencia,
    regrasValidacaoQuantidade
} from '../validators/produto.validator.js';
import { verificarToken, apenasCargos, coletarCargoOpcional } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/produtos', coletarCargoOpcional, ProdutoController.getAll);
router.get('/produtos/:referencia', regrasValidacaoReferencia, ProdutoController.getByReferencia);

router.use('/produtos', verificarToken);

router.post('/produtos', apenasCargos(['gerente', 'vendedor']), regrasValidacaoProduto, ProdutoController.create);
router.put('/produtos/:referencia', apenasCargos(['gerente', 'vendedor']), regrasValidacaoReferencia, regrasValidacaoProduto, ProdutoController.update);
router.patch('/produtos/:referencia/vender', apenasCargos(['gerente', 'vendedor']), regrasValidacaoReferencia, regrasValidacaoQuantidade, ProdutoController.vender);

router.patch('/produtos/:referencia/repor', apenasCargos(['gerente']), regrasValidacaoReferencia, regrasValidacaoQuantidade, ProdutoController.repor);
router.patch('/produtos/:referencia/inativar', apenasCargos(['gerente']), regrasValidacaoReferencia, ProdutoController.inativar);
router.delete('/produtos/:referencia', apenasCargos(['gerente']), regrasValidacaoReferencia, ProdutoController.delete);
export default router;