import { Component, OnInit } from "@angular/core";
import { IonicPage, LoadingController } from "ionic-angular";
import { SmAlertController } from "../../components/sm-alert-controller/sm-alert-controller.component";
import { OcorrenciaGsm } from "../../objects/entidades/OcorrenciaGsm";
import { Tuple } from "../../objects/entidades/Tuple";
import { OcorrenciaGsmService } from "../../services/OcorrenciaGsmService";
import { OcorrenciaProdutoService } from "../../services/OcorrenciaProdutoService";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { Util } from "../../services/util/Util";
import { OcorrenciaGsmVersao } from "../../objects/entidades/OcorrenciaGsmVersao";

@IonicPage()
@Component({
    selector: "app-controle-tarefa",
    templateUrl: "controle-tarefa.html",
    styleUrls: ["controle-tarefa.scss"]
})
export class ControleTarefaComponent implements OnInit {

    usuario = GerenciadorSessao.usuario;
    ocorrencias: OcorrenciaGsm[] = [];
    ocorrenciasSelecionadas: OcorrenciaGsm[] = [];
    ocorrencia: OcorrenciaGsm;
    page: number = 1;
    listFiltroTecnico: Tuple[] = [];
    listFiltroProduto: Tuple[] = [];
    listFiltroSeveridade: Tuple[] = [];
    listFiltroFuncionalidade: Tuple[] = [];
    listFiltroCliente: Tuple[] = [];
    listFiltroSolicitante: Tuple[] = [];
    listFiltroPrioridade1: Tuple[] = [];
    listFiltroPrioridade2: Tuple[] = [];
    listFiltroStatus: Tuple[] = [];
    listFiltroModalidade: Tuple[] = [];
    listSelecaoTecnico: Tuple[] = [];
    listSelecaoProduto: Tuple[] = [];
    listSelecaoSeveridade: Tuple[] = [];
    listSelecaoFuncionalidade: Tuple[] = [];
    listSelecaoCliente: Tuple[] = [];
    listSelecaoSolicitante: Tuple[] = [];
    listSelecaoPrioridade1: Tuple[] = [];
    listSelecaoPrioridade2: Tuple[] = [];
    listSelecaoStatus: Tuple[] = [];
    listSelecaoModalidade: Tuple[] = [];
    listComplexidade = [
        {descricao: "Baixa", sigla: "B"},
        {descricao: "Média", sigla: "M"},
        {descricao: "Alta", sigla: "A"}
    ];
    listStatus = [
        {descricao: "Aguardando Viabilidade", sigla: "AV"},
        {descricao: "Aguardando Atualização Alpha", sigla: "AA"},
        {descricao: "Gerando Versão Alpha", sigla: "VA"},
        {descricao: "Em Homologação Alpha", sigla: "HA"},
        {descricao: "Gerando Versão Beta", sigla: "VB"},
        {descricao: "Aguardando Atualização Beta", sigla: "AB"},
        {descricao: "Em Homologação Beta", sigla: "HB"},
        {descricao: "Em Homologação Cliente", sigla: "HC"},
        {descricao: "Aguardando Atualização Produção", sigla: "AP"},
        {descricao: "Gerando Versão Produção", sigla: "VP"},
        {descricao: "Duplicada", sigla: "TD"},
        {descricao: "Finalizada", sigla: "TF"},
        {descricao: "Inviabilizada", sigla: "TI"},
        {descricao: "Aguardando Definição Contratual", sigla: "AC"},
        {descricao: "Aguardando Distribuição", sigla: "AD"},
        {descricao: "Em desenvolvimento", sigla: "DE"},
        {descricao: "Aguardando Regularização dos Pagamentos", sigla: "AR"},
        {descricao: "Aguardando Informações do Cliente", sigla: "AI"},
        {descricao: "Em Análise", sigla: "EA"},
    ];
    listTipoOcorrenciaInterna = [
        {label: "Todas", valor: null},
        {label: "Sim", valor: true},
        {label: "Não", valor: false}
    ];
    tipoOcorrenciaInterna;
    totalOcorrencia: number;
    novaOcorrencia: boolean;
    temp: OcorrenciaGsm[];
    dtInicio: any;
    dtFim: any;
    filtroPesquisaRapida: any;
    gerarBuild: OcorrenciaGsmVersao;
    tipoAtualizacao: string;
    exibeDescricao;
    realocar: boolean;
    disabledTecnico: boolean;

    constructor(
        private ocorrenciaService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private smAlert: SmAlertController,
        private util: Util,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
    ) {}

    ngOnInit(): void {
        this.setarDefaultPesquisa();
        this.obterOcorrencia();
    }

    setarDefaultPesquisa() {
        const listStatusTarefaExterna = ['AR', 'AC', 'TI', 'TF', 'TD', 'AV', 'OD', 'AI'];
        this.listStatus.forEach(item => {
            this.listFiltroStatus.push(new Tuple(item.descricao, item.sigla));
            if (listStatusTarefaExterna.indexOf(item.sigla) < 0) {
                this.listSelecaoStatus.push(new Tuple(item.descricao, item.sigla));
            }
        });
        this.listFiltroStatus.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
        this.tipoOcorrenciaInterna = this.listTipoOcorrenciaInterna.find(t => t.valor === false);
        this.disabledTecnico = this.usuario.funcionario && !this.usuario.inSituacao;
        if (this.disabledTecnico) {
            this.listFiltroTecnico.push(new Tuple(this.usuario.nome, this.usuario.idUsuario));
            this.listSelecaoTecnico.push(new Tuple(this.usuario.nome, this.usuario.idUsuario));
        }
    }

    obterOcorrencia() {
        if (this.listSelecaoStatus.length) {
            const load = this.loadingCtrl.create({
                content: "Aguarde..."
            });
            load.present().then(() => {
                try {
                    const filtros = this.popularFiltrosEnvio();
                    this.ocorrenciaService.obter(filtros)
                    .then(resp => {
                        // console.log('ocorrenciaService.obter...1', resp);
                        this.ocorrencias = resp;
                        this.corrigirVariaveis();
                    }).then(() => {
                        // console.log('ocorrenciaService.obter...2', this);
                        this.popularFiltros();
                        this.ocorrenciasSelecionadas = [];
                    }).then(() => {
                        // console.log('Terminou...', this);
                        this.page = 1;
                        load.dismiss();
                        this.totalOcorrencia = this.ocorrencias.length;
                    }).catch(erro => {
                        console.log('ERRO', erro);
                        load.dismiss();
                    });
                } catch (erro) {
                    load.dismiss();
                    console.error(erro);
                }
            });
        } else {
            this.smAlert.info("Informação", "Adicionar filtro de status!");
        }
    }

    private popularFiltrosEnvio() {
        return {
            clientes: Array.from(new Set(this.listSelecaoCliente.map(o => o.select))),
            produtos: Array.from(new Set(this.listSelecaoProduto.map(o => o.select))),
            funcionalidades: Array.from(new Set(this.listSelecaoFuncionalidade.map(o => o.select))),
            solicitantes: Array.from(new Set(this.listSelecaoSolicitante.map(o => o.select))),
            prioridades1: Array.from(new Set(this.listSelecaoPrioridade1.map(o => o.select))),
            prioridades2: Array.from(new Set(this.listSelecaoPrioridade2.map(o => o.select))),
            status: Array.from(new Set(this.listSelecaoStatus.map(o => o.select))),
            severidades: Array.from(new Set(this.listSelecaoSeveridade.map(o => o.select))),
            desenvolvedores: Array.from(new Set(this.listSelecaoTecnico.map(o => o.select))),
            modalidades: Array.from(new Set(this.listSelecaoModalidade.map(o => o.select))),
            dataInicial: this.dtInicio,
            dataFinal: this.dtFim,
            inOcorrenciaInterna: this.tipoOcorrenciaInterna.valor,
        };
    }

    private corrigirVariaveis() {
        this.ocorrencias.forEach(item => {
            item.dtSolicitacao = this.util.stringToDate(String(item.dtSolicitacao));
            if (item.dtConclusao) {
                item.dtConclusao = this.util.stringToDate(String(item.dtConclusao)).toLocaleDateString();
            }
            if (item.dtAlteracao) {
                item.dtAlteracao = this.util.stringToDate(String(item.dtAlteracao));
            }
        });
        this.temp = Object.assign([], this.ocorrencias);
    }

    popularFiltros() {
        this.popularFiltroProduto();
        this.popularFiltroFuncionalidade();
        this.popularFiltroCliente();
        this.popularFiltroSolicitante();
        this.popularFiltroPrioridade();
        this.popularFiltroSeveridade();
        this.popularFiltroTecnico();
        this.popularFiltroModalidade();
    }

    popularFiltroFuncionalidade() {
        this.listFiltroFuncionalidade = Array.from(new Set(this.ocorrencias.map(o => o.cdFuncionalidade)))
            .map(idFuncionalidade => {
                return new Tuple(this.ocorrencias.find(o => o.cdFuncionalidade === idFuncionalidade).dsFuncionalidade, idFuncionalidade);
            });
        this.listFiltroFuncionalidade.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroProduto() {
        this.listFiltroProduto = Array.from(new Set(this.ocorrencias.map(o => o.cdProduto)))
            .map(idProduto => {
                return new Tuple(this.ocorrencias.find(o => o.cdProduto === idProduto).dsProduto, idProduto);
            });
        this.listFiltroProduto.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroCliente() {
        this.listFiltroCliente = Array.from(new Set(this.ocorrencias.map(o => o.cdCliente)))
            .map(idCliente => {
                return new Tuple(this.ocorrencias.find(o => o.cdCliente === idCliente).dsCliente, idCliente);
            });
        this.listFiltroCliente.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroSolicitante() {
        this.listFiltroSolicitante = Array.from(new Set(this.ocorrencias.map(o => o.cdUsuarioSolicitante)))
            .filter(idSolicitante => Boolean(idSolicitante))
            .map(idSolicitante => {
                return new Tuple(this.ocorrencias.find(o => o.cdUsuarioSolicitante === idSolicitante).dsUsuarioSolicitante, +idSolicitante);
            });
        this.listFiltroSolicitante.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroPrioridade() {
        this.listFiltroPrioridade1 = Array.from(new Set(this.ocorrencias.map(o => o.nrPrioridade1)))
            .map(prioridade => {
                return new Tuple('Nível ' + this.ocorrencias.find(o => o.nrPrioridade1 === prioridade).nrPrioridade1, prioridade);
            });
        this.listFiltroPrioridade1.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
        this.listFiltroPrioridade2 = Array.from(new Set(this.ocorrencias.map(o => o.nrPrioridade2)))
            .map(prioridade => {
                return new Tuple('Nível ' + this.ocorrencias.find(o => o.nrPrioridade2 === prioridade).nrPrioridade2, prioridade);
            });
        this.listFiltroPrioridade2.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroStatus() {
        this.listFiltroStatus = Array.from(new Set(this.ocorrencias.map(o => o.inStatus)))
            .filter(status => Boolean(status))
            .map(status => {
                return new Tuple(this.listStatus.find(o => o.sigla === status).descricao, status);
            });
        this.listFiltroStatus.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    popularFiltroSeveridade() {
        this.listFiltroSeveridade = Array.from(new Set(this.ocorrencias.map(o => o.cdNivelSeveridade)))
            .filter(idSeveridade => Boolean(idSeveridade))
            .map(idSeveridade => {
                return new Tuple(this.ocorrencias.find(o => o.cdNivelSeveridade === idSeveridade).dsNivelSeveridade, idSeveridade);
            });
        this.listFiltroSeveridade.sort(function(a, b) {
            return a.select < b.select ? -1 : 1;
        });
    }

    private listDistribuicoes() {
        const matriz = Array.from(new Set(this.ocorrencias.map(ocr => ocr.distribuicoes)))
            .filter(dist => Boolean(dist))
            .map(dist => {
                return dist;
            });
        let list = [];
        matriz.forEach(element => {
            for (let i = 0; i < element.length; i++) {
                list.push(element[i]);
            }
        });
        return list;
    }

    popularFiltroTecnico() {
        const distribuicoes = this.listDistribuicoes();
        this.listFiltroTecnico = Array.from(new Set(distribuicoes.map(d => d.cdUsuarioAtendimento)))
            .filter(cdUsuarioAtendimento => Boolean(cdUsuarioAtendimento))
            .map(cdUsuarioAtendimento => {
            return new Tuple(distribuicoes.find(d => d.cdUsuarioAtendimento === cdUsuarioAtendimento).dsUsuarioAtendimento, +cdUsuarioAtendimento);
        });
        this.listFiltroTecnico.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }


    popularFiltroModalidade() {
        const distribuicoes = this.listDistribuicoes();
        this.listFiltroModalidade = Array.from(new Set(distribuicoes.map(d => d.cdTipoTarefa)))
            .filter(cdTipoTarefa => Boolean(cdTipoTarefa))
            .map(cdTipoTarefa => {
            return new Tuple(distribuicoes.find(d => d.cdTipoTarefa === cdTipoTarefa).tipoTarefa, cdTipoTarefa);
        });
        this.listFiltroModalidade.sort(function(a, b) {
            return a.show < b.show ? -1 : 1;
        });
    }

    addOrDelAllOcorrencia() {
        if (this.ocorrencias.length === this.ocorrenciasSelecionadas.length) {
            this.ocorrenciasSelecionadas = [];
        } else {
            this.ocorrenciasSelecionadas = <any> JSON.parse(JSON.stringify(this.ocorrencias));
        }
    }

    addOrDelOcorrencia(o: OcorrenciaGsm) {
        if (this.ocorrenciasSelecionadas) {
            const index = this.ocorrenciasSelecionadas.findIndex(x => x.idOcorrencia === o.idOcorrencia);
            if (index > -1) {
                this.ocorrenciasSelecionadas.splice(index, 1);
            } else {
                this.ocorrenciasSelecionadas.push(o);
            }
        }
    }

    limparFiltros() {
        this.listSelecaoProduto = [];
        this.listSelecaoFuncionalidade = [];
        this.listSelecaoCliente = [];
        this.listSelecaoSolicitante = [];
        this.listSelecaoPrioridade1 = [];
        this.listSelecaoPrioridade2 = [];
        this.listSelecaoStatus = [];
        this.listSelecaoSeveridade = [];
        if (!this.disabledTecnico) {
            this.listSelecaoTecnico = [];
        }
        this.listSelecaoModalidade = [];
        this.filtroPesquisaRapida = null;
    }

    fechar() {
        this.ocorrencia = null;
    }

    ocorrenciaSelecionada(o: OcorrenciaGsm): boolean {
        let obj = this.ocorrenciasSelecionadas.find(x => x.idOcorrencia === o.idOcorrencia);
        if (obj) {
            return  true;
        } else {
            return false;
        }
    }

    obterComplexidade(tipo) {
        const complexidade = this.listComplexidade.find(o => o.sigla === tipo);
        if (complexidade) {
            return complexidade.descricao;
        } else {
            return '-';
        }
    }

    obterCorSeveridade(tipo) {
        switch (tipo) {
            case 'NORMAL':
                return 'info';
            case 'URGENTE':
                return 'warning';
            case 'CRITICO':
                return 'danger';
            default:
                return 'default';
        }
    }

    obterCorComplexidade(tipo) {
        switch (tipo) {
            case 'B':
                return 'info';
            case 'M':
                return 'warning';
            case 'A':
                return 'danger';
            default:
                return 'default';
        }
    }

    refreshGrid(refresh) {
        this.novaOcorrencia = false;
        if (refresh) {
            this.obterOcorrencia();
        }
    }

    pesquisaRapida(ev) {
        const val = ev.target.value;
        if (val && val.trim() !== "") {
            this.ocorrencias = this.temp.filter(item => {
                return (
                    (item.dsOcorrencia && item.dsOcorrencia.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.dsProduto && item.dsProduto.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.dsCliente && item.dsCliente.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.dsFuncionalidade && item.dsFuncionalidade.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.dsStatus && item.dsStatus.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.idOcorrencia && String(item.idOcorrencia).toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.dsUsuarioSolicitante && item.dsUsuarioSolicitante.toLowerCase().indexOf(val.toLowerCase()) > -1)
                );
            });
        } else if (!val) {
            this.ocorrencias = this.temp;
        }
    }

    gerarCsv() {
        const load = this.loadingCtrl.create({
            content: "Buscando Ocorrências..."
        });
        load.present().then(() => {
            const filtros = this.popularFiltrosEnvio();
            this.ocorrenciaProdutoService.gerarCsvWS(filtros)
            .then(() => {
                load.dismiss();
            }).catch(err => {
                console.error("ERRO", err);
                load.dismiss();
            });
        });
    }

    public gerarVersao() {
        this.gerarBuild = new OcorrenciaGsmVersao();
        this.ocorrenciasSelecionadas.forEach(o => {
            this.gerarBuild.idOcorrencia.push(o.idOcorrencia);
            this.gerarBuild.cdProduto = o.cdProduto;
            this.gerarBuild.versao = o.inStatus;
        });
        switch (this.gerarBuild.versao) {
            case "AA":
                this.gerarBuild.versao = "A";
                this.gerarBuildCod(this.gerarBuild);
                break;
            case "AB":
                this.gerarBuild.versao = "B";
                this.gerarBuildCod(this.gerarBuild);
                break;
            case "AP":
                this.gerarBuild.versao = "P";
                break;
        }
    }

    private gerarBuildCod(gerarBuild: OcorrenciaGsmVersao) {
        const load = this.loadingCtrl.create({
            content: 'Aguarde o merge do Código...'
        });
        load.present().then(() => {
            this.ocorrenciaService.gerarVersao(gerarBuild)
            .then(res => {
                this.smAlert.sucesso("", res.msgResponse);
                this.refreshGrid(true);
                load.dismiss();
            }).catch(err => {
                load.dismiss();
                this.smAlert.error("", "Não foi possível atualizar a versão." + JSON.stringify(err.msgResponse));
            });
        }).catch(err => {
            load.dismiss();
        });
    }

    checkListMerge(): boolean {
        if (this.ocorrenciasSelecionadas && this.ocorrenciasSelecionadas.length) {
            if (this.ocorrenciasSelecionadas && this.ocorrenciasSelecionadas.length) {
                const listStatus = this.ocorrenciasSelecionadas.filter(a => a.inStatus === 'AA' || a.inStatus === 'AB');
                const listOutros = this.ocorrenciasSelecionadas.filter(a => a.inStatus !== 'AA' && a.inStatus !== 'AB');
                if (!listOutros.length) {
                    const status = listStatus.find(a => a.inStatus === 'AA' || a.inStatus === 'AB');
                    const [, , dsStatus] = status.dsStatus.split(" ");
                    this.tipoAtualizacao = dsStatus;
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    alterarTecnico() {
        this.realocar = !this.realocar;
    }
}
