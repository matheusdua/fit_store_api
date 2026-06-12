import db from '../config/database.js';
import { ObjectId } from 'mongodb';

const mapId = (doc) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
};

class FuncionarioRepository {
    static getCollection() {
        return db.getDb().collection('funcionarios');
    }

    static async findAll() {
        const funcionarios = await this.getCollection().find({}).toArray();
        return funcionarios.map(mapId);
    }

    static async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        const funcionario = await this.getCollection().findOne({ _id: new ObjectId(id) });
        return mapId(funcionario);
    }

    static async findByEmail(email) {
        const funcionario = await this.getCollection().findOne({ email });
        return mapId(funcionario);
    }

    static async findByName(nome) {
        const regex = new RegExp(nome, 'i');
        const funcionarios = await this.getCollection().find({ nome: regex }).toArray();
        return funcionarios.map(mapId);
    }

    static async create(dados) {
        const novoFuncionario = { ...dados, ativo: true };
        const result = await this.getCollection().insertOne(novoFuncionario);

        return mapId({ _id: result.insertedId, ...novoFuncionario });
    }

    static async replace(id, dados) {
        if (!ObjectId.isValid(id)) return null;

        const result = await this.getCollection().findOneAndReplace(
            { _id: new ObjectId(id) },
            dados,
            { returnDocument: 'after' }
        );

        return mapId(result);
    }

    static async inactivate(id) {
        if (!ObjectId.isValid(id)) return false;

        const result = await this.getCollection().updateOne(
            { _id: new ObjectId(id) },
            { $set: { ativo: false } }
        );

        return result.modifiedCount > 0;
    }

}

export default FuncionarioRepository;

