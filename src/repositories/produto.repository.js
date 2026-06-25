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

    static async findByReferencia(referencia) {
        const produto = await Produto.findOne({ referencia: referencia.toUpperCase() });
        return toJSON(produto);
    }

    static async replaceByReferencia(referencia, produtoData) {
        const result = await Produto.findOneAndReplace(
            { referencia: referencia.toUpperCase() },
            produtoData,
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async partialUpdateByReferencia(referencia, produtoData) {
        const result = await Produto.findOneAndUpdate(
            { referencia: referencia.toUpperCase() },
            { $set: produtoData },
            { returnDocument: 'after' }
        );
        return toJSON(result);
    }

    static async deleteByReferencia(referencia) {
        const result = await Produto.findOneAndDelete({ referencia: referencia.toUpperCase() });
        return result !== null;
    }

}

export default ProdutoRepository;