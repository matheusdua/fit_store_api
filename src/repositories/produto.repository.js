import Produto from '../models/produto.model.js';

const toJSON = (doc) => doc ? doc.toJSON() : null;

class ProdutoRepository {
    static async findAll() {
        const produtos = await Produto.find();
        return produtos.map(toJSON);
    }

    static async findById(id) {
        const produto = await Produto.findById(id);
        return toJSON(produto);
    }

    static async create(produtoData) {
        const novoProduto = await Produto.create(produtoData);
        return toJSON(novoProduto);
    }

    static async replace(id, produtoData) {
        const result = await Produto.findOneAndReplace(
            { _id: id },
            produtoData,
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async partialUpdate(id, produtoData) {
        const result = await Produto.findByIdAndUpdate(
            id,
            { $set: produtoData },
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async delete(id) {
        const result = await Produto.findByIdAndDelete(id);
        return result !== null;
    }
}

export default ProdutoRepository;