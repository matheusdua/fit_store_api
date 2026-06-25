import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/usuario.repository.js';
import { UsuarioResponseDTO } from '../dtos/usuario.dto.js';

const { SALT_ROUNDS } = process.env;

if (!SALT_ROUNDS) {
    throw new Error('ERRO FATAL: SALT_ROUNDS não foi definido no .env');
}

const saltRoundsNumero = Number(SALT_ROUNDS);

class UsuarioService {
    static async getAll() {
        const usuarios = await UsuarioRepository.findAll();
        return usuarios.map(f => new UsuarioResponseDTO(f));
    }

    static async getByUsername(username) {
        const usuario = await UsuarioRepository.findByUsername(username);

        if (!usuario) {
            const error = new Error('Usuário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return new UsuarioResponseDTO(usuario);
    }

    static async contratar(dados, cargoSolicitante) {
        delete dados.id;

        if (cargoSolicitante !== 'gerente') {
            dados.cargo = 'cliente';
        }

        if (dados.email) {
            dados.email = dados.email.toLowerCase();
            const emailExistente = await UsuarioRepository.findByEmail(dados.email);
            if (emailExistente) {
                const error = new Error('Este e-mail já está cadastrado no sistema.');
                error.statusCode = 409;
                throw error;
            }
        }

        if (dados.username) {
            dados.username = dados.username.toLowerCase();
            const usernameExistente = await UsuarioRepository.findByUsername(dados.username);
            if (usernameExistente) {
                const error = new Error('Este nome de usuário já está em uso.');
                error.statusCode = 409;
                throw error;
            }
        }

        if (dados.senha) {
            const salt = await bcrypt.genSalt(saltRoundsNumero);
            dados.senha = await bcrypt.hash(dados.senha, salt);
        }

        const novoUsuario = await UsuarioRepository.create(dados);
        return new UsuarioResponseDTO(novoUsuario);
    }

    static async atualizar(username, dados, usernameSolicitante, cargoSolicitante) {
        const usuarioAlvo = await UsuarioRepository.findByUsername(username);

        if (!usuarioAlvo) {
            const error = new Error('Usuário não encontrado.');
            error.statusCode = 404;
            throw error;
        }


        if (dados.username) {
            dados.username = dados.username.toLowerCase();
            const usernameExistente = await UsuarioRepository.findByUsername(dados.username);

            if (usernameExistente && usernameExistente.username !== usuarioAlvo.username) {
                const error = new Error('Este nome de usuário já está em uso.');
                error.statusCode = 409;
                throw error;
            }
        }

        if (dados.cargo && usuarioAlvo.username === usernameSolicitante) {
            const error = new Error('Não é permitido alterar o próprio cargo.');
            error.statusCode = 403;
            throw error;
        }

        if (dados.cargo && cargoSolicitante !== 'gerente') {
            const error = new Error('Apenas gerentes podem alterar cargos de usuários.');
            error.statusCode = 403;
            throw error;
        }

        if (dados.senha && dados.senha.trim() !== '') {
            const salt = await bcrypt.genSalt(saltRoundsNumero);
            dados.senha = await bcrypt.hash(dados.senha, salt);
        } else {
            delete dados.senha;
        }

        delete dados.id;

        const atualizado = await UsuarioRepository.replace(usuarioAlvo.id, dados);
        return new UsuarioResponseDTO(atualizado);
    }

    static async inativar(username) {
        const usuarioAlvo = await UsuarioRepository.findByUsername(username);

        if (!usuarioAlvo) {
            const error = new Error('Usuário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        await UsuarioRepository.inactivate(usuarioAlvo.id);
        return { mensagem: 'Usuário inativado com sucesso.' };
    }
}

export default UsuarioService;
