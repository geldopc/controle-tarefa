import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ConfiguracaoService } from '../services/util/Config';
import { ServicoProvider } from './ServicoProvider';

@Injectable()
export class OcorrenciaTipoProvider {


    constructor(private servicoProvider: ServicoProvider) { }

    // obtem informações do pre cadastro da laboratorio de vacinas, informando se está aprovado, pendente ou reprovado
    obterTipoOcorrencia(produtoOcorrencia: number): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('tipoOcorrencia/obterTipoOcorrencia/', JSON.stringify(produtoOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterFuncionalidade(produtoOcorrencia: number): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('funcionalidade/obterFuncionalidades/', JSON.stringify(produtoOcorrencia), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterModalidadeDesenvolvimento(parametro): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('tipoTarefa/obterTodos', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterFuncionalidadesProgramaUsuario(cpfCnpj): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('funcionalidade/obterFuncionalidadesProgramaUsuario/', JSON.stringify(cpfCnpj), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
    obterFuncionalidadesClientePorArea(oco): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('funcionalidade/obterFuncionalidadesClientePorArea/', JSON.stringify(oco), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    // obterAtividade(): Promise<HTTPResponse> {
    //     return new Promise<HTTPResponse>((resolve, reject) => {
    //         resolve(this.servicoProvider.post('ocorrenciaGsm/obterAtividade/', '', false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
    //     });
    // }

    obterNivelSeveridade(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>(resolve => {
            resolve(this.servicoProvider.post('tipoOcorrencia/obterNivelSeveridade/', '', false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
}
