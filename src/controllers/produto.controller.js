import ProdutoService from '../services/produto.service.js';

class ProdutoController {
    static async getAll(req, res, next) {
        try {
            const busca = req.query.busca || '';
            const produtos = await ProdutoService.getAll(busca);
            res.status(200).json(produtos);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const produto = await ProdutoService.getById(id);
            res.status(200).json(produto);
        } catch (error) {
            next(error);
        }
    }

static async create(req, res, next) {
        try {
            const dados = req.body;
            const idSolicitante = req.usuarioAutenticado;

            const novoProduto = await ProdutoService.create(dados, idSolicitante);
            res.status(201).json(novoProduto);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const produtoAtualizado = await ProdutoService.update(id, dados);

            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async vender(req, res, next) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const produtoAtualizado = await ProdutoService.venderProduto(id, quantidade);
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async repor(req, res, next) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const produtoAtualizado = await ProdutoService.reporEstoque(id, quantidade);
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            next(error);
        }
    }

    static async inativar(req, res, next) {
        try {
            const { id } = req.params;
            const produtoInativado = await ProdutoService.inativarProduto(id);

            res.status(200).json(produtoInativado);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await ProdutoService.delete(id);

            res.status(200).json({ mensagem: 'Produto excluído fisicamente com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

export default ProdutoController;