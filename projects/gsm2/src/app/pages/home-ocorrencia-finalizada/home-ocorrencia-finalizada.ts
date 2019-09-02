import { Component, EventEmitter, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { process } from "@progress/kendo-data-query";
import { AlertController, IonicPage, LoadingController } from "ionic-angular";
import * as $ from "jquery";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { FuncionalidadeService } from "projects/gsm2/src/app/services/FuncionalidadeService";
import { FiltrosPesquisa } from "../../components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component";
import { SmAlertController } from "../../components/sm-alert-controller/sm-alert-controller.component";
import { Historico } from "../../objects/entidades/Historico";
import { OcorrenciaTipo } from "../../objects/entidades/OcorrenciaTipo";
import { Tuple } from "../../objects/entidades/Tuple";
import { Usuario } from "../../objects/entidades/Usuario";
import { OcorrenciaGsmService } from "../../services/OcorrenciaGsmService";
import { OcorrenciaProdutoService } from "../../services/OcorrenciaProdutoService";
import { OcorrenciaService } from "../../services/OcorrenciaService";
import { Util } from "../../services/util/Util";
import { GridGenericaCustomizado } from "./../..//components/web-corporativo/includes/grids/grid-generica/grid-generica";
import { AppGsmModule } from "./../../app.gsm.module";
import { Masks } from "./../../components/validators/masks";
import { Ocorrencia, OcorrenciaAnexo } from "./../../objects/entidades/Ocorrencia";
import { AuthService } from "./../../services/AuthService";
import { GerenciadorSessao } from "./../../services/util/GerenciadorSessao";
import { GridDataResult, SelectableMode, SelectableSettings, PageChangeEvent, RowArgs } from "@progress/kendo-angular-grid";
import { OcorrenciaTipoService } from "../../services/OcorrenciaTipoService";
import { OcorrenciaGsm } from "../../objects/entidades/OcorrenciaGsm";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
@IonicPage()
@Component({
    // tslint:disable-next-line:component-selector
    selector: "page-home-ocorrencia-finalizada",
    templateUrl: "home-ocorrencia-finalizada.html",
    styleUrls: ["home-ocorrencia-finalizada.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class HomeOcorrenciaFinalizadaPage implements OnInit {

    cores = ["#b71c1c", "#f57f17", "#01579b", "#1b5e20"];
    prioridades = ["Máxima", "Alta", "Média", "Baixa"];
    onCpfCnpjChange = new EventEmitter();
    mask: Masks;
    cdOcorrencia: number;
    texto_filtrar: string;
    mostrar: Boolean;
    gridCustomizado: GridGenericaCustomizado[];
    resultado: Boolean = false;
    chamados: Array<Ocorrencia> = [];
    chamadosTemp: Array<Ocorrencia> = [];
    listaOcorrencias: Array<any> = [];
    usuario: Usuario;
    status: { label: string; valor: string; cor: string };
    listStatus: { label: string; valor: string; cor: string }[] = [];
    dsPesq = "";
    dtInicio: string;
    dtFim: string;

    idOcorrencia: number;
    idOcorrenciaHistorico: number;
    descricaoHistorico: string;
    cdUsuarioAtendimento: string;

    idOcorrenciaAnexo: number;
    upAnexo: string;
    downAnexo: string;
    dsAnexo: string;
    dsExtensao: string;

    produtos: Tuple[];
    tiposOcorrencia: OcorrenciaTipo[];
    ocorrencia: Ocorrencia = new Ocorrencia();

    labelProduto: String;
    labelTipoOcorrencia: String;
    reqMsgProd: string;
    reqMsgTipo: string;
    reqMsgDesc: string;
    reqMsgReabertura: string;
    produto: String;
    labelProdutoPainel: String;
    produtosPainel: { label: string; valor: string; cor: string }[];
    gridView: GridDataResult;
    pageSize = 15;
    skip = 0;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Descreva aqui o problema...',
        translate: 'yes',
        uploadUrl: 'arquivos/images', // if needed
        customClasses: [ // optional
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ]
    };
    listAguardAt = [];
    listDesenvolvimento = [];
    listHomoBeta = [];
    listGerandoVersaoAlfa = [];
    listAguardViab = [];
    listAguardDist = [];
    listSolicitante: Tuple[] = null;
    listStatusView: any[] = [];
    ocorrenciaSiapec3 = true;
    maxPrioridadeFP: number;
    minPrioridadeFP: number;
    maxPrioridadeGP: number;
    minPrioridadeGP: number;
    public checkboxOnly = true;
    public mode: SelectableMode = 'multiple';
    public selectableSettings: SelectableSettings;
    public mySelection: number[] = [];
    nrPrioridade: number = 0;
    filtrosPesquisa: FiltrosPesquisa = new FiltrosPesquisa();

    constructor(
        private loadingCtrl: LoadingController,
        private loading: Ng4LoadingSpinnerService,
        private ocorrenciaService: OcorrenciaService,
        private funcionalidadeService: FuncionalidadeService,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private router: Router,
        private util: Util,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private alertCtrl: AlertController
    ) {
        // console.log('constructor...', this);
        this.setSelectableSettings();
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).gtag("set", "page", event.urlAfterRedirects);
                (<any>window).gtag("send", "pageview");
            }
        });
        this.gridCustomizado = [];
        this.usuario = GerenciadorSessao.usuario;
        this.allData = this.allData.bind(this);
    }

    ngOnInit() {
        // console.log("ngOnInit...");
        this.texto_filtrar = "";
        if (this.ocorrenciaSiapec3) {
            // this.status = { label: "Em desenvolvimento", valor: "DE", cor: "info" };
            this.status = { label: "Tarefa Finalizada...", valor: "TF", cor: "info" };
            this.obterStatusSiapec3();
        } else {
            this.status = { label: "Em Atendimento", valor: "E", cor: "info" };
            this.obterStatus();
        }
        this.filtrarPorStatus(this.status);
        this.produtosPainel = [];
        this.obterProdutoPainel();
        this.obterProdutoFiltroPainelPrincipal();
        this.novaOcorrencia();
    }

    obterProduto() {
        // this.ocorrenciaProdutoService.obterOcorrenciasProduto(GerenciadorSessao.usuario.nrDocumento)
        this.ocorrenciaProdutoService.obterProdutos(GerenciadorSessao.usuario.cdCliente)
            .then(resposta => {
                // console.log('obterOcorrenciasProduto...', resposta);
                // this.produtos = [];
                resposta.forEach(item => {
                    // console.log("item: ", JSON.stringify(item));
                    this.produtos.push(new Tuple(item.dsSigla, item.idProdutoServico));
                });
            }).then(() => {
                if (this.produtos && this.produtos.length > 1) {
                    this.labelProduto = "Selecione...";
                    this.labelTipoOcorrencia = "Selecione...";
                    // console.log('obterProduto... > 1');
                } else if (this.produtos && this.produtos.length === 1) {
                    // console.log('obterProduto...1');
                    this.labelProduto = this.produtos[0].show;
                    this.setProduto(this.produtos[0].select);
                }
            });
    }

    aumentarPrioridade(idOcorrencia, prioridade) {
        if (prioridade == 0) {
            this.alertCtrl.create({
                subTitle: 'A prioridade já encontra-se em seu nível máximo',
                title: 'Aviso',
                buttons: ['Ok']
            }).present();
        } else {
            this.editarPrioridade(idOcorrencia, prioridade - 1);
        }
    }

    diminuirPrioridade(idOcorrencia, prioridade) {
        if (prioridade == 3) {
            this.alertCtrl.create({
                subTitle: 'A prioridade já encontra-se em seu nível mínimo',
                title: 'Aviso',
                buttons: ['Ok']
            }).present();
        } else {
            this.editarPrioridade(idOcorrencia, prioridade + 1);
        }
    }

    editarPrioridade(idOcorrencia, novaPrioridade) {
        const load = this.loadingCtrl.create({
            content: "Atualizando Prioridade..."
        });
        load.present().then(() => {
            const obj = {
                ids: [idOcorrencia],
                nrPrioridade: novaPrioridade,
                gerente: GerenciadorSessao.usuario.inGerenteProjeto
            };
            this.ocorrenciaGsmService.editarPrioridadeCliente(obj).then(resp => {
                if (resp) {
                    this.filtrarPorStatus(this.status);
                }
                load.dismiss();
                AppGsmModule.injector.get(SmAlertController).sucesso("", resp.msgResponse);
            }).catch(erro => {
                AppGsmModule.injector.get(SmAlertController).error("", erro.msgResponse);
                load.dismiss();
            });
        }).catch(erro => {
            load.dismiss();
        });
    }

    obterProdutoPainel() {
        this.ocorrenciaProdutoService.obterProdutos(GerenciadorSessao.usuario.cdCliente)
        // this.ocorrenciaProdutoService.obterOcorrenciasProduto(GerenciadorSessao.usuario.nrDocumento)
            .then(resposta => {
                // console.log('obterOcorrenciasProduto...', resposta);
                // this.produtos = [];
                resposta.forEach(item => {
                    // console.log("item: ", JSON.stringify(item));
                    this.produtosPainel.push({
                        label: item.dsSigla,
                        valor: String(item.idProdutoServico),
                        cor: this.obterCorProduto(item.dsSigla)
                    });
                });
            }).then(() => {
                if (this.produtosPainel && this.produtosPainel.length > 1) {
                    this.labelProdutoPainel = "Selecione...";
                } else if (this.produtosPainel && this.produtosPainel.length === 1) {
                    this.labelProdutoPainel = this.produtosPainel[0].label;
                    this.setProdutoPainelPrincipal(this.produtosPainel[0].valor);
                }
            });
    }

    obterCorProduto(sigla): string {
        if (sigla === "SIAPEC1") {
            return "success";
        } else if (sigla === "SIAPEC3") {
            return "warning";
        } else {
            return "primary";
        }
    }

    obterProdutoFiltro() {
        this.ocorrenciaProdutoService.obterProdutos(this.usuario.cdCliente)
            .then(resposta => {
                // this.produtos = [];
                resposta.forEach(item => {
                    this.produtos.push(new Tuple(item.valor, item.codigo));
                });
            }).then(() => {
                if (this.produtos && this.produtos.length > 1) {
                    this.labelProduto = "Selecione...";
                    this.labelTipoOcorrencia = "Selecione...";
                    // console.log('obterProduto... > 1');
                } else if (this.produtos && this.produtos.length === 1) {
                    // console.log('obterProduto...1');
                    this.labelProduto = this.produtos[0].show;
                    this.setProduto(this.produtos[0].select);
                }
            });
    }

    obterProdutoFiltroPainelPrincipal() {
        this.ocorrenciaProdutoService.obterProdutos(this.usuario.cdCliente)
            .then(resposta => {
                // this.produtos = [];
                resposta.forEach(item => {
                    this.produtosPainel.push({
                        label: item.valor,
                        valor: String(item.codigo),
                        cor: this.obterCorProduto(item.valor)
                    });
                });
            }).then(() => {
                if (this.produtosPainel && this.produtosPainel.length > 1) {
                    this.labelProdutoPainel = "Selecione...";
                } else if (
                    this.produtosPainel &&
                    this.produtosPainel.length === 1
                ) {
                    // console.log('obterProduto...1');
                    this.labelProdutoPainel = this.produtosPainel[0].label;
                    this.setProdutoPainelPrincipal(
                        this.produtosPainel[0].valor
                    );
                }
            });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    }

    cadastrar() {
        this.router.navigate(["/registrar"]);
    }

    isValid() {
        if (this.usuario.nrDocumento) {
            return true;
        } else {
            return false;
        }
    }

    exibirCamposFiltro() {
        this.limpar();
        this.resultado = false;
    }

    carregarWS() {
        const load = this.loadingCtrl.create({
            content: "Processando..."
        });
        load.present().then(() => {
            this.ocorrenciaService.obterOcorrencias(GerenciadorSessao.usuario.nrDocumento)
                .then(resp => {
                    this.chamados = resp;
                    if (this.chamados && this.chamados.length > 0) {
                        this.chamados.forEach(item => {
                            item["exibe"] = false;
                            item.dtAbertura = new Date(
                                item.dtAbertura
                            ).toLocaleDateString();
                            item["cor"] = this.obterCor(item.inStatus);
                            if (this.listStatus.length === 0 || !this.listStatus.find(a => a.valor === item.inStatus)) {
                                this.listStatus.push(this.converterStatus(item.inStatus, item.status));
                            }
                            if (item.listHistorico && item.listHistorico.length > 0) {
                                item.listHistorico.forEach(hist => {
                                    hist.dtInicioAtendimento = new Date(hist.dtInicioAtendimento).toLocaleDateString();
                                    hist.dtFinalAtendimento = new Date(hist.dtFinalAtendimento).toLocaleDateString();
                                });
                            }
                            this.chamadosTemp.push(item);
                        });
                        load.dismiss();
                    }
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    popularSolicitante(item): Tuple[] {
        if (!this.listSolicitante) {
            this.listSolicitante = [];
        }
        let encontrou = this.listSolicitante.find(p => (p.select === item.usuario.idUsuario));
        if (item.usuario.idUsuario && item.usuario.nome && !item.usuario.funcionario && !encontrou) {
            this.listSolicitante.push(new Tuple(item.usuario.nome, item.usuario.idUsuario));
        }
        this.listSolicitante.sort();
        return this.listSolicitante;
    }

    solicitanteSelecionado() {
        return this.ocorrenciaGsmService.filtrarOcorrenciaGsm(this.filtrosPesquisa).then((chama) => {
            this.populaOcorrencia(chama, this.status.valor);
        });
    }

    converterStatus(inStatus: string, status: string): any {
        let label: string;
        let valor: string;
        let cor: string;
        if (inStatus === "AD" || inStatus === "DE" || inStatus === "AA" || inStatus === "VA" || inStatus === "HO" || inStatus === "AB" ||
            inStatus === "VB" || inStatus === "HB") {
            label = "Em Atendimento";
            valor = "E";
            cor = this.obterCor(valor);
        } else {
            label = status;
            valor = inStatus;
            cor = this.obterCor(valor);
        }
        return { label: label, valor: valor, cor: cor };
    }

    obterCor(status): string {
        if (status === "F" || status === "TF") {
            return "success";
        } else if (status === "P" || status === "AA") {
            return "warning";
        } else if (status === "U" || status === "TD" || status === "TI") {
            return "danger";
        } else if (status === "E" || status === "H" || status === "Y") {
            return "primary";
        } else {
            return "primary";
        }
    }

    filtrarPorStatus(status) {
        // console.log("filtrarPorStatus:: ", this.ocorrencia.cdProdutoServico);
        setTimeout(() => {
            this.status = status;
            const load = this.loadingCtrl.create({
                content: "Buscando Ocorrências..."
            });
            load.present().then(() => {
                const obj = {
                    usuarioAbertura: GerenciadorSessao.usuario.nrDocumento,
                    cdCliente: GerenciadorSessao.usuario.cdCliente,
                    inStatus: status.valor,
                    cdProdutoServico: this.ocorrencia.cdProdutoServico,
                    "padraoStatusDiaDia": this.ocorrencia.padraoStatusDiaDia
                };
                // let service;
                // if (this.ocorrenciaSiapec3) {
                //     service = this.ocorrenciaGsmService;
                // } else {
                //     service = this.ocorrenciaService;
                // }
                this.ocorrenciaGsmService.obterPorStatus(obj)
                    .then(resp => {
                        // console.log("resposta: ", resp);
                        // this.popularStatus(resp);
                        if (resp && resp.length) {
                            this.populaOcorrencia(resp, status.valor);
                            this.ocorrencia.padraoStatusDiaDia = true;
                        } else {
                            this.chamadosTemp = [];
                            this.listStatusView = [];
                        }
                        load.dismiss();
                    }).then(() => {
                        if (this.dtInicio || this.dtFim) {
                            this.filtrarData();
                        }
                        this.loadItems();
                    });
            }).catch(erro => {
                load.dismiss();
            });
        })
    }

    populaOcorrencia(resp, status) {
        // console.log("populaOcorrencia...", resp, status);
        this.listStatusView = [];
        this.chamadosTemp = [];
        this.chamados = resp;
        this.maxPrioridadeFP = 0;
        this.minPrioridadeFP = 0;
        this.maxPrioridadeGP = 0;
        this.minPrioridadeGP = 0;

        // this.chamados = this.ocorrenciaSiapec3 ? resp.filter(o => o.novoGsm) : resp.filter(o => !o.novoGsm);
        if (this.chamados && this.chamados.length > 0) {
            this.listSolicitante = [];
            this.chamados.forEach(item => {
                if (item.inStatus === 'TF') {
                    this.tratarPrioridade(item);
                    this.popularSolicitante(item);
                    // console.log("remove tag...", item);
                    var regex = /(<[^>]+>|<[^>]>|<\/[^>]>)/g;
                    item['descricaoProblema'] = item.dsProblema.replace(regex , ' ');
                    item["exibe"] = false;
                    item.dtAbertura = this.util.formatarDataUS(item.dtAbertura, "dd/MM/yyyy");
                    item.dtLimiteAtendimento = this.util.formatarDataUS(item.dtLimiteAtendimento, "dd/MM/yyyy");
                    /** Alteração de Status */
                    // item.dtAbertura = new Date(item.dtAbertura).toLocaleDateString();
                    this.popularStatusView(item.inStatus, item.status);
                    // if (item.novoGsm) {
                    // console.log("item.novoGsm", item);
                    // tslint:disable-next-line:no-shadowed-variable
                    //     let status = this.converterStatus(item.inStatus, item.status);
                    //     item.inStatus = status.valor;
                    //     item.status = status.label;
                    // }

                    item["cor"] = this.obterCor(item.inStatus);
                    item["usuario"].nome = item["usuario"].nome ? item["usuario"].nome.toLowerCase() : "";
                    item.dsUsuarioAbertura = item.dsUsuarioAbertura ? item.dsUsuarioAbertura.toLowerCase() : "";
                    if (item["tipoOcorrencia"]) {
                        item["tipoOcorrencia"].dsTipoOcorrencia = item["tipoOcorrencia"].dsTipoOcorrencia
                            ? item["tipoOcorrencia"].dsTipoOcorrencia.toLowerCase()
                            : null;
                    }
                    if (item.listHistorico && item.listHistorico.length > 0) {
                        item.listHistorico.forEach(hist => {
                            if (hist.dtInicioAtendimento) {
                                hist.dtInicioAtendimento = this.util.formatarDataUS(hist.dtInicioAtendimento, "dd/MM/yyyy");
                                // hist.dtInicioAtendimento = new Date(hist.dtInicioAtendimento).toLocaleDateString();
                            }
                            if (hist.dtFinalAtendimento) {
                                hist.dtFinalAtendimento = this.util.formatarDataUS(hist.dtFinalAtendimento, "dd/MM/yyyy");
                                // hist.dtFinalAtendimento = new Date(hist.dtFinalAtendimento).toLocaleDateString();
                            }
                        });
                    }
                    // console.log("status...", item.inStatus);
                    if (GerenciadorSessao.usuario.inGerenteProjeto) {
                        item.prioridade = item.nrPrioridadeGerenteProjeto;
                    } else if (GerenciadorSessao.usuario.inFocalPoint) {
                        item.prioridade = item.nrPrioridadeFocalPoint;
                    }

                    if (!this.ocorrenciaSiapec3 && item.inStatus === status || this.isFinalizado(item.inStatus)) {
                        this.chamadosTemp.push(item);
                    } else {
                        this.chamadosTemp.push(item);
                    }
                }
            });
        }
    }

    tratarPrioridade(o: Ocorrencia): void {
        // console.log("tratarPrioridade...", o);
        if (o.nrPrioridadeFocalPoint > this.maxPrioridadeFP) {
            this.maxPrioridadeFP = o.nrPrioridadeFocalPoint;
        }
        if (o.nrPrioridadeFocalPoint < this.minPrioridadeFP) {
            this.minPrioridadeFP = o.nrPrioridadeFocalPoint;
        }
        if (o.nrPrioridadeGerenteProjeto > this.maxPrioridadeGP) {
            this.maxPrioridadeGP = o.nrPrioridadeGerenteProjeto;
        }
        if (o.nrPrioridadeFocalPoint < this.minPrioridadeGP) {
            this.minPrioridadeGP = o.nrPrioridadeGerenteProjeto;
        }
    }

    popularStatus(list) {
        let ocorrencias = <any>JSON.parse(JSON.stringify(list));
        // console.log("popularPorStatus...", this, ocorrencias);
        this.listAguardAt = [];
        this.listDesenvolvimento = [];
        this.listHomoBeta = [];
        this.listGerandoVersaoAlfa = [];
        this.listAguardViab = [];
        this.listAguardDist = [];
        ocorrencias.forEach(o => {
            if (o.inStatus === "AA") {
                this.listAguardAt.push(o);
            } else if (o.inStatus === "AD") {
                this.listAguardDist.push(o);
            } else if (o.inStatus === "AV") {
                this.listAguardViab.push(o);
            } else if (o.inStatus === "DE") {
                this.listDesenvolvimento.push(o);
            } else if (o.inStatus === "HB") {
                this.listHomoBeta.push(o);
            } else if (o.inStatus === "VA") {
                this.listGerandoVersaoAlfa.push(o);
            }
        });
    }

    popularStatusView(sigla, descricao) {
        if (!this.listStatusView || this.listStatusView.length === 0) {
            this.addStatusQtd(sigla, descricao);
        } else {
            let status = this.listStatusView.find(o => o.sigla === sigla);
            if (status) {
                status.qtd = ++status.qtd;
            } else {
                this.addStatusQtd(sigla, descricao);
            }
        }
    }

    addStatusQtd(sigla, descricao) {
        this.listStatusView.push({
            sigla: sigla,
            descricao: descricao,
            qtd: 1
        });
    }

    filtroStatus() {
        // console.log("filtroStatus...", this);
        setTimeout(() => {
            this.listStatus = [];
            if (this.ocorrenciaSiapec3) {
                this.status = { label: "Em desenvolvimento", valor: "DE", cor: "info" };
                this.obterStatusSiapec3();
            } else {
                this.status = { label: "Em Atendimento", valor: "E", cor: "info" };
                this.obterStatus();
            }
            this.filtrarPorStatus(this.status);
        }, 500);
    }

    isFinalizado(status) {
        return status === 'F' || status === 'TF';
    }

    filtrarDescricao(ev: any) {
        // console.log('filtrarDescricao...', ev);
        const val = ev.target.value;
        // const val = this.texto_filtrar;
        if (val && val.trim() !== "") {
            this.chamadosTemp = this.chamados.filter(item => {
                return (
                    item.dsProblema.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                    String(item.idOcorrencia).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                    item.dsUsuarioAbertura.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                    item["tipoOcorrencia"].dsTipoOcorrencia.toLowerCase().indexOf(val.toLowerCase()) > -1
                );
            });
        } else {
            this.chamadosTemp = this.chamados;
        }
        this.loadItems();
    }

    obterStatus() {
        this.listStatus = [];
        this.ocorrenciaService.obterStatus(GerenciadorSessao.usuario.nrDocumento)
            .then(resp => {
                if (resp && resp.length > 0) {
                    this.listStatus.push({
                        label: 'Todos...',
                        valor: '',
                        cor: this.obterCor('')
                    });
                    resp.forEach(item => {
                        // console.log("item obterStatus()" + JSON.stringify(item));
                        this.listStatus.push({
                            label: item.label,
                            valor: item.valor,
                            cor: this.obterCor(item.valor)
                        });
                    });
                }
            });
    }

    obterStatusSiapec3() {
        this.listStatus = [];
        this.ocorrenciaService.obterStatusOcorrencias()
            .then(resp => {
                if (resp && resp.length > 0) {
                    // this.listStatus.push({
                    //     label: 'Todos...',
                    //     valor: '',
                    //     cor: this.obterCor('')
                    // });
                    resp.forEach(item => {
                        // console.log("item obterStatus()" + JSON.stringify(item));
                        if (item.codigo === 'TF') {
                            this.listStatus.push({
                                label: item.valor,
                                valor: item.codigo,
                                cor: this.obterCor(item.valor)
                            });
                        }
                    });
                }
            });
    }

    abrirOcorrencia(o: Ocorrencia) {
        if (o["exibe"]) {
            o["exibe"] = false;
        } else {
            this.chamados.forEach(item => {
                item["exibe"] = false;
            });
            o["exibe"] = true;
        }
    }

    pesquisar(codigoChamado: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.gridCustomizado = [];
            if (this.chamados.length > 0) {
                this.filtrar(this.chamados).then(() => {
                    this.chamados.forEach((chamado: Ocorrencia) => {
                        const custom = new GridGenericaCustomizado().convert(
                            chamado.usuarioAbertura,
                            { label: "Em", texto: chamado.dtAbertura },
                            chamado
                        );
                        this.gridCustomizado.push(custom);
                    });
                    this.filtrar(this.chamados);
                });
                this.listaOcorrencias.forEach(item => {
                    this.popularListaExibicao(item);
                });
            }
        });
    }

    popularListaExibicao(item) {
        item["list"] = Array<{ descricao: number; valor: number }>();
        item.list = [];
        item.list.push(
            { descricao: "Nome:", valor: item.nome },
            { descricao: "Cpf:", valor: item.cpf },
            { descricao: "Produto:", valor: item.produto },
            { descricao: "Status:", valor: item.status },
            { descricao: "Data:", valor: item.data },
            { descricao: "Descrição:", valor: item.texto }
        );
    }

    voltar() { }

    limpar() {
        this.gridCustomizado = [];
        this.cdOcorrencia = null;
        this.pesquisar = null;
    }

    filtrar(list: any) {
        return new Promise<any>(resolve => {
            // pelo nome cliente
            if (this.usuario.nrDocumento) {
                this.chamados = this.chamados.filter(
                    item => String(item.cdCliente) === this.usuario.nrDocumento
                );
                if (this.chamados.length === 0) {
                    this.resultado = false;
                }
            }
            // pelo Id da ocorrencia
            if (this.cdOcorrencia) {
                this.chamados = this.chamados.filter(
                    item => item.idOcorrencia === this.cdOcorrencia
                );
            }
            resolve(this.chamados);
        });
    }

    cpfCnpjChange(cpfCnpj: string) {
        this.onCpfCnpjChange.emit(cpfCnpj);
    }

    getFormattedCpfCnpj(cpfCnpj: string) {
        if (cpfCnpj !== undefined) {
            if (cpfCnpj.length === 11) {
                this.mask = new Masks("cpf");
            } else if (cpfCnpj.length === 14) {
                this.mask = new Masks("cnpj");
            }
            if (this.mask != null) {
                return this.mask.inserirMascara(cpfCnpj);
            } else {
                return cpfCnpj;
            }
        }
    }

    preEncerrarOcorrencia(ocorrencia) {
        this.ocorrencia = ocorrencia;
        const alert = this.alertCtrl.create({
            title: "Informação",
            message: "Tem certeza que deseja encerrar a ocorrência? " + this.ocorrencia.idOcorrencia,
            enableBackdropDismiss: false,
            buttons: [{
                text: "Não",
                handler: data => {
                    // console.log('Cancelado...', anexo);
                    this.ocorrencia = null;
                }
            }, {
                text: "Sim",
                handler: data => {
                    this.encerrarOcorrencia();
                }
            }]
        });
        alert.present();
    }

    encerrarOcorrencia() {
        this.ocorrencia.dtAbertura = this.formatDataUS(this.ocorrencia.dtAbertura);
        this.ocorrencia.dtLimiteAtendimento = this.formatDataUS(this.ocorrencia.dtAbertura);
        this.ocorrencia.listHistorico.forEach(element => {
            element.dtInicioAtendimento = this.formatDataUS(element.dtInicioAtendimento);
            element.dtFinalAtendimento = this.formatDataUS(element.dtFinalAtendimento);
        });
        delete this.ocorrencia["exibe"];
        delete this.ocorrencia["cor"];
        delete this.ocorrencia["prioridade"];
        this.ocorrenciaService.encerrarOcorrencia(this.ocorrencia)
            .then(resposta => {
                this.limparFiltros();
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            }).catch(err => {
                AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
            });
        this.obterStatus();
        this.filtrarPorStatus(this.status);
    }

    preReabrirOcorrencia(obj) {
        this.reqMsgReabertura = null;
        this.ocorrencia = obj;
        this.obterHistorico(obj);
        // console.log('preReabrirOcorrencia...', this);
    }

    reabrirOcorrencia() {
        if (this.descricaoHistorico) {
            this.reqMsgReabertura = null;
            const obj = <any>JSON.parse(JSON.stringify(this.ocorrencia));
            obj.dtAbertura = this.formatDataUS(obj.dtAbertura);
            obj.dtLimiteAtendimento = this.formatDataUS(obj.dtLimiteAtendimento);
            if (obj.listHistorico) {
                obj.listHistorico.forEach(element => {
                    element.dtInicioAtendimento = this.formatDataUS(element.dtInicioAtendimento);
                    element.dtFinalAtendimento = this.formatDataUS(element.dtFinalAtendimento);
                });
                const hist = {
                    idOcorrencia: obj.idOcorrencia,
                    idOcorrenciaHistorico: 0,
                    dsAtendimento: this.descricaoHistorico,
                    cdUsuarioAtendimento: GerenciadorSessao.usuario.nrDocumento
                };
                obj.listHistorico.push(hist);
            }
            delete obj["exibe"];
            delete obj["cor"];
            delete obj["prioridade"];
            this.ocorrenciaService.reabrirOcorrencia(obj)
                .then(resposta => {
                    this.limparFiltros();
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    this.filtrarPorStatus(this.status);
                    $("#modalReabertura").hide();
                    this.descricaoHistorico = null;
                }).catch(err => {
                    AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                });
        } else {
            this.reqMsgReabertura = "Campo Obrigatório";
        }
    }

    formatDataUS(dataStr) {
        if (dataStr && dataStr.indexOf("/") > -1) {
            const parts = dataStr.split("/");
            dataStr = parts[2] + "-" + (parts[1] - 1) + "-" + parts[0];
            return dataStr;
        } else {
            return dataStr;
        }
    }

    sair() {
        AppGsmModule.injector.get(AuthService).destruirSessao();
        this.router.navigate(["/login"]);
    }

    filtrarData() {
        // console.log('filtrarData...', this);
        // if (!this.dtInicio && !this.dtFim) {
        //     const alert = this.alertCtrl.create({
        //         title: "Informação",
        //         message: "Favor informar uma data para realizar a pesquisa!",
        //         buttons: [{ text: "OK" }],
        //         enableBackdropDismiss: false
        //     });
        //     alert.present();
        // } else {
        if (this.dtInicio || this.dtFim) {
            const inicio = new Date(this.dtInicio);
            inicio.setDate(inicio.getDate() + 1);
            const fim = new Date(this.dtFim);
            fim.setDate(fim.getDate() + 1);
            // console.log('Datas: ', inicio, fim);
            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);
            let longDtInicio = new Date(inicio).getTime();
            let longDtFim = new Date(fim).getTime();
            // console.log('filtrarData...', inicio, longDtInicio, fim, longDtFim);
            if (longDtInicio === NaN) {
                longDtInicio = 0;
            }
            if (longDtFim === NaN) {
                longDtFim = 0;
            }
            this.chamadosTemp = this.chamados.filter(item => {
                // console.log(item);
                const parts = item.dtAbertura.split("/");
                const abertura = new Date(+parts[2], +parts[1] - 1, +parts[0]);
                // abertura.setDate(abertura.getDate() + 1);
                abertura.setHours(0, 0, 0, 0);
                const dtAbertura = new Date(abertura).getTime();
                // console.log('ITEM...', abertura);
                if (this.dtInicio && !this.dtFim) {
                    // console.log('Só Inicio...', this.dtInicio, this.dtFim);
                    return dtAbertura >= longDtInicio;
                } else if (this.dtFim && !this.dtInicio) {
                    // console.log('Só Fim...', this.dtInicio, this.dtFim);
                    return dtAbertura <= longDtFim;
                } else if (this.dtInicio && this.dtFim) {
                    // console.log('Ambos...', this.dtInicio, this.dtFim);
                    return (dtAbertura >= longDtInicio && dtAbertura <= longDtFim);
                }
            });
            this.filtrarSolicitante(this.chamadosTemp);
            // console.log('Saida...', this);
        } else if(this.filtrosPesquisa.solicitanteSelecionado && this.filtrosPesquisa.solicitanteSelecionado.length) {
            this.filtrarSolicitante(null);
        } else {
            this.chamadosTemp = this.chamados;
        }
        this.loadItems();
    }

    limparFiltros() {
        this.dtInicio = null;
        this.dtFim = null;
        this.chamadosTemp = this.chamados;
        this.dsPesq = null;
        this.listSolicitante = null;
        this.listSolicitante = [];
        this.status = { label: "Tarefa Finalizada...", valor: "TF", cor: "info" };
        this.ocorrencia.cdProdutoServico = null;
        this.labelProduto = 'Selecione...';
        this.filtrosPesquisa.solicitanteSelecionado = [];
        this.filtrarPorStatus(this.status);
    }

    lerUrlImagem(event) {
        // console.log("lerUrlImagem: ", event);
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtensao = fileName.split(".").pop();
        this.dsAnexo = fileName;
        this.dsExtensao = fileExtensao;
        if (event.target.files && event.target.files[0]) {
            const anexo: OcorrenciaAnexo = new OcorrenciaAnexo();
            const reader = new FileReader();
            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = (event: any) => {
                // console.log("FILE...", event.target.result);
                if (event.target.result) {
                    this.upAnexo = event.target.result.split(",")[1];
                    anexo.cdOcorrencia = this.ocorrencia.idOcorrencia;
                    anexo.idOcorrenciaAnexo = null;
                    anexo.upAnexo = this.upAnexo;
                    anexo.dsAnexo = fileName;
                    anexo.dsExtensao = this.dsExtensao;
                    anexo.cdUsuarioAtendimento =
                        GerenciadorSessao.usuario.nrDocumento;
                    // cdUsuarioAtendimento: null

                    // console.log("add Anexo...", anexo);
                    const arq = this.ocorrencia.listAnexo.find(
                        a => a.dsAnexo === fileName
                    );
                    // console.log('ARQ', arq);
                    if (!arq && anexo.dsAnexo && anexo.dsExtensao) {
                        this.ocorrencia.listAnexo.push(anexo);
                    } else if (arq) {
                        this.msgAnexoExiste();
                    }
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.msgAnexoExiste();
        }
    }

    msgAnexoExiste() {
        const alert = this.alertCtrl.create({
            title: "Informação",
            message: "Este Aquivo já foi Anexado!",
            buttons: [{ text: "OK" }],
            enableBackdropDismiss: false
        });
        alert.present();
    }

    removerAnexo(idOcorrenciaAnexo: number, idOcorrencia: number) {
        this.ocorrenciaService.excluirAnexo(idOcorrencia, idOcorrenciaAnexo)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrarPorStatus(this.status);
            }).catch(err => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    // idOcorrencia: number, idOcorrenciaAnexo: number, upAnexo: string, dsAnexo: string, dsExtensao: string
    adicionarAnexo() {
        this.ocorrenciaService.adicionarAnexo(this.idOcorrencia, this.idOcorrenciaAnexo, this.upAnexo, this.dsAnexo, this.dsExtensao)
            .then(resposta => {
                // console.log("resposta adicionar:" + JSON.stringify(resposta));
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrarPorStatus(this.status);
            }).catch(err => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    downloadAnexo(idOcorrencia: number, anexo, novoGsm) {
        // console.log("downloadAnexo...", idOcorrencia, anexo, novoGsm);
        const load = this.loadingCtrl.create({
            content: "Baixando Arquivo..."
        });
        if (novoGsm) {
            load.present().then(() => {
                // console.log(anexo.dsAnexo);
                this.ocorrenciaService.downloadAnexoNovo(anexo.idOcorrenciaAnexo, anexo.dsAnexo)
                    .then(resposta => {
                        load.dismiss();
                    }).catch(err => {
                        load.dismiss();
                        AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    });
            }).catch(erro => {
                load.dismiss();
            });
        } else {
            load.present().then(() => {
                this.ocorrenciaService.downloadAnexo(idOcorrencia, anexo.idOcorrenciaAnexo, anexo.dsAnexo)
                    .then(resposta => {
                        load.dismiss();
                        // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                        // console.log("downloadAnexo: ", resposta);
                    }).catch(err => {
                        load.dismiss();
                        AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                    });
            }).catch(erro => {
                load.dismiss();
            });
        }
    }

    obterAnexo(chamado: any) {
        // console.log("obterAnexo...", chamado, this);
        this.ocorrencia = chamado;
        if (!this.ocorrencia.listAnexo) {
            this.ocorrencia.listAnexo = [];
        }
        if (this.produtos && this.produtos.length === 1) {
            this.labelProduto = this.produtos[0].show;
        } else if (this.produtos && this.produtos.length > 1) {
            this.labelProduto = this.produtos.find(p => p.select === this.ocorrencia.cdProdutoServico).show;
        } else {
            this.labelProduto = chamado.produto;
        }
        if (this.tiposOcorrencia && this.tiposOcorrencia.length === 1) {
            this.labelTipoOcorrencia = this.tiposOcorrencia[0].dsTipoOcorrencia;
        } else if (this.tiposOcorrencia && this.tiposOcorrencia.length > 1) {
            this.labelTipoOcorrencia = this.tiposOcorrencia.find(p => p.idTipoOcorrencia === this.ocorrencia["tipoOcorrencia"].idTipoOcorrencia).dsTipoOcorrencia;
        } else {
            this.labelTipoOcorrencia = chamado.tipoOcorrencia.dsTipoOcorrencia;
        }
    }

    removerHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string) {
        this.ocorrenciaService.excluirHistorico(idOcorrencia, idOcorrenciaHistorico, dsAtendimento)
            .then(resposta => {
                // console.log("resposta excluir:", resposta);
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrarPorStatus(this.status);
            }).catch(err => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    adicionarHistorico() {
        // console.log("adicionarHistorico...", this);
        if (this.ocorrencia.novoGsm) {
            // console.log("manterHistoricoOcorrencia...");
            let hist = new Historico();
            hist.cdOcorrencia = this.idOcorrencia;
            hist.idOcorrenciaHistorico = this.idOcorrenciaHistorico;
            hist.dsMensagem = this.descricaoHistorico;
            hist.cdUsuario = this.cdUsuarioAtendimento;
            this.ocorrenciaService.manterHistoricoOcorrencia(hist)
                .then(resposta => {
                    // console.log("resposta adicionar:", resposta);
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    $("#modalHistorico").hide();
                }).then(() => {
                    // if (this.reabertura) {
                    //     console.log('Reabertura', this);
                    //     this.reabrirOcorrencia(this.ocorrencia);
                    // }
                    this.filtrarPorStatus(this.status);
                }).catch(err => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        } else {
            // console.log("adicionarHistorico...");
            this.ocorrenciaService.adicionarHistorico(this.idOcorrencia, this.idOcorrenciaHistorico, this.descricaoHistorico, this.cdUsuarioAtendimento)
                .then(resposta => {
                    // console.log("resposta adicionar:", resposta);
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    $("#modalHistorico").hide();
                }).then(() => {
                    // if (this.reabertura) {
                    //     console.log('Reabertura', this);
                    //     this.reabrirOcorrencia(this.ocorrencia);
                    // }
                    this.filtrarPorStatus(this.status);
                }).catch(err => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        }
    }

    obterHistorico(chamado) {
        // console.log("obterHistorico...", chamado, this);
        this.idOcorrencia = chamado.idOcorrencia;
        this.cdUsuarioAtendimento = GerenciadorSessao.usuario.nrDocumento;
        this.descricaoHistorico = null;
        this.ocorrencia = chamado;
        // chamado.forEach(element => {
        //     this.idOcorrenciaHistorico = element.listHistorico.idOcorrenciaHistorico;
        // });
    }

    setProduto(idProdutoServico) {
        // console.log('setProduto...', idProdutoServico);
        this.ocorrencia.cdProdutoServico = idProdutoServico;
        this.labelProduto = this.produtos.find(p => p.select === idProdutoServico).show;
        this.selecionarTipoOcorrencia();
    }

    setProdutoPainelPrincipal(idProdutoServico) {
        // console.log('setProduto...', idProdutoServico);
        this.produto = idProdutoServico;
        this.labelProdutoPainel = this.produtosPainel.find(p => p.valor === idProdutoServico).label;
    }

    setTipoOcorrencia(tipoOcorrencia) {
        // console.log('setTipoOcorrencia...', tipoOcorrencia);
        this.ocorrencia.cdTipoOcorrencia = tipoOcorrencia.idTipoOcorrencia;
        this.labelTipoOcorrencia = tipoOcorrencia.dsTipoOcorrencia;
    }

    selecionarTipoOcorrencia(): void {
        // if (this.labelProduto && this.labelProduto.toUpperCase() === "SIAPEC3") {
        const oco: OcorrenciaGsm = new OcorrenciaGsm();
        oco.cdUsuarioSolicitante = GerenciadorSessao.usuario.nrDocumento;
        oco.cdProduto = this.ocorrencia.cdProdutoServico;
        this.ocorrenciaTipoService.obterFuncionalidadesClientePorArea(oco)
            .then(resposta => {
                if (resposta && resposta.length) {
                    this.tiposOcorrencia = [];
                    resposta.forEach(item => {
                        const obj: OcorrenciaTipo = new OcorrenciaTipo();
                        obj.idTipoOcorrencia = item.codigo;
                        obj.dsTipoOcorrencia = item.valor;
                        this.tiposOcorrencia.push(obj);
                    });
                }
                // else {
                //     this.funcionalidadeService.obterFuncionalidade(this.ocorrencia.cdProdutoServico)
                //     .then(resp => {
                //         // console.log("obterOcorrenciasTipo", resp);
                //         this.tiposOcorrencia = [];
                //         resp.forEach(item => {
                //             const obj: OcorrenciaTipo = new OcorrenciaTipo();
                //             obj.idTipoOcorrencia = item.codigo;
                //             obj.dsTipoOcorrencia = item.valor;
                //             this.tiposOcorrencia.push(obj);
                //         });
                //         if (this.tiposOcorrencia && this.tiposOcorrencia.length === 1) {
                //             this.labelTipoOcorrencia = this.tiposOcorrencia[0].dsTipoOcorrencia;
                //         } else if (this.tiposOcorrencia && this.tiposOcorrencia.length > 1) {
                //             this.labelTipoOcorrencia = "Selecione...";
                //         }
                //     });
                // }
            });

        // else {
        //     this.ocorrenciaTipoService.obterOcorrenciasTipo(this.ocorrencia.cdProdutoServico)
        //         .then(resposta => {
        //             // console.log('obterOcorrenciasTipo', resposta);
        //             this.tiposOcorrencia = resposta;
        //             if (this.tiposOcorrencia && this.tiposOcorrencia.length === 1) {
        //                 this.labelTipoOcorrencia = this.tiposOcorrencia[0].dsTipoOcorrencia;
        //             } else if (this.tiposOcorrencia && this.tiposOcorrencia.length > 1) {
        //                 this.labelTipoOcorrencia = "Selecione...";
        //             }
        //         });
        // }
    }

    salvarOcorrencia() {
        console.log("salvarOcorrencia...", this);
        if (this.formIsValid()) {
            this.loading.show();
            if (this.ocorrencia.cdProdutoServico === 1 || this.ocorrencia.cdProdutoServico === 5 || this.ocorrencia.cdProdutoServico === 7) {
                if (this.formIsValid()) {
                    const ocorrencia: Ocorrencia = new Ocorrencia();
                    ocorrencia.idOcorrencia = this.ocorrencia.idOcorrencia;
                    ocorrencia.cdProdutoServico = this.ocorrencia.cdProdutoServico;
                    ocorrencia.cdTipoOcorrencia = this.ocorrencia.cdTipoOcorrencia;
                    ocorrencia.cdCliente = this.usuario.cdCliente;
                    ocorrencia.dsProblema = this.ocorrencia.dsProblema;
                    ocorrencia.listAnexo = this.ocorrencia.listAnexo;
                    ocorrencia.usuarioAbertura = this.usuario.nrDocumento;
                    ocorrencia.dsUsuarioAbertura = this.usuario.nrDocumento;
                    this.ocorrenciaService.manterOcorrencia(ocorrencia)
                        .then(resposta => {
                            this.novaOcorrencia();
                            this.loading.hide();
                            this.filtrarPorStatus(this.status);
                            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                            // $("#myModal").hide();
                        }).catch(err => {
                            AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                            this.loading.hide();
                        });
                }
            } else {
                const ocorrenciaGsm: OcorrenciaGsm = new OcorrenciaGsm();
                ocorrenciaGsm.idOcorrencia = this.ocorrencia.idOcorrencia;
                ocorrenciaGsm.cdProduto = this.ocorrencia.cdProdutoServico;
                ocorrenciaGsm.cdFuncionalidade = this.ocorrencia.cdTipoOcorrencia;
                ocorrenciaGsm.cdCliente = this.usuario.cdCliente;
                ocorrenciaGsm.dsOcorrencia = this.ocorrencia.dsProblema;
                ocorrenciaGsm.anexos = ocorrenciaGsm.convertAnexos(this.ocorrencia.listAnexo);
                ocorrenciaGsm.dtSolicitacao = new Date();
                ocorrenciaGsm.inOcorrenciaInterna = false;
                ocorrenciaGsm.cdUsuarioSolicitante = this.usuario.nrDocumento;
                ocorrenciaGsm.cdUsuarioCadastro = this.usuario.nrDocumento;
                this.ocorrenciaGsmService.manterOcorrencia(ocorrenciaGsm)
                    .then(resposta => {
                        this.novaOcorrencia();
                        this.filtrarPorStatus(this.status);
                        this.loading.hide();
                        AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                        // $("#myModal").hide();
                    }).catch(err => {
                        AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                        this.loading.hide();
                    });
            }
        }
    }

    removeList(index) {
        this.ocorrencia.listAnexo.splice(index, 1);
    }

    preRemove(index: number) {
        const anexo = this.ocorrencia.listAnexo[index];
        const alert = this.alertCtrl.create({
            title: "Informação",
            message: "Confirmar a Exclusão do Arquivo: " + anexo.dsAnexo,
            buttons: [{
                text: "Não",
                handler: data => {
                    // console.log('Cancelado...', anexo);
                }
            }, {
                text: "Sim",
                handler: data => {
                    this.removeList(index);
                }
            }],
            enableBackdropDismiss: false
        });
        alert.present();
    }

    formIsValid(): boolean {
        // console.log('formIsValid...', this);
        let valida = false;
        if (this.ocorrencia.dsProblema) {
            this.reqMsgDesc = null;
        } else {
            this.reqMsgDesc = "Campo Obrigatório";
        }
        if (this.ocorrencia.cdProdutoServico) {
            this.reqMsgProd = null;
        } else {
            this.reqMsgProd = "Campo Obrigatório";
        }
        if (this.ocorrencia.cdTipoOcorrencia) {
            this.reqMsgTipo = null;
        } else {
            this.reqMsgTipo = "Campo Obrigatório";
        }
        if (this.ocorrencia.dsProblema && this.ocorrencia.cdProdutoServico && this.ocorrencia.cdTipoOcorrencia) {
            valida = true;
        } else {
            valida = false;
        }
        return valida;
    }

    novaOcorrencia() {
        this.ocorrencia = new Ocorrencia();
        this.ocorrencia.dsProblema = '';
        this.produtos = [];
        // this.obterProduto();
        this.obterProdutoFiltro();
        this.produtos.sort(function (a, b) {
            return a.select < b.select ? -1 : a.select === b.select ? 0 : 1;
        });
        this.labelTipoOcorrencia = "Selecione...";
    }

    addAnexos() {
        // console.log("addAnexos...", this);
        const obj = <any>JSON.parse(JSON.stringify(this.ocorrencia));
        obj.dtAbertura = null;
        obj.dtLimiteAtendimento = null;
        delete obj["exibe"];
        delete obj["cor"];
        if (obj && obj.listHistorico && obj.listHistorico.length > 0) {
            obj.listHistorico.forEach(o => {
                o.dtInicioAtendimento = null;
                o.dtFinalAtendimento = null;
            });
        }
        if (this.ocorrencia.novoGsm) {
            let ocorrenciaGsm = new OcorrenciaGsm();
            ocorrenciaGsm.idOcorrencia = obj.idOcorrencia;
            if (obj.listAnexo && obj.listAnexo.length) {
                ocorrenciaGsm.anexos = [];
                obj.listAnexo.forEach(element => {
                    ocorrenciaGsm.anexos.push({
                        idOcorrenciaAnexo: element.idOcorrenciaAnexo,
                        cdOcorrencia: element.cdOcorrencia,
                        dsNome: element.dsAnexo,
                        upAnexo: element.upAnexo,
                        dsExtensao: element.dsExtensao,
                        arquivo: element.arquivo,
                    });
                });
            }
            this.ocorrenciaService.manterListAnexoHistorico(ocorrenciaGsm)
                .then(resposta => {
                    // console.log("resposta adicionar manterAnexo:", resposta);
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    this.filtrarPorStatus(this.status);
                    $("#modalAddAnexo").hide();
                }).catch(err => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        } else {
            this.ocorrenciaService.addAnexos(obj)
                .then(resposta => {
                    // console.log("resposta adicionar addAnexos:", resposta);
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    this.filtrarPorStatus(this.status);
                    $("#modalAddAnexo").hide();
                }).catch(err => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        }
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
        // console.log('pageChange...', this.mySelection);
    }

    private loadItems(): void {
        // console.log("loadItems...", this);
        this.gridView = {
            data: this.chamadosTemp.slice(this.skip, this.skip + this.pageSize),
            total: this.chamadosTemp.length
        };

    }

    public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
        // console.log("showOnlyBeveragesDetails", dataItem, index);
        return true;
    }

    public mySelectionKey(context: RowArgs): string {
        // console.log('mySelectionKey...', context, this);
        return context.dataItem.ProductName + ' ' + context.index;
    }

    public setSelectableSettings(): void {
        // console.log('setSelectableSettings...', this);
        this.selectableSettings = {
            checkboxOnly: this.checkboxOnly,
            mode: this.mode
        };
    }

    editarPrioridadeCliente() {
        // this.chamadosTemp = this.chamados.filter(a => a.inStatus === status);
        const load = this.loadingCtrl.create({
            content: "Atualizando Prioridade..."
        });
        load.present().then(() => {
            const obj = {
                ids: this.mySelection,
                nrPrioridade: this.nrPrioridade,
                gerente: GerenciadorSessao.usuario.inGerenteProjeto
            };
            this.ocorrenciaGsmService.editarPrioridadeCliente(obj)
                .then(resp => {
                    // console.log("resposta: ", resp);
                    if (resp) {
                        this.filtrarPorStatus(this.status);
                    }
                    this.util.closeModal("modalPrioridade");
                    load.dismiss();
                    AppGsmModule.injector.get(SmAlertController).info("", resp.msgResponse);
                }).catch(erro => {
                    AppGsmModule.injector.get(SmAlertController).error("", erro.msgResponse);
                    load.dismiss();
                });
        }).catch(erro => {
            load.dismiss();
        });
    }

    obterPrioridade(nrPrioridade) {
        let valor = nrPrioridade;
        if (valor > 3) {
            valor = 3
        }
        return "Prioridade " + this.prioridades[valor];
    }

    obterCorPrioridade(nrPrioridade) {
        let valor = nrPrioridade;
        if (valor > 3) {
            valor = 3
        }
        return this.cores[valor];
    }

    gerarCsv() {
        if (+this.ocorrencia.cdProdutoServico === 1) {
            // if (this.ocorrenciaSiapec3) {
            this.obterClienteCsvSiapec3();
        } else if (+this.ocorrencia.cdProdutoServico === 4) {
            this.obterClienteCsvSiapec1();
        }
    }

    obterClienteCsvSiapec1() {
        const load = this.loadingCtrl.create({
            content: "Buscando CsvSiapec1..."
        });
        load.present()
            .then(() => {
                const convertFiltroPainelWS = {
                    inStatus: this.status.valor === '' ? null : this.status.valor,
                    dtAbertura: this.dtInicio,
                    dtLimiteAtendimento: this.dtFim,
                    cdCliente: GerenciadorSessao.usuario.cdCliente,
                    usuarioAbertura: GerenciadorSessao.usuario.nrDocumento
                };
                this.ocorrenciaProdutoService.gerarCsvClienteSiapec1WS(convertFiltroPainelWS)
                    .catch(erro => {
                        console.error("gerarCsvWS", erro);
                        load.dismiss();
                    });
            }).then(() => {
                load.dismiss();
            });
    }

    obterClienteCsvSiapec3() {
        const load = this.loadingCtrl.create({
            content: "Buscando CsvSiapec3..."
        });
        load.present()
            .then(() => {
                let idsOcorrencia: number[] = [];
                if (this.chamadosTemp) {
                    this.chamadosTemp.forEach(item => {
                        idsOcorrencia.push(item.idOcorrencia);
                    });
                }
                console.log('IDS:' + JSON.stringify(idsOcorrencia));
                const convertFiltroPainelWS = {
                    status: this.status.valor === '' ? null : [this.status.valor],
                    dataInicial: this.dtInicio,
                    dataFinal: this.dtFim,
                    clientes: [GerenciadorSessao.usuario.cdCliente],
                    produtos: null,
                    descricao: null,
                    prioridades1: null,
                    prioridades2: null,
                    desenvolvedores: null,
                    modalidades: null,
                    inTipoSolicitacao: null,
                    inNivelComplexidade: null,
                    homologador: null,
                    idUsuario: GerenciadorSessao.usuario.nrDocumento,
                    funcionalidades: null,
                    inAtendimento: null,
                    inOcorrenciaInterna: null,
                    solicitantes: null,
                    idsOcorrencia : idsOcorrencia
                };
                this.ocorrenciaProdutoService.gerarCsvClienteWS(convertFiltroPainelWS)
                    .catch(erro => {
                        console.error("gerarCsvWS", erro);
                        load.dismiss();
                    });
            }).then(() => {
                load.dismiss();
            });
    }

    // public group: any[] = [{field: 'idOcorrencia'}];

    public allData(): ExcelExportData {
        console.log('allData...', this);
        const result: ExcelExportData =  {
            data: process(this.chamadosTemp, {}).data,
            // group: this.group
        };

        return result;
    }

    filtrarSolicitante(listchamados) {
        if (this.filtrosPesquisa.solicitanteSelecionado && this.filtrosPesquisa.solicitanteSelecionado.length) {
            //console.log('filtrarSolicitante...', this.filtrosPesquisa.solicitanteSelecionado);
            const list = [];
            this.filtrosPesquisa.solicitanteSelecionado.forEach(s => {
                list.push(s.select);
            });
            if (listchamados) {
                this.chamadosTemp = listchamados.filter(c => list.indexOf(c['usuario']['idUsuario']) > -1);
            } else {
                this.chamadosTemp = this.chamados.filter(c => list.indexOf(c['usuario']['idUsuario']) > -1);
            }
        }
    }
}
