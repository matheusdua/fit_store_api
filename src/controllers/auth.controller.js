import AuthService from '../services/auth.service.js';

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const resultado = await AuthService.login(email, senha);

            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    
    static async register(req, res, next) {
        try {
            const dados = req.body;
            const resultado = await AuthService.register(dados);
            res.status(201).json(resultado);
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;