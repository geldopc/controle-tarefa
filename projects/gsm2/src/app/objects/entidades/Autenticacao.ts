import { Usuario } from "./Usuario";
import { Estado } from "./Estado";

export class Autenticacao {

    idAutenticacao: number;
    accessToken: string;
    refreshToken: string;
    usuario: Usuario;
    usuarioSindicato: Usuario;
    estado: Estado;

    constructor() { }

    init(idAutenticacao: number, accessToken: string, refreshToken: string, usuario: Usuario, estado: Estado, usuarioSindicato?: Usuario): Autenticacao {
        this.idAutenticacao = idAutenticacao;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.usuario = usuario;
        this.estado = estado;
        this.usuarioSindicato = usuarioSindicato;
        return this;
    }

    get chave() {
        return this.idAutenticacao;
    }

}
