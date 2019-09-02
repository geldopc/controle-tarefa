import { PainelOcorrenciaService } from './../../services/PainelOcorrenciaGsmService';
import { Component, OnInit } from "@angular/core";
import { PainelOcorrenciaRequest, PainelOcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Util } from '../../services/util/Util';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { OcorrenciaProdutoService } from "./../../services/OcorrenciaProdutoService";
import { Tuple } from "../../objects/entidades/Tuple";
interface Produto {
    idProduto: number,
    dsProduto: String
}
@Component({
    selector: "page-administracao",
    templateUrl: "./administracao.component.html",
    styleUrls: ["./administracao.component.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class AdministracaoPage implements OnInit {

    labelsOcorrenciasNaoDistribuidos: string[] = [];
    labelsOcorrenciasAguardandoAtualizacaoPorCliente: string[] = [];
    labelsOcorrenciasAguardandoViabilidade: string[] = [];
    labelsOcorrenciasEmDesenvolvimentoCliente: string[] = [];
    labelsOcorrenciasEmDesenvolvimentoPorTipoSolicitacao: string[] = [];
    labelsOcorrenciasEmDesenvolvimentoPorNivelComplexidade: string[] = [];
    labelsOcorrenciasAguardandoAtualizacao: string[] = [];
    labelsOcorrenciasEmDesenvolvimentoPorNivelPrioridade: string[] = [];
    labelsOcorrenciasFinalizadasUltimosDias: string[] = [];
    legendaOcorrenciasFinalizadasUltimosDias: string[] = [];
    legendaOcorrenciasAguardandoAtualizacao: string[] = [];
    legendaOcorrenciasEmDesenvolvimentoPorNivelPrioridade: string[] = [];

    labelsTarefasEmDesenvolvimentoFuncionalidade: string[] = [];
    labelsTarefasEmDesenvolvimentoTecnico: string[] = [];
    labelsTarefasFinalizadasTecnico: string[] = [];
    labelsTarefasEmDesenvolvimentoModalidade: string[] = [];
    labelsTarefasFinalizadasUltimosDias: string[] = [];
    legendaFinalizadasUltimosDias: string[] = [];

    dadosOcorrenciasNaoDistribuidos: number[] = [];
    dadosOcorrenciasAguardandoAtualizacaoPorCliente: number[] = [];
    dadosOcorrenciasAguardandoViabilidade: number[] = [];
    dadosOcorrenciasEmDesenvolvimentoCliente: number[] = [];
    dadosOcorrenciasEmDesenvolvimentoPorTipoSolicitacao: number[] = [];
    dadosOcorrenciasEmDesenvolvimentoPorNivelComplexidade: number[] = [];
    dadosOcorrenciasAguardandoAtualizacao: Array<{data: number[], label: string}> = [];
    dadosOcorrenciasEmDesenvolvimentoPorNivelPrioridade: Array<{data: number[], label: string}> = [];
    dadosOcorrenciasFinalizadasUltimosDias: Array<{data: number[], label: string}> = [];

    dadosTarefasEmDesenvolvimentoFuncionalidade: number[] = [];
    dadosTarefasEmDesenvolvimentoTecnico: number[] = [];
    dadosTarefasFinalizadasTecnico: number[] = [];
    dadosTarefasEmDesenvolvimentoModalidade: number[] = [];
    dadosTarefasFinalizadasUltimosDias: Array<{data: number[], label: string}> = [];

    produtos: Tuple[];
    produto: Produto;
    listProdutosSelecionados: Tuple[] = [];
    request: PainelOcorrenciaRequest = new PainelOcorrenciaRequest();

    constructor(
        private service: PainelOcorrenciaService,
        private loading: Ng4LoadingSpinnerService,
        private util: Util,
        private ocorrenciaProdutoService: OcorrenciaProdutoService
    ) {
    }

    ngOnInit() {
        this.setprodutos();
        this.produto = { idProduto: 0, dsProduto: ''};
    }

    pesquisar(c: boolean) {
        this.request.produtos = [];
        this.loading.show();
        if (c && this.listProdutosSelecionados){
            this.listProdutosSelecionados.forEach((p) =>{
                this.request.produtos.push(String(p.show));
            });
        }
        this.consultarGraficos();
    }
 
    setprodutos() {
        this.ocorrenciaProdutoService.obterProdutos(null)
            .then((resposta: any[]) => {
                this.produtos = [];
                // this.produtos.push(new Tuple("Todos ...  ", null));
                resposta.forEach(item => {
                    this.produtos.push(
                        new Tuple(item.valor, item.codigo)
                    );
                });
            }).then(() => {
                if (this.produtos && this.produtos.length > 0) {
                    this.setProdutoFiltro(this.produtos[3]);
                }
            });
    }

    setProdutoFiltro(produto: Tuple) {
        this.produto.dsProduto = produto.show;
        this.produto.idProduto = produto.select;
        this.listProdutosSelecionados.push(produto);
        this.pesquisar(true);
    }

    limpar() {
        this.loading.show();
        this.request = new PainelOcorrenciaRequest();
        this.listProdutosSelecionados = [];
        this.consultarGraficos();
    }

    consultarGraficos() {
        this.obterOcorrenciasNaoDistribuidasPorCliente();
        this.obterAguardandoAtualizacaoPorCliente();
        this.obterAguardandoAtualizacaoViabilidade();
        this.obterOcorrenciasEmDesenvolvimentoPorCliente();
        this.obterEmDesenvolvimentoPorNivelPrioridade();
        this.obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao();
        this.obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade();
        this.obterOcorrenciasFinalizadosUltimosCincoDias();

        this.obterTarefasEmDesenvolvimentoFuncionalidade();
        this.obterTarefasEmDesenvolvimentoPorTecnico();
        this.obterTarefasFinalizadasPorTecnico();
        this.obterTarefasEmDesenvolvimentoModalidade();
        this.obterTarefasFinalizadasUltimosDias();
        this.loading.hide();
    }

    porProduto(event, tag?) {
        if (!tag && !this.request.produtos.find((e) => e === event.label)) {
            this.request.produtos.push(event.label);
        } else {
            this.request.produtos.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }
    porCliente(event, tag?) {
        if (!tag && !this.request.clientes.find((e) => e === event.label)) {
            this.request.clientes.push(event.label);
        } else {
            this.request.clientes.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porTiposSolicitacao(event, tag?) {
        if (!tag && !this.request.tipoSolicitacao.find((e) => e === event.label)) {
            this.request.tipoSolicitacao.push(event.label);
        } else {
            this.request.tipoSolicitacao.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porNiveisComplexidade(event, tag?) {
        // switch (event.label) {
        //     case "Baixa":
        //         event.label = "B";
        //         break;
        //     case "Média":
        //         event.label = "M";
        //         break;
        //     case "Alta":
        //         event.label = "A";
        //         break;
        // }
        if (!tag && !this.request.nivelComplexidades.find((e) => e === event.label)) {
            this.request.nivelComplexidades.push(event.label);
        } else {
            this.request.nivelComplexidades.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porGruposFuncionalidade(event, tag?) {
        if (!tag && !this.request.grupoFuncionalidades.find((e) => e === event.label)) {
            this.request.grupoFuncionalidades.push(event.label);
        } else {
            this.request.grupoFuncionalidades.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porTecnicos(event, tag?) {
        if (!tag && !this.request.tecnicos.find((e) => e === event.label)) {
            this.request.tecnicos.push(event.label);
        } else {
            this.request.tecnicos.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porModalidades(event, tag?) {
        if (!tag && !this.request.modalidades.find((e) => e === event.label)) {
            this.request.modalidades.push(event.label);
        } else {
            this.request.modalidades.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porAtualizacoes(event, tag?) {
        if (!tag && !this.request.atualizacoes.find((e) => e === event.label)) {
            this.request.atualizacoes.push(event.label);
        } else {
            this.request.atualizacoes.splice((tag) ? tag : event );
        }
        this.consultarGraficos();
    }

    porPrioridade(event, tag?) {
        if (!tag) {
            console.log("event:: " + JSON.stringify(event));
            let prioridade = String(event.label).replace("- Prioridades", "").replace("Prioridade ", "");
            prioridade = (prioridade === "Não classificado") ? null : prioridade;
            if (!this.request.prioridades.find((e) => e === Number(prioridade))) {
                this.request.prioridades.push(Number(prioridade));
            }
        } else {
            this.request.prioridades = [];
        }
        this.consultarGraficos();
    }

    porTarefasFinalizadas(event, tag?) {
        if (!tag && !this.request.tarefasFinalizadas.find((e) => e === event.label)) {
            console.log("tarefas finalizadas:: " + JSON.stringify(event));
            this.request.tarefasFinalizadas.push(event.label);
        } else {
            console.log("tag finalizadas:: " + JSON.stringify(tag));
            this.request.tarefasFinalizadas.splice(tag);
        }
        this.consultarGraficos();
    }

    porOcorrenciasUltimosDias(event, tag?) {
        console.log("porOcorrenciasUltimosDias finalizadas:: " + JSON.stringify(event));
        if (!tag && !this.request.ocorrenciasFinalizadas.find((e) => e === event.label)) {
            console.log("porOcorrenciasUltimosDias finalizadas:: " + JSON.stringify(event));
            this.request.ocorrenciasFinalizadas.push(event.label);
        } else {
            console.log("tag ultimosCinco:: " + JSON.stringify(tag));
            this.request.ocorrenciasFinalizadas.splice(tag);
        }
        this.consultarGraficos();
    }


    obterOcorrenciasAguardandoAtualizacao() {
        this.service.obterOcorrenciasAguardandoAtualizacao(this.request).then((response) => {
            let result: {dados: number[], legenda: string}[] = [];
            result.push({dados: [], legenda: "Alpha"});
            result.push({dados: [], legenda: "Beta"});
            result.push({dados: [], legenda: "Produção"});
            response.forEach((item) => {
                if (!this.legendaOcorrenciasAguardandoAtualizacao.find((key) => key === item.status)) {
                   this.legendaOcorrenciasAguardandoAtualizacao.push(item.status);
                }
                if  (item.status === 'Alpha') {
                    result.find((l) => l.legenda === 'Alpha').dados.push(item.valor);
                } else if  (item.status === 'Beta') {
                    result.find((l) => l.legenda === 'Beta').dados.push(item.valor);
                } else if  (item.status === 'Produção') {
                    result.find((l) => l.legenda === 'Produção').dados.push(item.valor);
                }
            });
            this.labelsOcorrenciasAguardandoAtualizacao = [];
            this.dadosOcorrenciasAguardandoAtualizacao = [];
            this.legendaOcorrenciasAguardandoAtualizacao.forEach(element => {
                if (result.find((l) => l.legenda === element)) {
                    this.dadosOcorrenciasAguardandoAtualizacao.push({ data: result.find((l) => l.legenda === element).dados, label: element });
                }
                this.labelsOcorrenciasAguardandoAtualizacao.push(element);
            });

        }).catch((err) => {
            console.log("Err obterOcorrenciasAguardandoAtualizacao" + err);
        });
    }

    obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao() {
        this.labelsOcorrenciasEmDesenvolvimentoPorTipoSolicitacao = [];
        this.dadosOcorrenciasEmDesenvolvimentoPorTipoSolicitacao = [];
        this.service.obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao(this.request).then((response) => {
            response.forEach((item) => {
                let descricao = null;
                if (item.descricao === "C") {
                    descricao = "Correção";
                } else if (item.descricao === "N") {
                    descricao = "Nova funcionalidade";
                } else if (item.descricao === "A") {
                    descricao = "Adaptação";
                } else if (item.descricao === "S") {
                    descricao = "Suporte";
                } else {
                    descricao = item.descricao;
                }
                this.labelsOcorrenciasEmDesenvolvimentoPorTipoSolicitacao.push(descricao);
                this.dadosOcorrenciasEmDesenvolvimentoPorTipoSolicitacao.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterOcorrenciasEmDesenvolvimentoPorTipoSolicitacao" + err);
        });
    }

    obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade() {
        this.labelsOcorrenciasEmDesenvolvimentoPorNivelComplexidade = [];
        this.dadosOcorrenciasEmDesenvolvimentoPorNivelComplexidade = [];
        this.service.obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade(this.request).then((response) => {
            response.forEach((item) => {
                let descricao = null;
                if (item.descricao === "B") {
                    descricao = "Baixa";
                } else if (item.descricao === "M") {
                    descricao = "Média";
                } else if (item.descricao === "A") {
                    descricao = "Alta";
                } else {
                    descricao = item.descricao;
                }
                this.labelsOcorrenciasEmDesenvolvimentoPorNivelComplexidade.push(descricao);
                this.dadosOcorrenciasEmDesenvolvimentoPorNivelComplexidade.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterOcorrenciasEmDesenvolvimentoPorNivelComplexidade" + err);
        });
    }


    obterEmDesenvolvimentoPorNivelPrioridade() {
        let prioridades: number[] = [];
        this.labelsOcorrenciasEmDesenvolvimentoPorNivelPrioridade = [];
        this.service.obterEmDesenvolvimentoPorNivelPrioridade(this.request).then((response) => {
                    response.sort((a, b) => {
                        if (a.descricao > b.descricao) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                    response.forEach((item) => {
                        if (!this.legendaOcorrenciasEmDesenvolvimentoPorNivelPrioridade.find((key) => key === item.descricao)) {
                           this.labelsOcorrenciasEmDesenvolvimentoPorNivelPrioridade.push(item.descricao);
                           this.legendaOcorrenciasEmDesenvolvimentoPorNivelPrioridade.push(item.status);
                        }
                        prioridades.push(item.valor);
                    });

            }).then(() => {
                this.dadosOcorrenciasEmDesenvolvimentoPorNivelPrioridade = [];
                this.dadosOcorrenciasEmDesenvolvimentoPorNivelPrioridade.push({ data: prioridades, label: "Prioridades" });
        }).catch((err) => {
            console.log("Err obterEmDesenvolvimentoPorNivelPrioridade" + err);
        });
    }

    obterTarefasEmDesenvolvimentoModalidade() {
        this.labelsTarefasEmDesenvolvimentoModalidade = [];
        this.dadosTarefasEmDesenvolvimentoModalidade = [];
        this.service.obterTarefasEmDesenvolvimentoModalidade(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsTarefasEmDesenvolvimentoModalidade.push(item.descricao);
                this.dadosTarefasEmDesenvolvimentoModalidade.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterTarefasEmDesenvolvimentoModalidade" + err);
        });
    }

    obterOcorrenciasFinalizadosUltimosCincoDias() {
        this.labelsOcorrenciasFinalizadasUltimosDias = [];
        this.dadosOcorrenciasFinalizadasUltimosDias = [];
        let resposta: any[] = [];
        let abertos: number[] = [];
        let finalizados: number[] = [];
        let result: {dados: number[], legenda: string}[] = [];
        this.service.obterOcorrenciasFinalizadosUltimosCincoDias(this.request).then((response) => {
                response.sort((a, b) => {
                    if (a.descricao > b.descricao) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                response.forEach((item) => {
                    if (!this.legendaOcorrenciasFinalizadasUltimosDias.find((key) => key === item.descricao)) {
                        result.push({dados: [], legenda: this.util.formatarDataUS(item.descricao, "dd/MM/yyyy")});
                       this.labelsOcorrenciasFinalizadasUltimosDias.push(this.util.formatarDataUS(item.descricao, "dd/MM/yyyy"));
                       this.legendaOcorrenciasFinalizadasUltimosDias.push(this.util.formatarDataUS(item.descricao, "dd/MM/yyyy"));
                    }
                    abertos.push(item.abertos);
                    finalizados.push(item.finalizados);
                    resposta.push(item);
                });

        }).then(() => {
            this.dadosOcorrenciasFinalizadasUltimosDias = [];
            this.dadosOcorrenciasFinalizadasUltimosDias.push({ data: abertos, label: "Abertos" });
            this.dadosOcorrenciasFinalizadasUltimosDias.push({ data: finalizados, label: "Finalizados" });
        }).catch((err) => {
            console.log("Err obterOcorrenciasFinalizadosUltimosCincoDias" + err);
        });
    }

    obterTarefasFinalizadasUltimosDias() {
        this.labelsTarefasFinalizadasUltimosDias = [];
        this.dadosTarefasFinalizadasUltimosDias = [];
        let resposta: any[] = [];
        let abertos: number[] = [];
        let finalizados: number[] = [];
        let result: {dados: number[], legenda: string}[] = [];
        this.service.obterTarefasFinalizadosPorData(this.request).then((response) => {
                response.sort((a, b) => {
                    if (a.descricao > b.descricao) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                response.forEach((item) => {
                    if (!this.legendaFinalizadasUltimosDias.find((key) => key === item.descricao)) {
                        result.push({dados: [], legenda: this.util.formatarDataUS(item.descricao, "dd/MM/yyyy")});
                       this.labelsTarefasFinalizadasUltimosDias.push(this.util.formatarDataUS(item.descricao, "dd/MM/yyyy"));
                       this.legendaFinalizadasUltimosDias.push(this.util.formatarDataUS(item.descricao, "dd/MM/yyyy"));
                    }
                    abertos.push(item.abertos);
                    finalizados.push(item.finalizados);
                    resposta.push(item);
                });

        }).then(() => {
            this.dadosTarefasFinalizadasUltimosDias = [];
            this.dadosTarefasFinalizadasUltimosDias.push({ data: abertos, label: "Abertos" });
            this.dadosTarefasFinalizadasUltimosDias.push({ data: finalizados, label: "Finalizados" });
        }).catch((err) => {
            console.log("Err obterTarefasFinalizadosPorData" + err);
        });
    }

    obterTarefasEmDesenvolvimentoPorTecnico() {
        this.labelsTarefasEmDesenvolvimentoTecnico = [];
        this.dadosTarefasEmDesenvolvimentoTecnico = [];
        this.service.obterTarefasEmDesenvolvimentoPorTecnico(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsTarefasEmDesenvolvimentoTecnico.push(item.descricao);
                this.dadosTarefasEmDesenvolvimentoTecnico.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterTarefasEmDesenvolvimentoPorTecnico" + err);
        });
    }

    obterTarefasFinalizadasPorTecnico() {
        this.labelsTarefasFinalizadasTecnico = [];
        this.dadosTarefasFinalizadasTecnico = [];
        this.service.obterTarefasFinalizadasPorTecnico(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsTarefasFinalizadasTecnico.push(item.descricao);
                this.dadosTarefasFinalizadasTecnico.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterTarefasFinalizadasPorTecnico" + err);
        });
    }

    obterTarefasEmDesenvolvimentoFuncionalidade() {
        this.labelsTarefasEmDesenvolvimentoFuncionalidade = [];
        this.dadosTarefasEmDesenvolvimentoFuncionalidade = [];
        this.service.obterTarefasEmDesenvolvimentoFuncionalidade(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsTarefasEmDesenvolvimentoFuncionalidade.push(item.descricao);
                this.dadosTarefasEmDesenvolvimentoFuncionalidade.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterTarefasEmDesenvolvimentoFuncionalidade" + err);
        });
    }

    obterOcorrenciasPorProduto() {
        this.labelsOcorrenciasNaoDistribuidos = [];
        this.dadosOcorrenciasNaoDistribuidos = [];
        this.service.obterOcorrenciasNaoDistribuidasPorCliente(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsOcorrenciasNaoDistribuidos.push(item.descricao);
                this.dadosOcorrenciasNaoDistribuidos.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterOcorrenciasPorProduto" + err);
        });
    }

    obterOcorrenciasNaoDistribuidasPorCliente() {
        this.labelsOcorrenciasNaoDistribuidos = [];
        this.dadosOcorrenciasNaoDistribuidos = [];
        this.service.obterOcorrenciasNaoDistribuidasPorCliente(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsOcorrenciasNaoDistribuidos.push(item.descricao);
                this.dadosOcorrenciasNaoDistribuidos.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterOcorrenciasNaoDistribuidasPorCliente" + err);
        });
    }

    obterAguardandoAtualizacaoPorCliente() {
        this.labelsOcorrenciasAguardandoAtualizacaoPorCliente = [];
        this.dadosOcorrenciasAguardandoAtualizacaoPorCliente = [];
        let painelRequestPorStatus = Object.assign({}, this.request);
        painelRequestPorStatus.status = ['AA','AB','AP','HA','HB','HC','HP','VA','VB','VP'];
        this.service.obterOcorrenciasPorStatusSelecionado(painelRequestPorStatus).then((response) => {
            response.forEach((item) => {
                this.labelsOcorrenciasAguardandoAtualizacaoPorCliente.push(item.descricao);
                this.dadosOcorrenciasAguardandoAtualizacaoPorCliente.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterAguardandoAtualizacaoPorCliente" + err);
        });
    }
    obterAguardandoAtualizacaoViabilidade() {
        this.labelsOcorrenciasAguardandoViabilidade = [];
        this.dadosOcorrenciasAguardandoViabilidade = [];
        let painelRequestPorStatus = Object.assign({}, this.request);
        painelRequestPorStatus.status = ['AV'];
        this.service.obterOcorrenciasPorStatusSelecionado(painelRequestPorStatus).then((response) => {
            response.forEach((item) => {
                this.labelsOcorrenciasAguardandoViabilidade.push(item.descricao);
                this.dadosOcorrenciasAguardandoViabilidade.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterAguardandoAtualizacaoViabilidade" + err);
        });
    }

    obterOcorrenciasEmDesenvolvimentoPorCliente() {
        this.labelsOcorrenciasEmDesenvolvimentoCliente = [];
        this.dadosOcorrenciasEmDesenvolvimentoCliente = [];
        this.service.obterOcorrenciasEmDesenvolvimentoPorCliente(this.request).then((response) => {
            response.forEach((item) => {
                this.labelsOcorrenciasEmDesenvolvimentoCliente.push(item.descricao);
                this.dadosOcorrenciasEmDesenvolvimentoCliente.push(item.valor);
            });
        }).catch((err) => {
            console.log("Err obterOcorrenciasEmDesenvolvimentoPorCliente" + err);
        });
    }

}
