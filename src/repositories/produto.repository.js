import db from '../config/database.js';
import { ObjectId } from 'mongodb';

const mapId = (doc) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
};

class ProdutoRepository {
    static getCollection() {
        return db.getDb().collection('produtos');
    }

    static async findAll() {
        const produtos = await this.getCollection().find({}).toArray();
        return produtos.map(mapId);
    }

    static async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        const produto = await this.getCollection().findOne({ _id: new ObjectId(id) });
        return mapId(produto);
    }

    static async create(produtoData) {
        const novoProduto = { ativo: true, ...produtoData };
        const result = await this.getCollection().insertOne(novoProduto);
        return mapId({ _id: result.insertedId, ...novoProduto });
    }

    static async replace(id, produtoData) {
        if (!ObjectId.isValid(id)) return null;

        const result = await this.getCollection().findOneAndReplace(
            { _id: new ObjectId(id) },
            produtoData,
            { returnDocument: 'after' }
        );

        return mapId(result);
    }

    static async partialUpdate(id, produtoData) {
        if (!ObjectId.isValid(id)) return null;

        const result = await this.getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: produtoData },
            { returnDocument: 'after' }
        );

        return mapId(result);
    }

    static async delete(id) {
        if (!ObjectId.isValid(id)) return false;

        const result = await this.getCollection().deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

export default ProdutoRepository;