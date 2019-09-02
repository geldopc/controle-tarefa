import { Injectable } from '@angular/core';
import { ServicoProvider } from './ServicoProvider';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ConfiguracaoService } from '../services/util/Config';
import { PainelOcorrenciaRequest } from '../objects/entidades/OcorrenciaGsm';

@Injectable()
export class PainelOcorrenciaGsmProvider {

    constructor(private servicoProvider: ServicoProvider) { }

    public obterOcorrenciasNaoDistribuidasPorCliente(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterNaoDistribuidasPorCliente/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasPorStatusSelecionado(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterOcorrenciasPorStatusSelecionado/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasEmDesenvolvimentoPorCliente(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterEmDesenvolvimentoPorCliente/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasAguardandoAtualizacao(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterOcorrenciasAguardandoAtualizacao/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }
    public obterEmDesenvolvimentoPorNivelPrioridade(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterEmDesenvolvimentoPorNivelPrioridade/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterTarefasEmDesenvolvimentoFuncionalidade(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterEmDesenvolvimentoPorFuncionalidade/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterTarefasEmDesenvolvimentoPorTecnico(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterTarefasEmDesenvolvimentoPorTecnico/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }
    public obterTarefasFinalizadasPorTecnico(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterTarefasFinalizadasPorTecnico/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterTarefasEmDesenvolvimentoModalidade(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterTarefasEmDesenvolvimentoModalidade/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterTarefasFinalizadosPorData(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterTarefasFinalizadosPorData/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }

    public obterOcorrenciasFinalizadosUltimosCincoDias(request: PainelOcorrenciaRequest): Promise<HTTPResponse> {
        return this.servicoProvider.post('painelOcorrenciaGsm/obterOcorrenciasFinalizadosUltimosCincoDias/', JSON.stringify(request), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase);
    }


}
