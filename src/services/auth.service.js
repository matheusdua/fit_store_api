import jwt from 'jsonwebtoken';
import FuncionarioRepository from '../repositories/funcionario.repository.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('ERRO FATAL: JWT_SECRET não está definido nas variáveis de ambiente.');
}

class AuthService {
    static async login(email, senha) {
        const funcionarios = await FuncionarioRepository.findAll();
        const user = funcionarios.find(f => f.email === email);

        if (!user || !user.ativo) {
            const error = new Error('Credenciais inválidas ou usuário inativo.');
            error.statusCode = 401;
            throw error;
        }

        if (user.senha !== senha) {
            const error = new Error('Credenciais inválidas.');
            error.statusCode = 401;
            throw error;
        }

        const payload = {
            id: user.id,
            cargo: user.cargo
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        return {
            mensagem: 'Login realizado com sucesso',
            token: token,
            funcionario: {
                id: user.id,
                nome: user.nome,
                cargo: user.cargo
            }
        };
    }
}

export default AuthService;