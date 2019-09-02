
export class Historico {

    idOcorrenciaHistorico: number;
    cdOcorrencia: number;
    dsMensagem: string;
    dtCadastro: string;
    cdUsuario: string;
    usuario: string;

    constructor() { }
}


export class HistoricoAtualizacaoBuilds {

    idControleAtualizacao: number;
    dsTipoAtualizacao: string;
    dsStatus: string;
    dtInicioAtualizacao: string;
    dtFimAtualizacao: string;
    dsNomeTag: string;
    dsCliente: string;
    dsModalidade: string;

    constructor() { }
}
