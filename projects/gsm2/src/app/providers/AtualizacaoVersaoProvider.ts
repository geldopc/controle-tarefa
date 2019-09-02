import { AtualizacaoHistorico } from './../objects/entidades/AtualizacaoHistorico';
import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ConfiguracaoService } from '../services/util/Config';
import { ServicoProvider } from './ServicoProvider';
import { Atualizacao } from '../objects/entidades/Atualizacao';
import { ControleAtualizacaoRequest } from '../objects/entidades/ControleAtualizacaoRequest';

@Injectable()
export class AtualizacaoVersaoProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    public verificarAtualizacao(atualizacao: Atualizacao): Promise<HTTPResponse> {
        return this.servicoProvider.post('atualizacaoVersao/verificarAtualizacao/', JSON.stringify(atualizacao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterHistoricoAtualizacao(atualizacao: AtualizacaoHistorico): Promise<HTTPResponse> {
        return this.servicoProvider.post('atualizacaoVersao/obterHistoricoAtualizacao/', JSON.stringify(atualizacao), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public atualizarControleAtualizacao(controleAtualizacaoRequest: ControleAtualizacaoRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('atualizacaoVersao/atualizarControleAtualizacao/', JSON.stringify(controleAtualizacaoRequest), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

}
