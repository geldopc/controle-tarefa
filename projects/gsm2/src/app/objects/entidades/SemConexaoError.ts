export class SemConexaoError implements Error {
    name: string;
    message: string;
    stack: string;

    constructor() {
        this.name = 'SemConexaoError';
        this.message = 'Sem acesso a rede, verifique sua conexão com a internet ou entre em contato com o administrador do sistema';
    }
}