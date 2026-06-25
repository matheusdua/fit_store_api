import UsuarioService from '../services/usuario.service.js';

class UsuarioController {
    static async getAll(req, res, next) {
        try {
            if (req.cargoAutenticado !== 'gerente') {
                const error = new Error('Acesso negado. Apenas gerentes podem listar a equipe.');
                error.statusCode = 403;
                throw error;
            }
            const usuarios = await UsuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        }
    }

    static async getByUsername(req, res, next) {
        try {
            const { username } = req.params;
            const usuario = await UsuarioService.getByUsername(username);
            res.status(200).json(usuario);
        } catch (error) {
            next(error);
        }
    }

    static async contratar(req, res, next) {
        try {
            const dados = req.body;
            const cargoSolicitante = req.cargoAutenticado;

            const novoUsuario = await UsuarioService.contratar(dados, cargoSolicitante);
            res.status(201).json(novoUsuario);
        } catch (error) {
            next(error);
        }
    }

    static async atualizar(req, res, next) {
        try {
            const { username } = req.params;
            const dados = req.body;
            const usernameSolicitante = req.usernameAutenticado;
            const cargoSolicitante = req.cargoAutenticado;

            const usuarioAtualizado = await UsuarioService.atualizar(username, dados, usernameSolicitante, cargoSolicitante);
            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async inativar(req, res, next) {
        try {
            const { username } = req.params;
            const resultado = await UsuarioService.inativar(username);
            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;

