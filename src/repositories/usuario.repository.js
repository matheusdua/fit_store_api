import Usuario from '../models/usuario.model.js';

const toJSON = (doc) => doc ? doc.toJSON() : null;

class UsuarioRepository {
    static async findAll() {
        const usuarios = await Usuario.find();
        return usuarios.map(toJSON);
    }

    static async findById(id) {
        const usuario = await Usuario.findById(id);
        return toJSON(usuario);
    }

    static async findByEmail(email) {
        const usuario = await Usuario.findOne({ email });
        return toJSON(usuario);
    }

    static async findByName(nome) {
        const regex = new RegExp(nome, 'i');
        const usuarios = await Usuario.find({ nome: regex });
        return usuarios.map(toJSON);
    }

    static async create(dados) {
        const novoUsuario = await Usuario.create(dados);
        return toJSON(novoUsuario);
    }

    static async replace(id, dados) {
        const result = await Usuario.findOneAndReplace(
            { _id: id },
            dados,
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async inactivate(id) {
        const result = await Usuario.findByIdAndUpdate(
            id,
            { ativo: false },
            { returnDocument: 'after' }
        );
        return result !== null;
    }

}

export default UsuarioRepository;

