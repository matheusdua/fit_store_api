import FuncionarioService from '../services/funcionario.service.js';

class FuncionarioController {
    static async getAll(req, res, next) {
        try {
            const funcionarios = await FuncionarioService.getAll();
            res.status(200).json(funcionarios);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const funcionario = await FuncionarioService.getById(id);
            res.status(200).json(funcionario);
        } catch (error) {
            next(error);
        }
    }

    static async contratar(req, res, next) {
        try {
            const dados = req.body;
            const novoFuncionario = await FuncionarioService.contratar(dados);
            res.status(201).json(novoFuncionario);
        } catch (error) {
            next(error);
        }
    }

    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const idSolicitante = req.usuarioAutenticado;

            const funcionarioAtualizado = await FuncionarioService.atualizar(id, dados, idSolicitante);
            res.status(200).json(funcionarioAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async inativar(req, res, next) {
        try {
            const { id } = req.params;

            const resultado = await FuncionarioService.inativar(id);
            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}

export default FuncionarioController;

