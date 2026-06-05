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

router.post('/', apenasCargos(['Gerente']), criarFuncionarioValidation, FuncionarioController.contratar);
router.patch('/:id', apenasCargos(['Gerente']), atualizarFuncionarioValidation, FuncionarioController.atualizar);
router.delete('/:id', apenasCargos(['Gerente']), FuncionarioController.inativar);

export default router;