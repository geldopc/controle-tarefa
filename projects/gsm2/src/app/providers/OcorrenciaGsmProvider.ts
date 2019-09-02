import { OcorrenciaGsmVersao } from './../objects/entidades/OcorrenciaGsmVersao';
import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { OcorrenciaGsm } from '../objects/entidades/OcorrenciaGsm';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ConfiguracaoService } from '../services/util/Config';
import { ServicoProvider } from './ServicoProvider';
import { DistribuicaoOcorrenciaGsm } from '../objects/entidades/DistribuicaoOcorrenciaGsm';
import { Usuario } from '../objects/entidades/Usuario';

@Injectable()
export class OcorrenciaGsmProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    public manterOcorrencia(ocorrencia: OcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/manter/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public alterarTecnico(idOcorrencia: number[], funcionarioDe: Usuario, funcionarioPara: Usuario): Promise<HTTPResponse> {
        const parametro = {
            idOcorrencias: idOcorrencia,
            funcionarioDe: funcionarioDe.idUsuario,
            funcionarioPara: funcionarioPara.idUsuario
        };
        return this.servicoProvider.post('ocorrenciaGsm/alterarTecnico/', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterBranchesAtivos(cdTipoTarefa): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterBranchesAtivos/', String(cdTipoTarefa), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public gravarOcorrencia(ocorrencia: OcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/gravarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public gerarVersao(ocorrenciaGsmVersao: OcorrenciaGsmVersao): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/gerarVersao/', JSON.stringify(ocorrenciaGsmVersao), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    }

    public callJenkins(ocorrenciaGsmVersao: OcorrenciaGsmVersao, versao: String): Promise<HTTPResponse> {
        return this.servicoProvider.post('jenkinsVersao/build/', JSON.stringify(versao), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    }
    // public callJenkins(ocorrenciaGsmVersao: OcorrenciaGsmVersao, versao: String): Promise<HTTPResponse> {
    //     let url: string = "https://";
    //     let jobVersion: string;
    //     switch (versao) {
    //         case "A":
    //             jobVersion = 'ALPHA';
    //             url = url + "siapec3:117457a2f825a549f615a1f5149cca8af7@192.168.0.40:8079";
    //             break;
    //         case "B":
    //             jobVersion = 'BETA';
    //             url = url + "siapec3:1bca6bbc53c4632f4c411cdef31e2ac1@192.168.20.103:8079";
    //             break;
    //         case "C":
    //             jobVersion = 'PROD';
    //             url = url + "siapec3:1bca6bbc53c4632f4c411cdef31e2ac1@192.168.20.103:8079";
    //             break;
    //     }


    //     console.log("executarCallJenkins Provider");
    //     return this.servicoProvider.executaRequisicaoJenkins(versao, url + '/job/' + jobVersion + '/job/controle_build_gsm/', null, true, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    // }

    public distribuir(distribuicao: DistribuicaoOcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/distribuir/', JSON.stringify(distribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public editarDistribuicao(distribuicao: DistribuicaoOcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/editarDistribuicao/', JSON.stringify(distribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public removerDistribuicao(distribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/excluirDistribuicao/', JSON.stringify(distribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterfuncionariosTarefa(cdTipoTarefa): Promise<HTTPResponse> {
        return this.servicoProvider.post('usuario/obterFuncionariosTarefa/', String(cdTipoTarefa), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public alterarPrioridadeOcorrencia(ocorrencias): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/alterarPrioridadeOcorrencias/', ocorrencias, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public iniciarDistribuicao(idOcorrenciaDistribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/iniciarDistribuicao/', JSON.stringify(idOcorrenciaDistribuicao), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    }

    public pararDistribuicao(idOcorrenciaDistribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/pararDistribuicao/', JSON.stringify(idOcorrenciaDistribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public reprovarDistribuicao(distribuicao: any): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/reprovarDistribuicao/', JSON.stringify(distribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public reiniciarDistribuicao(idOcorrenciaDistribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/reiniciarDistribuicao/', JSON.stringify(idOcorrenciaDistribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public finalizarDistribuicao(idOcorrenciaDistribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/finalizarDistribuicao/', JSON.stringify(idOcorrenciaDistribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public alterarStatus(ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/alterarStatus/', JSON.stringify(ocorrencia), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    }
    public finalizarOcorrencia(ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/finalizarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public editarOcorrencia(ocorrencia: OcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/editarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterPorStatus(ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterPorStatus/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasStatusFuncaoOrganograma(ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterOcorrenciasStatusFuncaoOrganograma/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterDistribuicoes(idOcorrencia: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterDistribuicoes/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterHistoricoBuilds(idOcorrencia: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterHistoricoBuilds/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public editarPrioridadeCliente(prioridade): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/editarPrioridadeCliente/', JSON.stringify(prioridade), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterAgendaDistribuicao(doc): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterAgendaDistribuicao/', JSON.stringify(doc), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obter(filtros): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obter/', JSON.stringify(filtros), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase);
    }

    public downloadAnexo(idOcorrenciaAnexo: number, ext) {
        return this.servicoProvider.post('ocorrenciaGsm/downloadAnexo/', JSON.stringify(idOcorrenciaAnexo), false, TipoTimeout.DEFAULT.value, '', true, ext);
    }

    public obterHistoricoAnexo(idOcorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterHistoricoAnexo/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }
}
