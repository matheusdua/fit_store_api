import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import FuncionarioRepository from '../repositories/funcionario.repository.js';

const { JWT_SECRET, SALT_ROUNDS } = process.env;

if (!JWT_SECRET || !SALT_ROUNDS) {
    throw new Error('ERRO FATAL: JWT_SECRET ou SALT_ROUNDS não foram definidos no .env');
}

const saltRoundsNumero = Number(SALT_ROUNDS);

class AuthService {
    static async login(email, senha) {
        const user = await FuncionarioRepository.findByEmail(email);

        if (!user || !user.ativo) {
            const error = new Error('Credenciais inválidas ou usuário inativo.');
            error.statusCode = 401;
            throw error;
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
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

    static async register(dados) {
        dados.email = dados.email.toLowerCase();
        const emailExistente = await FuncionarioRepository.findByEmail(dados.email);
        if (emailExistente) {
            const error = new Error('Este e-mail já está cadastrado no sistema.');
            error.statusCode = 409;
            throw error;
        }

        dados.cargo = 'cliente';

        const salt = await bcrypt.genSalt(saltRoundsNumero);
        dados.senha = await bcrypt.hash(dados.senha, salt);

        const novoCliente = await FuncionarioRepository.create(dados);

        return {
            mensagem: 'Cadastro realizado com sucesso',
            cliente: {
                id: novoCliente.id,
                nome: novoCliente.nome,
                email: novoCliente.email,
                cargo: novoCliente.cargo
            }
        };
    }
}

export default AuthService;