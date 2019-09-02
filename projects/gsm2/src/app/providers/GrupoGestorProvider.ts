import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';
import { KeyUser } from '../objects/entidades/KeyUser';
import { GerenciadorSessao } from '../services/util/GerenciadorSessao';

@Injectable()
export class GrupoGestorProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    gravar(grupoGestor): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/gravar/', JSON.stringify(grupoGestor), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    editar(grupoGestor): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/editar/', JSON.stringify(grupoGestor), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterTodos(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/obterTodos/', '', false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterTodosPorCliente(doc: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/obterTodosPorCliente/', JSON.stringify(doc), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    gravarFocalPoint(focalPoint): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/gravarFocalPoint/', JSON.stringify(focalPoint), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    gravarKeyUser(keyUser): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/gravarKeyUser/', JSON.stringify(keyUser), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    editarFocalPoint(focalPoint): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/editarFocalPoint/', JSON.stringify(focalPoint), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    excluirFocalPoint(focalPoint): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/excluirFocalPoint/', JSON.stringify(focalPoint), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    excluirKeyUser(keyUser): Promise<HTTPResponse> {
        console.log("GrupoGestorProvider/delKeyUser...", keyUser);
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/excluirKeyUser/', JSON.stringify(keyUser), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obter(idCliente): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('grupoGestor/obter/', JSON.stringify({
                idCliente: idCliente,
                cpfCnpj: GerenciadorSessao.sessao.usuario.nrDocumento
            }), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
}
