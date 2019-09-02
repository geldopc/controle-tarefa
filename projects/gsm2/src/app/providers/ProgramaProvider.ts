import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';

@Injectable()
export class ProgramaProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    obterProgramas(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>(resolve => {
            resolve(this.servicoProvider.post('programa/obterProgramas/', "", false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

}
