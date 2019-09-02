import { Injectable } from '@angular/core';
import { DistribuicaoOcorrenciaGsm } from './DistribuicaoOcorrenciaGsm';
import { OcorrenciaAnexo } from './Ocorrencia';
import { OcorrenciaCommit } from './OcorrenciaCommit';

export class OcorrenciaGsmAnexo {
    idOcorrenciaAnexo: number;
    cdOcorrencia: number;
    dsNome: string;
    upAnexo: any;
    dsExtensao: string;
    arquivo: any;

}

export class PainelOcorrenciaRequest {
    clientes: string[];
    tipoSolicitacao: string[];
    nivelComplexidades: string[];
    grupoFuncionalidades: string[];
    tecnicos: string[];
    prioridades: number[];
    modalidades: string[];
    tarefasFinalizadas: string[];
    ocorrenciasFinalizadas: string[];
    atualizacoes: string[];
    status: string[];
    produtos: string[];

    constructor() {
        this.clientes = [];
        this.tipoSolicitacao = [];
        this.nivelComplexidades = [];
        this.grupoFuncionalidades = [];
        this.tecnicos = [];
        this.prioridades = [];
        this.modalidades = [];
        this.tarefasFinalizadas = [];
        this.ocorrenciasFinalizadas = [];
        this.atualizacoes = [];
        this.status = [];
        this.produtos = [];
    }
}

export class PainelOcorrenciaGsm {
    descricao: string;
    valor: number;
    status: string;
}
export class PainelFinalizadasGsm {
    descricao: string;
    abertos: number;
    finalizados: number;
    status: string;
}
@Injectable()
export class OcorrenciaGsm {

    idOcorrencia: number;
    dsOcorrencia: string;
    cdProduto: number;
    dsProduto: String;
    cdFuncionalidade: number;
    dsFuncionalidade: String;
    dsNivelSeveridade: String;
    inAmbienteEntrada: String;
    inTipoInterface: String;
    dtSolicitacao: Date;
    cdUsuarioSolicitante: String;
    dsUsuarioSolicitante: string;
    inOcorrenciaInterna: Boolean = false;
    inStatus: String;
    dsStatus: String;
    dtConclusao: string;
    dtCadastro: string;
    cdUsuarioCadastro: String;
    dtPrevisaoEntrega: Date;
    cdCliente: number;
    dsCliente: String;
    nrPrioridade1: number;
    nrPrioridade2: number;
    inTipoSolicitacao: String;
    inNivelComplexidade: String;
    distribuicoes: DistribuicaoOcorrenciaGsm[];
    statusDistribuicao: string;
    inTipoDistribuicao: string;
    commits: OcorrenciaCommit[] = [];
    anexos: OcorrenciaGsmAnexo[] = [];
    historico: any[] = [];
    cor: String;
    branch: string;
    dsMotivo: string;
    dsMensagem: string;
    replicacaoSiapec1: Boolean = false;
    dsPrograma: string;
    cdNivelSeveridade: number = 2;
    inControleVersao: boolean;
    // dsAtividade: String;
    // cdAtividade: number;
    dtAlteracao: Date;
    cdUsuarioAlteracao: String;

    convertAnexos(list: OcorrenciaAnexo[]): OcorrenciaGsmAnexo[] {
        const anexos: OcorrenciaGsmAnexo[] = [];
        list.forEach((item) => {
            const ax: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();
            ax.cdOcorrencia = item.cdOcorrencia;
            ax.arquivo = item.arquivo;
            ax.dsExtensao = item.dsExtensao;
            ax.dsNome = item.dsAnexo;
            ax.idOcorrenciaAnexo = item.idOcorrenciaAnexo;
            ax.upAnexo = item.upAnexo;

            anexos.push(ax);
        });

        return anexos;
    }

    public mapOcorrencia(gerarBuild, ocorr) {
            gerarBuild.idOcorrencia.push(ocorr.idOcorrencia);
            gerarBuild.cdProduto = ocorr.cdProduto;
            gerarBuild.versao = ocorr.inStatus;

            return gerarBuild;
    }

}
