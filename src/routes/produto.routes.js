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

router.post('/produtos', apenasCargos(['Gerente', 'Vendedor']), regrasValidacaoProduto, ProdutoController.create);
router.put('/produtos/:id', apenasCargos(['Gerente', 'Vendedor']), regrasValidacaoID, regrasValidacaoProduto, ProdutoController.update);
router.patch('/produtos/:id/vender', apenasCargos(['Gerente', 'Vendedor']), regrasValidacaoID, regrasValidacaoQuantidade, ProdutoController.vender);

router.patch('/produtos/:id/repor', apenasCargos(['Gerente']), regrasValidacaoID, regrasValidacaoQuantidade, ProdutoController.repor);
router.patch('/produtos/:id/inativar', apenasCargos(['Gerente']), regrasValidacaoID, ProdutoController.inativar);
router.delete('/produtos/:id', apenasCargos(['Gerente']), regrasValidacaoID, ProdutoController.delete);

export default router;