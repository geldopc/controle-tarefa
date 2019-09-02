import { OcorrenciaTipo } from './../objects/entidades/OcorrenciaTipo';
import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';

@Injectable()
export class TrabalheConoscoProvider {


  constructor(private servicoProvider: ServicoProvider) { }

public enviar(parametro: string): Promise<HTTPResponse> {
    return this.servicoProvider.post('curriculo/gravarCurriculo', parametro, false, TipoTimeout.DEFAULT.value);
}

}
