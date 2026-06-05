import ProdutoRepository from '../repositories/produto.repository.js';
import { ProdutoResponseDTO } from '../dtos/produto.dto.js';
import FuncionarioRepository from '../repositories/funcionario.repository.js';

class ProdutoService {
    static async getAll(busca = '') {
        const produtos = await ProdutoRepository.findAll();
        let filtrados = produtos;

        if (busca) {
            const termo = busca.toLowerCase();
            filtrados = produtos.filter(p =>
                p.nome.toLowerCase().includes(termo) ||
                p.referencia.toLowerCase().includes(termo)
            );
        }

        filtrados.sort((a, b) => {
            if (a.ativo === b.ativo) return 0;
            return a.ativo ? -1 : 1;
        });

        return filtrados.map(p => new ProdutoResponseDTO(p));
    }

    static async getById(id) {
        const produto = await ProdutoRepository.findById(id);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        return new ProdutoResponseDTO(produto);
    }

    static async create(dados, idSolicitante) {
        const produtos = await ProdutoRepository.findAll();

        const referenciaExiste = produtos.find(p => p.referencia === dados.referencia);
        if (referenciaExiste) {
            const error = new Error('Já existe um produto com esta referência');
            error.statusCode = 409;
            throw error;
        }

        const nomeExiste = produtos.find(p => p.nome.toLowerCase() === dados.nome.toLowerCase());
        if (nomeExiste) {
            const error = new Error('Já existe um produto com este nome');
            error.statusCode = 409;
            throw error;
        }

        dados.cadastradoPor = Number(idSolicitante);

        const novoProduto = await ProdutoRepository.create(dados);
        return new ProdutoResponseDTO(novoProduto);
    }


    static async update(id, dados) {
        const produtoAtual = await ProdutoRepository.findById(id);

        if (!produtoAtual) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        if (dados.referencia) {
            const produtos = await ProdutoRepository.findAll();
            const conflito = produtos.find(p => p.referencia === dados.referencia && p.id !== Number(id));
            if (conflito) {
                const error = new Error('Referência já em uso por outro produto');
                error.statusCode = 409;
                throw error;
            }
        }

        delete dados.id;

        const produtoAtualizado = await ProdutoRepository.update(id, dados);
        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async venderProduto(id, quantidade) {
        const produto = await ProdutoRepository.findById(id);

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
        const produtoAtualizado = await ProdutoRepository.partialUpdate(id, { estoque: novoEstoque });

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async reporEstoque(id, quantidade) {
        const produto = await ProdutoRepository.findById(id);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        const novoEstoque = produto.estoque + quantidade;
        const produtoAtualizado = await ProdutoRepository.partialUpdate(id, { estoque: novoEstoque });

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async inativarProduto(id) {
        const produto = await ProdutoRepository.findById(id);

        if (!produto) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        const produtoAtualizado = await ProdutoRepository.partialUpdate(id, { ativo: false });
        return new ProdutoResponseDTO(produtoAtualizado);
    }

    static async delete(id) {
        const deletado = await ProdutoRepository.delete(id);

        if (!deletado) {
            const error = new Error('Produto não encontrado');
            error.statusCode = 404;
            throw error;
        }

        return true;
    }
}

export default ProdutoService;