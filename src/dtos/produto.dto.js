export class ProdutoResponseDTO {
    constructor(produto) {
        this.referencia = produto.referencia;
        this.nome = produto.nome;
        this.categoria = produto.categoria;
        this.tamanho = produto.tamanho;
        this.preco = Number(produto.preco).toFixed(2);
        this.estoque = produto.estoque;
    }
}