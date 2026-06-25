import AuthService from '../services/auth.service.js';

class AuthController {
    static async login(req, res, next) {
        try {
            const { loginInput, email, username, senha } = req.body;
            const input = loginInput || email || username;

            const resultado = await AuthService.login(input, senha);
            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }


    static async register(req, res, next) {
        try {
            const dados = req.body;
            const cargoSolicitante = req.cargoAutenticado;

            const resultado = await AuthService.register(dados, cargoSolicitante);
            res.status(201).json(resultado);
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;