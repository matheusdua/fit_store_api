import bcrypt from 'bcrypt';
import FuncionarioRepository from '../repositories/funcionario.repository.js';
import { FuncionarioResponseDTO } from '../dtos/funcionario.dto.js';

const { SALT_ROUNDS } = process.env;

if (!SALT_ROUNDS) {
    throw new Error('ERRO FATAL: SALT_ROUNDS não foi definido no .env');
}

const saltRoundsNumero = Number(SALT_ROUNDS);

class FuncionarioService {
    static async getAll() {
        const funcionarios = await FuncionarioRepository.findAll();
        return funcionarios.map(f => new FuncionarioResponseDTO(f));
    }

    static async getById(id) {
        const funcionario = await FuncionarioRepository.findById(id);

        if (!funcionario) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return new FuncionarioResponseDTO(funcionario);
    }

    static async contratar(dados) {
        delete dados.id;

        if (dados.email) {
            dados.email = dados.email.toLowerCase();
            const emailExistente = await FuncionarioRepository.findByEmail(dados.email);

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

        const novoFuncionario = await FuncionarioRepository.create(dados);
        return new FuncionarioResponseDTO(novoFuncionario);
    }

    static async atualizar(id, dados, idSolicitante) {
        const funcionarioAlvo = await FuncionarioRepository.findById(id);

        if (!funcionarioAlvo) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        if (dados.cargo && Number(id) === Number(idSolicitante)) {
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

        const atualizado = await FuncionarioRepository.update(id, dados);
        return new FuncionarioResponseDTO(atualizado);
    }

    static async inativar(id, idSolicitante) {
        const sucesso = await FuncionarioRepository.inactivate(id);

        if (!sucesso) {
            const error = new Error('Funcionário não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return { mensagem: 'Funcionário inativado com sucesso.' };
    }
}

export default FuncionarioService;
