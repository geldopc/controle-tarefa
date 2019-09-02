export class UsuarioNaoAutenticadoError implements Error {
    name: string;
    message: string;
    stack: string;

    constructor() {
        this.name = 'UsuarioNaoAutenticadoError';
        this.message = 'Favor efetuar o login novamente.';
    }
}