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

    static async getById(id) {
        const usuario = await UsuarioRepository.findById(id);

        if (!usuario) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return new UsuarioResponseDTO(usuario);
    }

    static async contratar(dados) {
        delete dados.id;

        if (dados.email) {
            dados.email = dados.email.toLowerCase();
            const emailExistente = await UsuarioRepository.findByEmail(dados.email);

            if (emailExistente) {
                const error = new Error('Este e-mail já está cadastrado no sistema.');
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

    static async atualizar(id, dados, idSolicitante) {
        const usuarioAlvo = await UsuarioRepository.findById(id);

        if (!usuarioAlvo) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        if (dados.cargo && id === idSolicitante) {
            const error = new Error('Não é permitido alterar o próprio cargo.');
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

        const atualizado = await UsuarioRepository.replace(id, dados);
        return new UsuarioResponseDTO(atualizado);
    }

    static async inativar(id, idSolicitante) {
        const sucesso = await UsuarioRepository.inactivate(id);

        if (!sucesso) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return { mensagem: 'Funcionário inativado com sucesso.' };
    }
}

export default UsuarioService;
