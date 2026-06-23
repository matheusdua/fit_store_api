import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';
import {
    criarUsuarioValidation,
    atualizarUsuarioValidation
} from '../validators/usuario.validator.js';
import { verificarToken, apenasCargos } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verificarToken);

router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);

router.post('/', apenasCargos(['gerente']), criarUsuarioValidation, UsuarioController.contratar);
router.patch('/:id', apenasCargos(['gerente']), atualizarUsuarioValidation, UsuarioController.atualizar);
router.delete('/:id', apenasCargos(['gerente']), UsuarioController.inativar);

export default router;