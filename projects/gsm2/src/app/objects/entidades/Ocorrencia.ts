import { Injectable } from '@angular/core';
import { OcorrenciaCommit } from './OcorrenciaCommit';

export class OcorrenciaAnexo {
    idOcorrenciaAnexo: number;
    cdOcorrencia: number;
    upAnexo: any;
    dsAnexo: string;
    dsExtensao: string;
    cdUsuarioAtendimento: string;
    arquivo: any;

}
@Injectable()
export class Ocorrencia {

    idOcorrencia: number;
    usuarioAbertura: string;
    dsProblema: string;
    cdTipoAtendimento: string;
    cdNivelSeveridade: number;
    dtAbertura: string = new Date().toLocaleDateString();
    cdProdutoServico: number;
    cdCliente: number;
    inStatus: string;
    status: string;
    dtLimiteAtendimento: string;
    listAnexo: OcorrenciaAnexo[];
    listHistorico: any[];
    commits: OcorrenciaCommit[];
    cdTipoOcorrencia: number;
    dsUsuarioAbertura: string;
    prioridadeUm: number;
    prioridadeDois: number;
    dsTipoInterface: string;
    dsAmbienteInterface: string;
    solicitadoCliente: boolean;
    desenvolvedor: string;
    homologador: string;
    branch: string;
    tipoDesenvolvimento: number;
    desenvolvedorSm: number;
    tipoTarefa: string;
    novoGsm: boolean;
    nrPrioridadeFocalPoint: number;
    nrPrioridadeGerenteProjeto: number;
    prioridade: number;
    padraoStatusDiaDia: boolean = false;

    constructor() {
        this.idOcorrencia = 0;
        this.cdTipoAtendimento = null;
        this.cdProdutoServico = null;
        this.cdCliente = null;
        this.cdNivelSeveridade = null;
        this.cdCliente = null;
        this.inStatus = null;
        this.dtLimiteAtendimento = null;
        this.listAnexo = [];
        this.listHistorico = [];
        this.commits = [];
    }

}
