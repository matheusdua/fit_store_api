import { Router } from 'express';
import FuncionarioController from '../controllers/funcionario.controller.js';
import {
    criarFuncionarioValidation,
    atualizarFuncionarioValidation
} from '../validators/funcionario.validator.js';
import { verificarToken, apenasCargos } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verificarToken);

router.get('/', FuncionarioController.getAll);
router.get('/:id', FuncionarioController.getById);

router.post('/', apenasCargos(['gerente']), criarFuncionarioValidation, FuncionarioController.contratar);
router.patch('/:id', apenasCargos(['gerente']), atualizarFuncionarioValidation, FuncionarioController.atualizar);
router.delete('/:id', apenasCargos(['gerente']), FuncionarioController.inativar);

export default router;