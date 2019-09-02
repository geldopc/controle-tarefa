import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ConfiguracaoService } from '../services/util/Config';
import { ServicoProvider } from './ServicoProvider';

@Injectable()
export class FuncionalidadeProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    public obterFuncionalidade(idProduto: number): Promise<HTTPResponse> {
        return this.servicoProvider.post('funcionalidade/obterFuncionalidades/', String(idProduto), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }
}
