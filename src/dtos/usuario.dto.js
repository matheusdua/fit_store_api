export class UsuarioResponseDTO {
    constructor(usuario) {
        this.id = usuario.id;
        this.nome = usuario.nome;
        this.email = usuario.email;
        this.cargo = usuario.cargo;
        this.ativo = usuario.ativo;
    }
}

