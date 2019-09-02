import { OcorrenciaProduto } from './../objects/entidades/OcorrenciaProduto';
import { Injectable } from '@angular/core';
import { HTTPResponse } from '../objects/entidades/HTTPResponse';
import { TipoTimeout } from '../objects/enums/TipoTimeout';
import { ServicoProvider } from './ServicoProvider';
import { ConfiguracaoService } from '../services/util/Config';

@Injectable()
export class OcorrenciaProdutoProvider {


    constructor(private servicoProvider: ServicoProvider) { }


    // obtem informações do pre cadastro da laboratorio de vacinas, informando se está aprovado, pendente ou reprovado
    // obterOcorrenciasProdutos(cpfCnpj: string): Promise<HTTPResponse> {
    //     return new Promise<HTTPResponse>((resolve, reject) => {
    //         resolve(this.servicoProvider.post('produtoServico/obterProdutoServico/', JSON.stringify(cpfCnpj), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
    //     });
    // }

    obterClientes(parametro): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('cliente/obterClientes', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterProdutos(parametro): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('produto/obterProdutos', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterUsuarios(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('usuario/obterFuncionariosSm', null, false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterOcorrenciasGsmPorUsuario(parametro): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/obterOcorrenciasGsmPorUsuario', JSON.stringify(parametro), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
    obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/obterOcorrenciasGsmPorFiltrosPainelOcorrencia', JSON.stringify(convertFiltroPainelWS), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterDistribuicoesPorVariasOcorrencias(convertFiltroPainelWS): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/obterDistribuicoesPorVariasOcorrencias', JSON.stringify(convertFiltroPainelWS), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    gerarCsvWS(convertFiltroPainelWS): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/exportarRelatorioClienteExcel', JSON.stringify(convertFiltroPainelWS), false, TipoTimeout.DEFAULT.value, '', true, 'xlsx'));
        });
    }

    gerarCsvClienteWS(convertFiltroPainelWS): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrenciaGsm/obterClienteCsv', JSON.stringify(convertFiltroPainelWS), false, TipoTimeout.DEFAULT.value, '', true, 'csv'));
        });
    }

    gerarCsvClienteSiapec1WS(convertFiltroPainelWS): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('ocorrencia/obterClienteCsv', JSON.stringify(convertFiltroPainelWS), false, TipoTimeout.DEFAULT.value, '', true, 'csv'));
        });
    }

    obterClientesPorResponsavel(doc): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('cliente/obterClientesPorResponsavel', JSON.stringify(doc), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
    obterClientesPorFuncionarioSituacao(doc): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>((resolve, reject) => {
            resolve(this.servicoProvider.post('cliente/obterClientesPorFuncionarioSituacao', JSON.stringify(doc), false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterProdutosTecnico(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>(resolve => {
            resolve(this.servicoProvider.post('produto/obterProdutosTecnico', '', false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }

    obterProdutosSituacao(): Promise<HTTPResponse> {
        return new Promise<HTTPResponse>(resolve => {
            resolve(this.servicoProvider.post('produto/obterProdutosSituacao', '', false, TipoTimeout.DEFAULT.value, ConfiguracaoService.enderecoBase));
        });
    }
}
