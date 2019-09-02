import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';

@Injectable()
export class UsuarioProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    // obtem informações do pre cadastro da laboratorio de vacinas, informando se está aprovado, pendente ou reprovado
    obterUsuarioPorNrDocumento(nrDocumento: string): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('usuario/obterUsuarioPorNrDocumento/', JSON.stringify(nrDocumento), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    gravarUsuario(usuario): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('usuario/gravar/', JSON.stringify(usuario), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterUsuarios(idCliente): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('usuario/obterUsuarios/', JSON.stringify(idCliente), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

}
