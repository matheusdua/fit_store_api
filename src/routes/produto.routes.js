import { Router } from 'express';
import ProdutoController from '../controllers/produto.controller.js';
import {
    regrasValidacaoProduto,
    regrasValidacaoID,
    regrasValidacaoQuantidade
} from '../validators/produto.validator.js';
import { verificarToken, apenasCargos } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/produtos', ProdutoController.getAll);
router.get('/produtos/:id', regrasValidacaoID, ProdutoController.getById);

router.use('/produtos', verificarToken);

router.post('/produtos', apenasCargos(['gerente', 'vendedor']), regrasValidacaoProduto, ProdutoController.create);
router.put('/produtos/:id', apenasCargos(['gerente', 'vendedor']), regrasValidacaoID, regrasValidacaoProduto, ProdutoController.update);
router.patch('/produtos/:id/vender', apenasCargos(['gerente', 'vendedor']), regrasValidacaoID, regrasValidacaoQuantidade, ProdutoController.vender);

router.patch('/produtos/:id/repor', apenasCargos(['gerente']), regrasValidacaoID, regrasValidacaoQuantidade, ProdutoController.repor);
router.patch('/produtos/:id/inativar', apenasCargos(['gerente']), regrasValidacaoID, ProdutoController.inativar);
router.delete('/produtos/:id', apenasCargos(['gerente']), regrasValidacaoID, ProdutoController.delete);

export default router;