import { Ocorrencia } from './../objects/entidades/Ocorrencia';
import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';
import { Historico } from '../objects/entidades/Historico';
import { OcorrenciaGsmAnexo, OcorrenciaGsm } from '../objects/entidades/OcorrenciaGsm';
import { OcorrenciaCommit } from '../objects/entidades/OcorrenciaCommit';

@Injectable()
export class OcorrenciaProvider {


    constructor(private servicoProvider: ServicoProvider) { }

    public manterOcorrencia(ocorrencia: Ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrencia/gravarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    // obtem informações do pre cadastro da laboratorio de vacinas, informando se está aprovado, pendente ou reprovado
    obterOcorrencias(cpfCnpj: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrencia/obterOcorrencias/', JSON.stringify(cpfCnpj), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterOcorrenciasAbertas(cpfCnpj: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrencia/obterOcorrenciasAbertas/', JSON.stringify(cpfCnpj), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    public verificarUsuario(cpfCnpj: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('usuario/consultarUsuarioPorCpfCnpj/', cpfCnpj, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterPorStatus(obj): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrencia/obterPorStatus/', JSON.stringify(obj), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterStatus(usuario: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrencia/obterStatus/', JSON.stringify(usuario), false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase));
        });
    }

    public encerrarOcorrencia(ocorrencia: Ocorrencia): Promise<HTTPResponse> {
        console.log('ocorrencia: ' + JSON.stringify(ocorrencia));
        return this.servicoProvider.post('ocorrencia/encerrarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public finalizarOcorrencia(ocorrencia: Ocorrencia): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrencia/finalizarOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public reabrirOcorrencia(ocorrencia: Ocorrencia): Promise<HTTPResponse> {
        // console.log('reabrirOcorrencia...Provider', ocorrencia);
        return this.servicoProvider.post('ocorrencia/reabrirOcorrencia/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public excluirAnexo(idOcorrencia, idOcorrenciaAnexo): Promise<HTTPResponse> {
        const parametro = JSON.stringify({
            idOcorrenciaAnexo: idOcorrenciaAnexo,
            idOcorrencia: idOcorrencia
        });
        return this.servicoProvider.post('ocorrenciaAnexo/excluirAnexo/', parametro, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterAnexoOcorrencia(idOcorrencia: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterAnexosOcorrencia/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public adicionarAnexo(idOcorrencia: number, idOcorrenciaAnexo: number, upAnexo: string, dsAnexo: string, dsExtensao: string): Promise<HTTPResponse> {
        console.log("dsAnexo: " + dsAnexo);
        const parametro = JSON.stringify({
            idOcorrencia: idOcorrencia,
            idOcorrenciaAnexo: idOcorrenciaAnexo,
            upAnexo: upAnexo,
            dsAnexo: dsAnexo,
            dsExtensao: dsExtensao
        });
        console.log("parametro " + JSON.stringify(parametro));
        return this.servicoProvider.post('ocorrenciaAnexo/gravarAnexo/', parametro, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public downloadAnexo(idOcorrencia: number, idOcorrenciaAnexo: number, file) {
        const parametro = JSON.stringify({
            cdOcorrencia: idOcorrencia,
            idOcorrenciaAnexo: idOcorrenciaAnexo
        });
        // console.log("parametro " + JSON.stringify(parametro));
        return this.servicoProvider.post('ocorrenciaAnexo/downloadAnexo/', parametro, false, TipoTimeout.DEFAULT.value, '', true, file);
    }

    public downloadAnexoNovo(idOcorrencia: number, file) {
        console.log("idOcorrencia downloadAnexoNovo" + JSON.stringify(idOcorrencia));
        return this.servicoProvider.post('ocorrenciaGsm/downloadAnexo/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, '', true, file);
    }


    public excluirHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string): Promise<HTTPResponse> {
        const parametro = JSON.stringify({
            idOcorrencia: idOcorrencia,
            idOcorrenciaHistorico: idOcorrenciaHistorico,
            dsAtendimento: dsAtendimento
        });
        return this.servicoProvider.post('ocorrenciaHistorico/excluirHistorico/', parametro, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public adicionarHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string, cdUsuarioAtendimento: string): Promise<HTTPResponse> {
        const parametro = {
            idOcorrencia: idOcorrencia,
            idOcorrenciaHistorico: idOcorrenciaHistorico,
            dsAtendimento: dsAtendimento,
            cdUsuarioAtendimento: cdUsuarioAtendimento
        };
        console.log("parametro: " + JSON.stringify(parametro));
        return this.servicoProvider.post('ocorrenciaHistorico/gravarHistorico/', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public manterHistoricoOcorrencia(historico: Historico): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/manterHistoricoOcorrencia/', JSON.stringify(historico), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterHistoricoOcorrencia(idOcorrencia: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/obterHistoricoOcorrencia/', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }


    public addAnexos(ocorrencia): Promise<HTTPResponse> {
        console.log("ocorrencia: ", ocorrencia);
        return this.servicoProvider.post('ocorrenciaAnexo/addAnexos/', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public manterAnexo(anexo: OcorrenciaGsmAnexo): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/manterAnexo', JSON.stringify(anexo), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    obterStatusOcorrencias(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/obterStatusOcorrencias/', '', false, TipoTimeout.DISTRIBUICAO.value, ConfiguracaoService.enderecoBase));
        });
    }

    public gerarBranch(idDistribuicao: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/gerarBranch/', JSON.stringify(idDistribuicao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public gerarVersaoHomo(idDistribuicoesTeste: any): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/gerarVersao/', JSON.stringify(idDistribuicoesTeste), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public manterListAnexoHistorico(ocorrencia: OcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaGsm/manterListAnexoHistorico', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterCommits(idOcorrencia: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/obterCommits', JSON.stringify(idOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public gravarCommit(commit: OcorrenciaCommit): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/gravar', JSON.stringify(commit), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public atualizarCommits(commit: OcorrenciaCommit): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/atualizar', JSON.stringify(commit), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public excluirCommit(commit: OcorrenciaCommit): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/excluirCommit', JSON.stringify(commit), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public excluirCommitsOcorrencia(commit: OcorrenciaCommit): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/excluirCommitsOcorrencia', JSON.stringify(commit), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public gravarVariosCommits(ocorrencia: OcorrenciaGsm): Promise<HTTPResponse> {
        return this.servicoProvider.post('ocorrenciaCommit/gravarCommits', JSON.stringify(ocorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }
}
