import ProdutoService from '../services/produto.service.js';

class ProdutoController {
    static async getAll(req, res, next) {
        try {
            const busca = req.query.busca || '';
            const cargoSolicitante = req.cargoAutenticado;

            const produtos = await ProdutoService.getAll(busca, cargoSolicitante);
            res.status(200).json(produtos);
        } catch (error) {
            next(error);
        }
    }

    static async getByReferencia(req, res, next) {
        try {
            const { referencia } = req.params;
            const produto = await ProdutoService.getByReferencia(referencia);
            res.status(200).json(produto);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const dados = req.body;
            const usernameSolicitante = req.usernameAutenticado;

            const novoProduto = await ProdutoService.create(dados, usernameSolicitante);
            res.status(201).json(novoProduto);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { referencia } = req.params;
            const dados = req.body;
            const produtoAtualizado = await ProdutoService.updateByReferencia(referencia, dados);

            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async vender(req, res, next) {
        try {
            const { referencia } = req.params;
            const { quantidade } = req.body;

            const produtoAtualizado = await ProdutoService.venderProdutoByReferencia(referencia, quantidade);
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async repor(req, res, next) {
        try {
            const { referencia } = req.params;
            const { quantidade } = req.body;

            const produtoAtualizado = await ProdutoService.reporEstoqueByReferencia(referencia, quantidade);
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async inativar(req, res, next) {
        try {
            const { referencia } = req.params;
            const produtoInativado = await ProdutoService.inativarProdutoByReferencia(referencia);

            res.status(200).json(produtoInativado);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { referencia } = req.params;
            await ProdutoService.deleteByReferencia(referencia);

            res.status(200).json({ mensagem: 'Produto excluído fisicamente com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

export default ProdutoController;