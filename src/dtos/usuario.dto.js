export class UsuarioResponseDTO {
    constructor(usuario) {
        this.nome = usuario.nome;
        this.username = usuario.username;
        this.email = usuario.email;
        this.cargo = usuario.cargo;
    }
}