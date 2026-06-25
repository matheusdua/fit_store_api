import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/usuario.repository.js';

const { JWT_SECRET, SALT_ROUNDS } = process.env;

if (!JWT_SECRET || !SALT_ROUNDS) {
    throw new Error('ERRO FATAL: JWT_SECRET ou SALT_ROUNDS não foram definidos no .env');
}

const saltRoundsNumero = Number(SALT_ROUNDS);

class AuthService {
    static async login(loginInput, senha) {
        const user = await UsuarioRepository.findByLogin(loginInput);

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
            username: user.username,
            cargo: user.cargo
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        return {
            mensagem: 'Login realizado com sucesso',
            token: token,
            usuario: {
                username: user.username,
                nome: user.nome,
                cargo: user.cargo
            }
        };
    }

    static async register(dados, cargoSolicitante) {
        dados.email = dados.email.toLowerCase();
        dados.username = dados.username.toLowerCase();

        const emailExistente = await UsuarioRepository.findByEmail(dados.email);
        if (emailExistente) {
            const error = new Error('Este e-mail já está cadastrado no sistema.');
            error.statusCode = 409;
            throw error;
        }

        const usernameExistente = await UsuarioRepository.findByUsername(dados.username);
        if (usernameExistente) {
            const error = new Error('Este nome de usuário já está em uso.');
            error.statusCode = 409;
            throw error;
        }

        if (cargoSolicitante !== 'gerente') {
            dados.cargo = 'cliente';
        }

        const salt = await bcrypt.genSalt(saltRoundsNumero);
        dados.senha = await bcrypt.hash(dados.senha, salt);

        const novoUsuario = await UsuarioRepository.create(dados);

        return {
            mensagem: 'Cadastro realizado com sucesso',
            usuario: {
                username: novoUsuario.username,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                cargo: novoUsuario.cargo
            }
        };
    }
}

export default AuthService;