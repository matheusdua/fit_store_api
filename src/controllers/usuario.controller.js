import UsuarioService from '../services/usuario.service.js';

class UsuarioController {
    static async getAll(req, res, next) {
        try {
            const usuarios = await UsuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioService.getById(id);
            res.status(200).json(usuario);
        } catch (error) {
            next(error);
        }
    }

    static async contratar(req, res, next) {
        try {
            const dados = req.body;
            const novoUsuario = await UsuarioService.contratar(dados);
            res.status(201).json(novoUsuario);
        } catch (error) {
            next(error);
        }
    }

    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const idSolicitante = req.usuarioAutenticado;

            const usuarioAtualizado = await UsuarioService.atualizar(id, dados, idSolicitante);
            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async inativar(req, res, next) {
        try {
            const { id } = req.params;

            const resultado = await UsuarioService.inativar(id);
            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;

