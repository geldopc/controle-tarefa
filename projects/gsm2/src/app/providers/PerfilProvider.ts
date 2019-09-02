import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';

@Injectable()
export class PerfilProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    obterPerfis(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('perfil/obterPerfis/', "", false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

}
