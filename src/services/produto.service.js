import ProdutoRepository from '../repositories/produto.repository.js';
import { ProdutoResponseDTO } from '../dtos/produto.dto.js';

class ProdutoService {
    static async getAll(busca = '', cargoSolicitante = '') {
        const produtos = await ProdutoRepository.findAll();
        let filtrados = produtos;

        if (cargoSolicitante !== 'gerente') {
            filtrados = filtrados.filter(p => p.ativo !== false);
        }

        if (busca) {
            const termo = busca.toLowerCase();
            filtrados = filtrados.filter(p =>
                p.nome.toLowerCase().includes(termo) ||
                p.referencia.toLowerCase().includes(termo)
            );
        }

        if (cargoSolicitante === 'gerente') {
            filtrados.sort((a, b) => {
                if (a.ativo === b.ativo) return 0;
                return a.ativo ? -1 : 1;
            });
        }

        return filtrados.map(p => new ProdutoResponseDTO(p));
    }

    static async getByReferencia(referencia) {
        const produto = await ProdutoRepository.findByReferencia(referencia);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        return new ProdutoResponseDTO(produto);
    }

    static async create(dados, usernameSolicitante) {
        dados.referencia = dados.referencia.toUpperCase();
        const referenciaExiste = await ProdutoRepository.findByReferencia(dados.referencia);
        if (referenciaExiste) {
            const error = new Error('Já existe um produto com esta referência');
            error.statusCode = 409;
            throw error;
        }

        const produtos = await ProdutoRepository.findAll();
        const nomeExiste = produtos.find(p => p.nome.toLowerCase() === dados.nome.toLowerCase());
        if (nomeExiste) {
            const error = new Error('Já existe um produto com este nome');
            error.statusCode = 409;
            throw error;
        }

        dados.cadastradoPor = usernameSolicitante;

        const novoProduto = await ProdutoRepository.create(dados);
        return new ProdutoResponseDTO(novoProduto);
    }


    static async updateByReferencia(referencia, dados) {
        const produtoAtual = await ProdutoRepository.findByReferencia(referencia);

        if (!produtoAtual) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        if (dados.referencia) {
            dados.referencia = dados.referencia.toUpperCase();
            const conflito = await ProdutoRepository.findByReferencia(dados.referencia);
            if (conflito && conflito.id !== produtoAtual.id) {
                const error = new Error('Referência já em uso por outro produto');
                error.statusCode = 409;
                throw error;
            }
        }

        delete dados.id;

        const produtoAtualizado = await ProdutoRepository.replace(produtoAtual.id, dados);
        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async venderProdutoByReferencia(referencia, quantidade) {
        const produto = await ProdutoRepository.findByReferencia(referencia);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        if (produto.ativo === false) {
            const error = new Error('Produto inativo não pode ser vendido');
            error.statusCode = 400;
            throw error;
        }

        if (produto.estoque < quantidade) {
            const error = new Error('Estoque insuficiente para esta venda');
            error.statusCode = 400;
            throw error;
        }

        const novoEstoque = produto.estoque - quantidade;
        const produtoAtualizado = await ProdutoRepository.partialUpdate(produto.id, { estoque: novoEstoque });

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async reporEstoqueByReferencia(referencia, quantidade) {
        const produto = await ProdutoRepository.findByReferencia(referencia);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        const novoEstoque = produto.estoque + quantidade;
        const produtoAtualizado = await ProdutoRepository.partialUpdate(produto.id, { estoque: novoEstoque });

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async inativarProdutoByReferencia(referencia) {
        const produto = await ProdutoRepository.findByReferencia(referencia);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        const produtoAtualizado = await ProdutoRepository.partialUpdate(produto.id, { ativo: false });
        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async deleteByReferencia(referencia) {
        const produto = await ProdutoRepository.findByReferencia(referencia);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        await ProdutoRepository.delete(produto.id);
        return true;
    }
}

export default ProdutoService;