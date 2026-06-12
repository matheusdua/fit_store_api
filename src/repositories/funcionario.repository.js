import Funcionario from '../models/funcionario.model.js';

const toJSON = (doc) => doc ? doc.toJSON() : null;

class FuncionarioRepository {
    static async findAll() {
        const funcionarios = await Funcionario.find();
        return funcionarios.map(toJSON);
    }

    static async findById(id) {
        const funcionario = await Funcionario.findById(id);
        return toJSON(funcionario);
    }

    static async findByEmail(email) {
        const funcionario = await Funcionario.findOne({ email });
        return toJSON(funcionario);
    }

    static async findByName(nome) {
        const regex = new RegExp(nome, 'i');
        const funcionarios = await Funcionario.find({ nome: regex });
        return funcionarios.map(toJSON);
    }

    static async create(dados) {
        const novoFuncionario = await Funcionario.create(dados);
        return toJSON(novoFuncionario);
    }

    static async replace(id, dados) {
        const result = await Funcionario.findOneAndReplace(
            { _id: id },
            dados,
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async inactivate(id) {
        const result = await Funcionario.findByIdAndUpdate(
            id,
            { ativo: false },
            { returnDocument: 'after' }
        );
        return result !== null;
    }

}

export default FuncionarioRepository;

