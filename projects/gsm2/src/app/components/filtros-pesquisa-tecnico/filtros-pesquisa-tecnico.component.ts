import { OcorrenciaGsm } from "./../../objects/entidades/OcorrenciaGsm";
import { OcorrenciaProdutoService } from "./../../services/OcorrenciaProdutoService";
import { OcorrenciaService } from "./../../services/OcorrenciaService";
import { Input, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { LoadingController, AlertController } from "ionic-angular";
import { Tuple } from "../../objects/entidades/Tuple";
import { OcorrenciaTipoService } from "../../services/OcorrenciaTipoService";
import { Ocorrencia } from "../../objects/entidades/Ocorrencia";
import { Util } from "../../services/util/Util";
import { Usuario } from "../../objects/entidades/Usuario";
import { DistribuicaoOcorrenciaGsm } from "projects/gsm2/src/app/objects/entidades/DistribuicaoOcorrenciaGsm";
import { GridOcorrenciasTecnicoComponent } from "../grid-ocorrencias-tecnico/grid-ocorrencias-tecnico.component";

export class FiltrosPesquisa {
    produto: Tuple = new Tuple("Todos ... ", 0);
    funcionalidade: Tuple = new Tuple("Todos ... ", 0);
    ambienteInterface: Tuple = new Tuple("Todos ... ", "");
    tipoInterface: Tuple = new Tuple("Todos ... ", "");
    tipoOcorrencia: Tuple = new Tuple("Todos ... ", "");
    prioridadeUm: Tuple = new Tuple("Todos ... ", "");
    prioridadeDois: Tuple = new Tuple("Todos ... ", "");
    tipoSolicitacao: Tuple = new Tuple("Selecionar ... ", null);
    nivelComplexidade: Tuple = new Tuple("Selecionar ... ", null);
    nivelSeveridade: Tuple = new Tuple("Selecionar ... ", null);
    cliente: Tuple = new Tuple("Todos ... ", "");
    modalidadeDesenvolvimento: Tuple = new Tuple("Todos ... ", "");
    tipoDesenvolvimentoBack: Tuple = new Tuple("Todos ... ", "");
    desenvolvedorSm: Tuple = new Tuple("Todos ... ", "");
    ocorrencia: Ocorrencia = new Ocorrencia();
    ocorrenciaGsm: OcorrenciaGsm = new OcorrenciaGsm();
    chamadosSelecionados: Array<OcorrenciaGsm> = [];
    chamadosRetornoWS: Array<OcorrenciaGsm> = [];
    cpfUsuario: string;
    dtInicio: any = null;
    dtFim: any = null;
    inAtendimento: boolean;

    produtos: Tuple[] = null;
    tiposOcorrencia: Tuple[] = null;
    modalidades: Tuple[] = null;
    desenvolvedoresTarefasEmDesenvolvimento: Tuple[] = null;
    desenvolvedoresTodasTarefas: Tuple[] = null;
    clientes: Tuple[] = [];
    listUsuarioSm: Usuario[] = null;
    listStatusTemp: Tuple[] = null;
    listSolicitante: Tuple[] = null;

    status: { valor: String; codigo: String; cor: String };
    listStatus: { label: String; valor: String; cor: String }[] = [];
    listPrioridadeUm: Tuple[];
    listPrioridadeUmGrid: Tuple[] = [];
    listPrioridadeDois: Tuple[];
    listPrioridadeDoisGrid: Tuple[] = [];
    listTipoSolicitacao: Tuple[];
    listNivelComplexidade: Tuple[];
    listNivelSeveridade: Tuple[];
    solicitanteSelecionado: Tuple[];


    // ComboMultipla
    listProdutosSelecionados: Tuple[] = [];
    listFuncionalidadeSelecionada: Tuple[] = [];
    listClientesSelecionados: Tuple[] = [];
    prioridades1Selecionados: Tuple[] = [];
    prioridades2Selecionados: Tuple[] = [];
    listModalidadesSelecionados: Tuple[] = [];
    listDesenvolvedoresSelecionado: Tuple[] = [];
    listTipoSolicitacaoSelecionado: Tuple[] = [];
    listNivelComplexidadeSelecionado: Tuple[] = [];
    listNivelSeveridadeSelecionado: Tuple[] = [];
    listStatusSelecionado: Tuple[] = [];
    simNao: Tuple[] = [new Tuple("Sim", true), new Tuple("Não", false), new Tuple("Todos", null)];
    inOcorrenciaInterna: Boolean = null;

    constructor() {
        this.produtos = [];
        this.listStatusTemp = [];
        this.desenvolvedoresTarefasEmDesenvolvimento = [];
        this.desenvolvedoresTodasTarefas = [];
        this.modalidades = [];
        this.clientes = [];
        this.tiposOcorrencia = [];
        this.listUsuarioSm = [];
        this.listStatusTemp = [];
        this.listPrioridadeUm = [];
        this.listPrioridadeDois = [];
        this.listSolicitante = [];

        this.listTipoSolicitacao = [new Tuple("Não classificado", null), new Tuple("Correção", "C"), new Tuple("Adaptação", "A"), new Tuple("Nova funcionalidade", "N")];
        this.listNivelComplexidade = [new Tuple("Baixo", "B"), new Tuple("Médio", "M"), new Tuple("Alta", "A")];
        this.listNivelSeveridade = [new Tuple("Crítico", 1), new Tuple("Normal", 2), new Tuple("Urgente", 3)];
        this.tipoSolicitacao = new Tuple("Selecionar ... ", null);
        this.nivelComplexidade = new Tuple("Selecionar ... ", null);
        this.nivelSeveridade = new Tuple("Selecionar ... ", null);
        this.listProdutosSelecionados = [];
        this.listFuncionalidadeSelecionada = [];
        this.listClientesSelecionados = [];
        this.prioridades1Selecionados = [];
        this.prioridades2Selecionados = [];
        this.listModalidadesSelecionados = [];
        this.listDesenvolvedoresSelecionado = [];
        this.listStatusSelecionado = [];
        this.solicitanteSelecionado = [];
        this.listDesenvolvedoresSelecionado = [];
        this.simNao = [new Tuple("Sim", true), new Tuple("Não", false), new Tuple("Todos", null)];
        this.inOcorrenciaInterna = null;
    }

    limparListFiltros(): void {
        this.produtos = null;
        this.tiposOcorrencia = null;
        this.clientes = null;
        this.listPrioridadeUm = null;
        this.listPrioridadeDois = null;
        this.listUsuarioSm = null;
        this.listStatusTemp = null;
        this.desenvolvedoresTarefasEmDesenvolvimento = null;
        this.desenvolvedoresTodasTarefas = null;
        this.modalidades = null;

        this.produtos = [];
        this.tiposOcorrencia = [];
        this.clientes = [];
        this.listPrioridadeUm = [];
        this.listPrioridadeDois = [];
        this.listUsuarioSm = [];

        // ComboMultiple
        this.listStatusTemp = [];
        this.desenvolvedoresTarefasEmDesenvolvimento = [];
        this.desenvolvedoresTodasTarefas = [];
        this.modalidades = [];

    }
}

@Component({
    selector: "filtros-pesquisa-tecnico",
    templateUrl: "./filtros-pesquisa-tecnico.component.html",
    styleUrls: ["./filtros-pesquisa-tecnico.component.scss"]
})
export class FiltrosPesquisaTecnicoComponent implements OnInit {
    @Input()
    labelProduto: String;
    @Input()
    labelTipoOcorrencia: String;

    // Labels dos componentes filtros
    labelPrioridadeUm: String;
    labelPrioridadeDois: String;
    labelTipoInterface: String;
    labelAmbienteInterface: String;
    labelSolicitadoCliente: String;
    labelCliente: String;
    labelTipoDesenvolvimentoFront: String;
    labelTipoDesenvolvimentoBack: String;
    labelUsuarioSm: String;
    solicitadoCliente: Tuple[];

    reqMsgPrioridadeUm: String;
    reqMsgPrioridadeDois: String;
    reqMsgTipoInterface: String;
    reqMsgAmbiente: String;
    reqMsgSolicitado: String;
    reqMsgProd: String;
    reqMsgTipo: String;
    reqMsgCliente: String;
    reqMsgDesc: String;
    reqMsgReabertura: String;
    reqMsgStatus: String;
    reqMsgComplexidade: String;
    reqMsgSeveridade: String;

    // Objetos selecionados nos filtros
    texto_filtrar: String;

    totalTiposProduto: { titulo: String; qtd: Number }[] = [];
    @Input() public dtInicio: any = null;
    @Input() public dtFim: any = null;
    public dsPesq = "";

    // recuperacao após filtros WS
    private _chamadosTemp: Array<OcorrenciaGsm> = [];
    private _filtros: FiltrosPesquisa = new FiltrosPesquisa();
    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    ChamadosTempChange: EventEmitter<Array<OcorrenciaGsm>> = new EventEmitter<Array<OcorrenciaGsm>>();
    gridOcorrenciasTecnicoTempChange: EventEmitter<GridOcorrenciasTecnicoComponent> = new EventEmitter<GridOcorrenciasTecnicoComponent>();
    @Output()
    filtrosChange: EventEmitter<FiltrosPesquisa> = new EventEmitter<FiltrosPesquisa>();
    listUsuario: Usuario[];
    listUsuarioDtPrevisao: { id: String, datas: Date[] }[];

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

    @Input()
    inAtendimento: boolean = true;

    @Input()
    inAguardandoViabilidade: boolean = false;

    @Input()
    get chamadosTemp(): Array<OcorrenciaGsm> {
        return this._chamadosTemp;
    }
    set chamadosTemp(val: Array<OcorrenciaGsm>) {
        this._chamadosTemp = val;
        this.ChamadosTempChange.emit(this._chamadosTemp);
    }
    get filtros(): FiltrosPesquisa {
        return this._filtros;
    }
    set filtros(val: FiltrosPesquisa) {
        this._filtros = val;
        this.filtrosChange.emit(this._filtros);
    }

    totalChamados: Number;
    totalChamadosFiltrados: Number = 0;

    constructor(
        private ocorrenciaService: OcorrenciaService,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private loadingCtrl: LoadingController,
        private util: Util,
        private alertCtrl: AlertController
    ) {
        this.refresh();
    }

    async refresh() {
        let tempo: Boolean = false;
        await setInterval(() => {
            // console.log("interval 10 minutos...");
            if (tempo) {
                this.pesquisarWS();
            }
            tempo = !tempo;
        }, 6000000);
    }

    ngOnInit() {
        if (GerenciadorSessao.sessao.usuario.inSituacao) {
            this.filtros.status = { valor: "Todos...", codigo: null, cor: "primary" };
        } else {
            this.filtros.status = { valor: "Em Desenvolvimento", codigo: "DE", cor: "primary" };
        }


        this.filtros.listStatusSelecionado.push(new Tuple(this.filtros.status.valor, this.filtros.status.codigo));
        this.obterModalidadeDesenvolvimento();
        // this.pesquisarPorStatus(this.filtros.status);
        this.pesquisarWS();

        // this.dropdownList = [
        //     { item_id: 1, item_text: 'Mumbai' },
        //     { item_id: 2, item_text: 'Bangaluru' },
        //     { item_id: 3, item_text: 'Pune' },
        //     { item_id: 4, item_text: 'Navsari' },
        //     { item_id: 5, item_text: 'New Delhi' }
        // ];
        // this.selectedItems = [
        //     { item_id: 3, item_text: 'Pune' },
        //     { item_id: 4, item_text: 'Navsari' }
        // ];
        // console.log("ngOnInit...filtros", this);
    }


    cargaInicial(): Promise<any> {
        return new Promise<any>(resolve => {
            this.texto_filtrar = "";
            this.obterStatus();
            this.obterUsuarios();
            this.obterStatusOcorrencia();
            resolve();
        });
    }

    selecionarTipoOcorrencia(): void {
        // console.log("selecionarTipoOcorrencia...", this);
        // this.ocorrenciaTipoService.obterFuncionalidadesProgramaUsuario(GerenciadorSessao.usuario.nrDocumento)
        // .then(resposta => {
        //     if (resposta && resposta.length) {
        //         this.filtros.tiposOcorrencia = [];
        //         this.filtros.tiposOcorrencia.push(new Tuple("Todos ...  ", null));
        //         resposta.forEach(item => {
        //             this.filtros.tiposOcorrencia.push(new Tuple(item.valor, item.codigo));
        //         });
        //     } else {
        this.ocorrenciaTipoService.obterFuncionalidade(this.filtros.ocorrenciaGsm.cdProduto)
            .then(resp => {
                if (resp && resp.length) {
                    this.filtros.tiposOcorrencia = [];
                    this.filtros.tiposOcorrencia.push(new Tuple("Todos ...  ", null));
                    resp.forEach(item => {
                        this.filtros.tiposOcorrencia.push(new Tuple(item.valor, item.codigo));
                    });
                }
            });
        //     }
        // });
    }

    selecionarTipoOcorrenciaFiltro(produto: Tuple): void {
        // console.log("selecionarTipoOcorrenciaFiltro...", this);
        // this.ocorrenciaTipoService.obterFuncionalidadesProgramaUsuario(GerenciadorSessao.usuario.nrDocumento)
        // .then(resposta => {
        //     if (resposta && resposta.length) {
        //         this.filtros.tiposOcorrencia = [];
        //         this.filtros.tiposOcorrencia.push(new Tuple("Todos ...  ", null));
        //         resposta.forEach(item => {
        //             this.filtros.tiposOcorrencia.push(new Tuple(item.valor, item.codigo));
        //         });
        //     } else {
        this.ocorrenciaTipoService.obterFuncionalidade(produto.select)
            .then(resp => {
                this.filtros.tiposOcorrencia = [];
                this.filtros.tiposOcorrencia.push(new Tuple("Todos ...  ", null));
                resp.forEach(item => {
                    this.filtros.tiposOcorrencia.push(
                        new Tuple(item.valor, item.codigo)
                    );
                });
            });
        //     }
        // });
    }

    obterStatusOcorrencia() {
        this.ocorrenciaService.obterStatusOcorrencias().then(resp => {
            this.filtros.listStatusTemp = [];
            if (resp && resp.length > 0) {
                resp.forEach(item => {
                    this.filtros.listStatusTemp.push(new Tuple(item.valor, item.codigo));
                });
            }
        });
    }

    obterClienteFiltro() {
        // console.log("obterClienteFiltro...", this);
        if (this.filtros.produto.select) {
            this.ocorrenciaProdutoService.obterClientes(this.filtros.produto.select)
                .then(resposta => {
                    this.filtros.clientes = [];
                    resposta.forEach(item => {
                        this.filtros.clientes.push(new Tuple(item.valor, item.codigo));
                    });
                });
        } else {
            this.ocorrenciaProdutoService.obterClientes(null)
                .then(resposta => {
                    this.filtros.clientes = [];
                    resposta.forEach(item => {
                        this.filtros.clientes.push(new Tuple(item.valor, item.codigo));
                    });
                });
        }
    }

    obterUsuarios() {
        this.ocorrenciaProdutoService.obterUsuarios().then(resposta => {
            this.listUsuario = resposta;
        });
    }

    obterModalidadeDesenvolvimento() {
        this.ocorrenciaTipoService.obterModalidadeDesenvolvimento(null)
            .then(resposta => {
                let front;
                this.filtros.modalidades = [];
                front = resposta.filter(filtro => filtro.tipo === "FE" || filtro.tipo === "BE" || filtro.tipo === "BD");
                front.forEach(frontEnd => {
                    this.filtros.modalidades.push(frontEnd);
                });
            });
    }

    obterProdutoFiltro() {
        // console.log("obterProdutoFiltro...", this, GerenciadorSessao.usuario);
        if (this.filtros.cliente.select) {
            this.ocorrenciaProdutoService.obterProdutos(this.filtros.cliente.select)
                .then(resposta => {
                    this.filtros.produtos = [];
                    // this.filtros.produtos.push(new Tuple("Todos ...  ", null));
                    resposta.forEach(item => {
                        this.filtros.produtos.push(new Tuple(item.valor, item.codigo));
                    });
                }).then(() => {
                    if (this.filtros.produtos && this.filtros.produtos.length > 1) {
                        this.setProdutoFiltro(this.filtros.produtos[0]);
                    } else if (this.filtros.produtos && this.filtros.produtos.length === 1) {
                        this.setProdutoFiltro(this.filtros.produtos[0]);
                    }
                });
        } else {
            this.ocorrenciaProdutoService.obterProdutos(null)
                .then(resposta => {
                    this.filtros.produtos = [];
                    // this.filtros.produtos.push(new Tuple("Todos ...  ", null));
                    resposta.forEach(item => {
                        this.filtros.produtos.push(
                            new Tuple(item.valor, item.codigo)
                        );
                    });
                }).then(() => {
                    if (this.filtros.produtos && this.filtros.produtos.length > 1) {
                        this.setProdutoFiltro(this.filtros.produtos[1]);
                    } else if (this.filtros.produtos && this.filtros.produtos.length === 1) {
                        this.setProdutoFiltro(this.filtros.produtos[0]);
                    }
                });
        }
    }

    obterStatus() {
        if (this.filtros.listStatus && this.filtros.listStatus.length === 0) {
            this.ocorrenciaService.obterStatus(GerenciadorSessao.usuario.nrDocumento)
                .then(resp => {
                    if (resp && resp.length > 0) {
                        resp.forEach(item => {
                            this.filtros.listStatus.push({
                                label: item.label,
                                valor: item.valor,
                                cor: this.obterCor(item.valor)
                            });
                        });
                    }
                });
        }
    }

    obterCor(status): String {
        return "default";
        // if (status === "TF") {
        //     return "success";
        // } else if (status === "AD") {
        //     return "info";
        // } else if (status === "DE") {
        //     return "desenvolvimento";
        // } else if (
        //     status === "AA" ||
        //     status === "VA" ||
        //     status === "HO" ||
        //     status === "AB"
        // ) {
        //     return "warning";
        // } else if (status === "VB" || status === "HB") {
        //     return "primary";
        // } else if (status === "HC" || status === "AP" || status === "VP") {
        //     return "danger";
        // }
    }

    obterProduto() {
        if (this.filtros.ocorrencia.cdCliente) {
            this.ocorrenciaProdutoService.obterProdutos(this.filtros.ocorrencia.cdCliente)
                .then(resposta => {
                    this.filtros.produtos = [];
                    resposta.forEach(item => {
                        this.filtros.produtos.push(new Tuple(item.valor, item.codigo));
                    });
                }).then(() => {
                    if (
                        this.filtros.produtos &&
                        this.filtros.produtos.length > 1
                    ) {
                        this.labelProduto = "Todos ... ";
                        this.labelTipoOcorrencia = "Todos ... ";
                    } else if (
                        this.filtros.produtos &&
                        this.filtros.produtos.length === 1
                    ) {
                        this.labelProduto = this.filtros.produtos[0].show;
                        this.setProduto(this.filtros.produtos[0]);
                    }
                });
        } else {
            this.ocorrenciaProdutoService.obterProdutos(null)
                .then(resposta => {
                    this.filtros.produtos = [];
                    resposta.forEach(item => {
                        this.filtros.produtos.push(new Tuple(item.valor, item.codigo));
                    });
                }).then(() => {
                    if (this.filtros.produtos && this.filtros.produtos.length > 1) {
                        this.labelProduto = "Todos ... ";
                        this.labelTipoOcorrencia = "Todos ... ";
                    } else if (this.filtros.produtos && this.filtros.produtos.length === 1) {
                        this.labelProduto = this.filtros.produtos[0].show;
                        this.setProduto(this.filtros.produtos[0]);
                    }
                });
        }
    }

    populaOcorrenciaColorida(resp: OcorrenciaGsm[], grid: GridOcorrenciasTecnicoComponent) {
        this._chamadosTemp = [];
        if (!resp.filter((ocorrencia) => { return ocorrencia.inStatus !== 'AD' })) {
            return;
        }
        const desenvolvedores = [];
        if (this.filtros.listDesenvolvedoresSelecionado && this.filtros.listDesenvolvedoresSelecionado.length > 0) {
            this.filtros.listDesenvolvedoresSelecionado.forEach(item => {
                desenvolvedores.push(item.select);
            });
            desenvolvedores.sort();
        }
        const modalidades = [];
        if (this.filtros.listModalidadesSelecionados && this.filtros.listModalidadesSelecionados.length > 0) {
            this.filtros.listModalidadesSelecionados.forEach(item => {
                modalidades.push(item.select);
            });
            modalidades.sort();
        }
        const arrayIdsChamados: { ocorrencias: any[], desenvolvedores: any[], modalidades: any[] } = { ocorrencias: [], desenvolvedores: [], modalidades: [] };
        //passar apenas os IDs das ocorrencias
        resp.forEach((oco: any) => {
            arrayIdsChamados.ocorrencias.push({ idOcorrencia: oco.idOcorrencia });
            arrayIdsChamados.desenvolvedores = desenvolvedores;
            arrayIdsChamados.modalidades = modalidades;
            // delete oco['dsOcorrencia'];
            // delete oco['anexos'];
            // delete oco['branch'];
            // delete oco['cdCliente'];
            // delete oco['cdFuncionalidade'];
            // delete oco['cdUsuarioCadastro'];
            // delete oco['cdSolicitante'];
            // delete oco['cor'];
            // delete oco['distribuicoes'];
            // delete oco['dsCliente'];
            // delete oco['dsFuncionalidade'];
            // delete oco['dsMotivo'];
            // delete oco['idOcorrencia'];
            // delete oco['dsOcorrencia'];
            // delete oco['cdProduto'];
            // delete oco['dsProduto'];
            // delete oco['dsStatus'];
            // delete oco['dsUsuarioSolicitante'];
            // delete oco['dtCadastro'];
            // delete oco['dtConclusao'];
            // delete oco['dtPrevisaoEntrega'];
            // delete oco['dtSolicitacao'];
            // delete oco['historico'];
            // delete oco['inAmbienteEntrada'];
            // delete oco['inNivelComplexidade'];
            // delete oco['inOcorrenciaInterna'];
            // delete oco['inStatus'];
            // delete oco['inTipoDistribuicao'];
            // delete oco['inTipoInterface'];
            // delete oco['inTipoSolicitacao'];
            // delete oco['nrPrioridade1'];
            // delete oco['nrPrioridade2'];
            // delete oco['replicacaoSiapec1'];
            // delete oco['statusDistribuicao'];

        });

        this.ocorrenciaProdutoService.obterDistribuicoesPorVariasOcorrencias(arrayIdsChamados)
            .then(resposta => {
                if (resposta) {
                    // mapear as ocorrencias retornadas Com a distribuicao relacionada
                    resp.map((ocorr: any) => {
                        ocorr.distribuicoes = resposta.filter((distro: any) => { return distro.cdOcorrencia === ocorr.idOcorrencia });
                    });
                }
                this.filtros.chamadosRetornoWS = resp;
                if (
                    this.filtros.chamadosRetornoWS &&
                    this.filtros.chamadosRetornoWS.length > 0
                ) {
                    this.filtros.chamadosRetornoWS.forEach(item => {
                        item["exibe"] = false;
                        item.dtCadastro = this.util.formatarDataUS(
                            item.dtCadastro,
                            "dd/MM/yyyy"
                        );
                        // item.dtAbertura = new Date(item.dtAbertura).toLocaleDateString();
                        item["cor"] = this.obterCor(item.inStatus);
                        //  item["usuario"].nome = item["usuario"].nome.toLowerCase();
                        item.dtSolicitacao = item.dtSolicitacao;

                        item["add"] = false;
                        item["icon"] = "fa fa-square-o";
                        item["classPanelColor"] = "panel-no-selected";
                        if (item.historico && item.historico.length > 0) {
                            item.historico.forEach(hist => {
                                if (hist.dtInicioAtendimento) {
                                    hist.dtInicioAtendimento = this.util.formatarDataUS(
                                        hist.dtInicioAtendimento,
                                        "dd/MM/yyyy"
                                    );
                                    // hist.dtInicioAtendimento = new Date(hist.dtInicioAtendimento).toLocaleDateString();
                                }
                                if (hist.dtFinalAtendimento) {
                                    hist.dtFinalAtendimento = this.util.formatarDataUS(
                                        hist.dtFinalAtendimento,
                                        "dd/MM/yyyy"
                                    );
                                    // hist.dtFinalAtendimento = new Date(hist.dtFinalAtendimento).toLocaleDateString();
                                }
                            });
                        }
                        this._chamadosTemp.push(item);
                        this.totalChamados = this._chamadosTemp.length;
                    });
                    this.ChamadosTempChange.emit(this._chamadosTemp);
                    this.gridOcorrenciasTecnicoTempChange.emit(grid);
                    this.popularFiltros();
                }
                if (grid) {
                    grid.doInfinite(false);
                }
            });
    }

    populaOcorrencia(resp) {
        this._chamadosTemp = [];
        this.filtros.chamadosRetornoWS = resp;
        if (
            this.filtros.chamadosRetornoWS &&
            this.filtros.chamadosRetornoWS.length > 0
        ) {
            this.filtros.chamadosRetornoWS.forEach(item => {
                this._chamadosTemp.push(item);
                this.totalChamados = this._chamadosTemp.length;
            });
            this.ChamadosTempChange.emit(this._chamadosTemp);
        }
    }

    filtrarDescricao(ev: any, grid?: GridOcorrenciasTecnicoComponent) {
        // console.log("filtrarDescricao", this, ev);
        const val = ev.target.value;
        if (val && val.trim() !== "") {
            this._chamadosTemp = [];
            this._chamadosTemp = this.filtros.chamadosRetornoWS.filter(item => {
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
            // console.log("filtraDo", this._chamadosTemp);
            this.totalChamadosFiltrados = this._chamadosTemp.length;
        } else {
            this._chamadosTemp = this.filtros.chamadosRetornoWS;
            this.totalChamadosFiltrados = 0;
        }
        grid.doInfinite(false);
    }

    filtrarData(grid?) {
        if (!this.dtInicio && !this.dtFim) {
            const alert = this.alertCtrl.create({
                title: "Informação",
                message: "Favor informar uma data para realizar a pesquisa!",
                buttons: [
                    {
                        text: "OK"
                    }
                ],
                enableBackdropDismiss: false
            });
            alert.present();
        } else {
            const inicio = new Date(this.dtInicio);
            inicio.setDate(inicio.getDate() + 1);
            const fim = new Date(this.dtFim);
            fim.setDate(fim.getDate() + 1);
            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);
            let longDtInicio = new Date(inicio).getTime();
            let longDtFim = new Date(fim).getTime();
            if (longDtInicio === NaN) {
                longDtInicio = 0;
            }
            if (longDtFim === NaN) {
                longDtFim = 0;
            }
            this._chamadosTemp = this.filtros.chamadosRetornoWS.filter(item => {
                const parts = item.dtSolicitacao ? item.dtSolicitacao.toString().split("-") : "";
                const abertura = new Date(+parts[0], +parts[1] - 1, +parts[2]);
                // console.log(" abertura ", typeof item.dtSolicitacao, item.dtSolicitacao, typeof abertura, abertura);
                abertura.setHours(0, 0, 0, 0);
                const dtAbertura = abertura.getTime();
                if (this.dtInicio && !this.dtFim) {
                    return dtAbertura >= longDtInicio;
                } else if (this.dtFim && !this.dtInicio) {
                    return dtAbertura <= longDtFim;
                } else if (this.dtInicio && this.dtFim) {
                    return (
                        dtAbertura >= longDtInicio && dtAbertura <= longDtFim
                    );
                }
            });
        }
        if (grid) {
            grid.doInfinite(false);
        }
    }

    filtrarAtributos(ev: any) {
        const val = ev.target.value;
        // const val = this.texto_filtrar;
        if (val && val.trim() !== "") {
            this._chamadosTemp = this.filtros.chamadosRetornoWS.filter(item => {
                return (
                    item.dsOcorrencia.toLowerCase().indexOf(val.toLowerCase()) >
                    -1 ||
                    String(item.idOcorrencia)
                        .toLowerCase()
                        .indexOf(val.toLowerCase()) > -1 ||
                    // String(item.cdProdutoServico).toLowerCase().indexOf(val.toLowerCase()) > -1 || //codigo do produto(siapec 1 ou 3). Tentar ver se traz o nome do produto pelo serviço
                    item.dsUsuarioSolicitante
                        .toLowerCase()
                        .indexOf(val.toLowerCase()) > -1
                );
                // item['tipoOcorrencia'].dsTipoOcorrencia.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
            this.totalChamadosFiltrados = this._chamadosTemp.length;
        } else {
            this._chamadosTemp = this.filtros.chamadosRetornoWS;
            this.totalChamadosFiltrados = 0;
        }
    }

    editChamados() {
        this.obterSolicitadoCliente();
        this.obterPrioridadeUm();
        this.obterPrioridadeDois();
        this.obterProduto();
    }

    obterPrioridadeUm() {
        this.filtros.listPrioridadeUm = [];
        this.filtros.listPrioridadeUm.push(
            new Tuple("Nível 1", 1),
            new Tuple("Nível 2", 2)
        );
        if (
            this.filtros.listPrioridadeUm &&
            this.filtros.listPrioridadeUm.length > 1
        ) {
            this.labelPrioridadeUm = "Todos ... ";
        } else if (
            this.filtros.listPrioridadeUm &&
            this.filtros.listPrioridadeUm.length === 1
        ) {
            this.labelPrioridadeUm = this.filtros.listPrioridadeUm[0].show;
        }
    }

    setPrioridadeUm(prioridadeUm) {
        this.filtros.ocorrencia.prioridadeUm = prioridadeUm.selectValue;
        this.labelPrioridadeUm = prioridadeUm.showValue;
    }

    obterPrioridadeDois() {
        this.filtros.listPrioridadeDois = [];
        this.filtros.listPrioridadeDois.push(
            new Tuple("Nível 1", 1),
            new Tuple("Nível 2", 2)
        );
        if (
            this.filtros.listPrioridadeDois &&
            this.filtros.listPrioridadeDois.length > 1
        ) {
            this.labelPrioridadeDois = "Todos ... ";
        } else if (
            this.filtros.listPrioridadeDois &&
            this.filtros.listPrioridadeDois.length === 1
        ) {
            this.labelPrioridadeDois = this.filtros.listPrioridadeDois[0].show;
            this.setPrioridadeDois(this.filtros.listPrioridadeDois[0].select);
        }
    }

    setPrioridadeDois(prioridadeDois) {
        this.filtros.ocorrencia.prioridadeDois = prioridadeDois.selectValue;
        this.labelPrioridadeDois = prioridadeDois.showValue;
    }

    setSolicitadoCliente(solicitadoCliente) {
        this.filtros.ocorrencia.solicitadoCliente =
            solicitadoCliente.selectValue;
        this.labelSolicitadoCliente = solicitadoCliente.showValue;
    }

    obterSolicitadoCliente() {
        this.solicitadoCliente = [];
        this.solicitadoCliente.push(
            new Tuple("Sim", true),
            new Tuple("Não", false)
        );
        if (this.solicitadoCliente && this.solicitadoCliente.length > 1) {
            this.labelSolicitadoCliente = "Todos ... ";
        } else if (
            this.solicitadoCliente &&
            this.solicitadoCliente.length === 1
        ) {
            this.labelSolicitadoCliente = this.solicitadoCliente[0].show;
            this.setSolicitadoCliente(this.solicitadoCliente[0].select);
        }
    }

    alocarTecnico(chamado: OcorrenciaGsm) {
        this.obterSolicitadoCliente();
        this.obterPrioridadeUm();
        this.obterPrioridadeDois();
        this.obterProduto();

        this.filtros.ocorrencia.dsUsuarioAbertura =
            chamado.dsUsuarioSolicitante;
        this.filtros.ocorrencia.dtAbertura = chamado.dtCadastro;
    }

    limparFiltros(grid) {
        this.dtInicio = null;
        this.dtFim = null;
        this.dsPesq = null;
        this.filtros = new FiltrosPesquisa();
        this.limparListFiltros();
        this._chamadosTemp = this.filtros.chamadosRetornoWS;
        // Limpando pra testar e não funcionou

        this.ngOnInit();

    }

    formIsValid(): boolean {
        let valida = false;
        // console.log("formIsValid...", this);
        if (this.filtros.ocorrenciaGsm.cdProduto !== 3) {
            if (this.filtros.ocorrenciaGsm.dsOcorrencia) {
                this.reqMsgDesc = null;
            } else {
                this.reqMsgDesc = "Campo Obrigatório";
            }
            if (this.filtros.ocorrenciaGsm.cdProduto) {
                this.reqMsgProd = null;
            } else {
                this.reqMsgProd = "Campo Obrigatório";
            }
            if (this.filtros.ocorrenciaGsm.cdFuncionalidade) {
                this.reqMsgTipo = null;
            } else {
                this.reqMsgTipo = "Campo Obrigatório";
            }
            if (this.filtros.ocorrenciaGsm.cdCliente) {
                this.reqMsgCliente = null;
            } else {
                this.reqMsgCliente = "Campo Obrigatório";
            }
            if (this.filtros.ocorrenciaGsm.dsOcorrencia && this.filtros.ocorrenciaGsm.cdProduto && this.filtros.ocorrenciaGsm.cdFuncionalidade) {
                valida = true;
            } else {
                valida = false;
            }
            return valida;
        }
    }

    novaOcorrencia() {
        this.filtros.ocorrenciaGsm = new OcorrenciaGsm();
        this.filtros.ocorrenciaGsm.distribuicoes = [];
        this.obterProduto();
        this.reqMsgPrioridadeUm = "";
        this.reqMsgPrioridadeDois = "";
        this.reqMsgTipoInterface = "";
        this.reqMsgAmbiente = "";
        this.reqMsgSolicitado = "";
        this.reqMsgProd = "";
        this.reqMsgTipo = "";
        this.reqMsgDesc = "";
        this.reqMsgReabertura = "";
        this.filtros.tipoOcorrencia.show = "Todos ... ";
        // this.filtros.modalidadeDesenvolvimento = new Tuple("Todos...", "");
    }

    pesquisarPorStatus(status): Promise<any> {
        return new Promise<any>(resolve => {
            this.filtros.status = status;
            this.cargaInicial().then(() => {
                const load = this.loadingCtrl.create({
                    content: "Buscando Ocorrências..."
                });
                load.present()
                    .then(() => {
                        const _CTemp = Object.assign([], this.chamadosTemp);
                        this.chamadosTemp = [];
                        _CTemp.forEach((element: OcorrenciaGsm) => {
                            if (this.filtros.status.valor !== "Todos ... ") {
                                if (
                                    element.inStatus ===
                                    this.filtros.status.codigo
                                ) {
                                    this.chamadosTemp.push(element);
                                }
                            }
                        });
                        load.dismiss();
                        resolve();
                        return;
                    })
                    .catch(erro => {
                        load.dismiss();
                    });
                load.dismiss();
            });
        });
    }

    alteraData() {
        if (this.inAguardandoViabilidade == false && this.inAtendimento == false) {
            setTimeout (() => {
                this.dtInicio = new Date();
                this.dtInicio.setDate(new Date().getDate() - 30);
                // this.filtros.dtInicio.setDate(new Date().getDate() - 30);
                this.dtInicio = this.util.formatarDataUS(this.dtInicio.toDateString(), 'yyyy-MM-dd');
                this.dtFim = new Date();
                this.dtFim = this.util.formatarDataUS(this.dtFim.toDateString(), 'yyyy-MM-dd');
            });
        }
    }

    pesquisarWS(grid?: GridOcorrenciasTecnicoComponent) {
        //console.log('pesquisarWS...', this);
        this.cargaInicial().then(() => {
            const load = this.loadingCtrl.create({
                content: "Buscando Ocorrências..."
            });
            load.present()
                .then(() => {
                    const obj = {
                        usuarioAbertura: GerenciadorSessao.usuario.nrDocumento,
                        inStatus: this.filtros.status.valor
                    };
                    const status = [];
                    if (this.filtros.listStatusSelecionado && this.filtros.listStatusSelecionado.length > 0) {
                        this.filtros.listStatusSelecionado.forEach(item => {
                            if (item.select != null) {
                                status.push(item.select);
                            }
                        });
                    }
                    const clientes = [];
                    if (this.filtros.listClientesSelecionados && this.filtros.listClientesSelecionados.length > 0) {
                        this.filtros.listClientesSelecionados.forEach(item => {
                            clientes.push(item.select);
                        });
                        clientes.sort();
                    }
                    const produtos = [];
                    if (this.filtros.listProdutosSelecionados && this.filtros.listProdutosSelecionados.length > 0) {
                        this.filtros.listProdutosSelecionados.forEach(item => {
                            produtos.push(item.select);
                        });
                        produtos.sort();
                    }
                    const prioriades1 = [];
                    if (this.filtros.prioridades1Selecionados && this.filtros.prioridades1Selecionados.length > 0) {
                        this.filtros.prioridades1Selecionados.forEach(item => {
                            prioriades1.push(item.select);
                        });
                        prioriades1.sort();
                    }
                    const prioriades2 = [];
                    if (this.filtros.prioridades2Selecionados && this.filtros.prioridades2Selecionados.length > 0) {
                        this.filtros.prioridades2Selecionados.forEach(item => {
                            prioriades2.push(item.select);
                        });
                        prioriades2.sort();
                    }
                    const desenvolvedores = [];
                    if (this.filtros.listDesenvolvedoresSelecionado && this.filtros.listDesenvolvedoresSelecionado.length > 0) {
                        this.filtros.listDesenvolvedoresSelecionado.forEach(item => {
                            desenvolvedores.push(item.select);
                        });
                        desenvolvedores.sort();
                    }
                    const modalidades = [];
                    if (this.filtros.listModalidadesSelecionados && this.filtros.listModalidadesSelecionados.length > 0) {
                        this.filtros.listModalidadesSelecionados.forEach(item => {
                            modalidades.push(item.select);
                        });
                        modalidades.sort();
                    }
                    const tipoSolicitacoes = [];
                    if (this.filtros.listTipoSolicitacaoSelecionado && this.filtros.listTipoSolicitacaoSelecionado.length > 0) {
                        this.filtros.listTipoSolicitacaoSelecionado.forEach(item => {
                            tipoSolicitacoes.push(item.select);
                        });
                        tipoSolicitacoes.sort();
                    }
                    const nivelComplexidade = [];
                    if (this.filtros.listNivelComplexidadeSelecionado && this.filtros.listNivelComplexidadeSelecionado.length > 0) {
                        this.filtros.listNivelComplexidadeSelecionado.forEach(item => {
                            nivelComplexidade.push(item.select);
                        });
                        nivelComplexidade.sort();
                    }
                    const nivelSeveridade = [];
                    if (this.filtros.listNivelSeveridadeSelecionado && this.filtros.listNivelSeveridadeSelecionado.length > 0) {
                        this.filtros.listNivelSeveridadeSelecionado.forEach(item => {
                            nivelSeveridade.push(item.select);
                        });
                        nivelSeveridade.sort();
                    }
                    const funcionalidades = [];
                    if (this.filtros.listFuncionalidadeSelecionada && this.filtros.listFuncionalidadeSelecionada.length > 0) {
                        this.filtros.listFuncionalidadeSelecionada.forEach(item => {
                            funcionalidades.push(item.select);
                        });
                        funcionalidades.sort();
                    }
                    const solicitantes = [];
                    if (this.filtros.solicitanteSelecionado && this.filtros.solicitanteSelecionado.length > 0) {
                        this.filtros.solicitanteSelecionado.forEach(item => {
                            solicitantes.push(item.select);
                        });
                        solicitantes.sort();
                    }
                    const convertFiltroPainelWS = {
                        status: status,
                        dataInicial: this.dtInicio,
                        dataFinal: this.dtFim,
                        clientes: clientes,
                        produtos: produtos,
                        descricao: null,
                        prioridades1: prioriades1,
                        prioridades2: prioriades2,
                        desenvolvedores: desenvolvedores,
                        modalidades: modalidades,
                        inTipoSolicitacao: tipoSolicitacoes,
                        inNivelComplexidade: nivelComplexidade,
                        homologador: null,
                        idUsuario: GerenciadorSessao.usuario.nrDocumento,
                        funcionalidades: funcionalidades,
                        inAtendimento: this.inAtendimento,
                        inAguardandoViabilidade: this.inAguardandoViabilidade,
                        inOcorrenciaInterna: this.filtros.inOcorrenciaInterna,
                        solicitantes: solicitantes
                    };
                    this.ocorrenciaProdutoService.obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS)
                        .then(resp => {
                            if (convertFiltroPainelWS.inAguardandoViabilidade == false && convertFiltroPainelWS.inAtendimento == false) {
                                // resp.inStatus = "TF"
                                const chamados = resp.filter(item => item.inStatus == "TF");
                                this.populaOcorrenciaColorida(chamados, grid);
                            } else {
                                this.populaOcorrenciaColorida(resp, grid);
                            }
                        }).then(() => {
                            load.dismiss();
                            if (this.dtInicio || this.dtFim) {
                                this.filtrarData();
                            }
                        }).catch(erro => {
                            console.error("obterOcorrenciasGsmPorFiltrosPainelOcorrencia", erro);
                            load.dismiss();
                        });
                }).catch(erro => {
                    load.dismiss();
                });
        });
    }

    gerarCsvWS() {
        this.cargaInicial().then(() => {
            const load = this.loadingCtrl.create({
                content: "Buscando Ocorrências..."
            });
            load.present()
                .then(() => {
                    const obj = {
                        usuarioAbertura: GerenciadorSessao.usuario.nrDocumento,
                        inStatus: this.filtros.status.valor
                    };
                    const status = [];
                    if (this.filtros.listStatusSelecionado && this.filtros.listStatusSelecionado.length > 0) {
                        this.filtros.listStatusSelecionado.forEach(item => {
                            if (item.select != null) {
                                status.push(item.select);
                            }
                        });
                    }
                    const clientes = [];
                    if (this.filtros.listClientesSelecionados && this.filtros.listClientesSelecionados.length > 0) {
                        this.filtros.listClientesSelecionados.forEach(item => {
                            clientes.push(item.select);
                        });
                        clientes.sort();
                    }
                    const produtos = [];
                    if (this.filtros.listProdutosSelecionados && this.filtros.listProdutosSelecionados.length > 0) {
                        this.filtros.listProdutosSelecionados.forEach(item => {
                            produtos.push(item.select);
                        });
                        produtos.sort();
                    }
                    const prioriades1 = [];
                    if (this.filtros.prioridades1Selecionados && this.filtros.prioridades1Selecionados.length > 0) {
                        this.filtros.prioridades1Selecionados.forEach(item => {
                            prioriades1.push(item.select);
                        });
                        prioriades1.sort();
                    }
                    const prioriades2 = [];
                    if (this.filtros.prioridades2Selecionados && this.filtros.prioridades2Selecionados.length > 0) {
                        this.filtros.prioridades2Selecionados.forEach(item => {
                            prioriades2.push(item.select);
                        });
                        prioriades2.sort();
                    }
                    const desenvolvedores = [];
                    if (this.filtros.listDesenvolvedoresSelecionado && this.filtros.listDesenvolvedoresSelecionado.length > 0) {
                        this.filtros.listDesenvolvedoresSelecionado.forEach(item => {
                            desenvolvedores.push(item.select);
                        });
                        desenvolvedores.sort();
                    }
                    const modalidades = [];
                    if (this.filtros.listModalidadesSelecionados && this.filtros.listModalidadesSelecionados.length > 0) {
                        this.filtros.listModalidadesSelecionados.forEach(item => {
                            modalidades.push(item.select);
                        });
                        modalidades.sort();
                    }
                    const tipoSolicitacoes = [];
                    if (this.filtros.listTipoSolicitacaoSelecionado && this.filtros.listTipoSolicitacaoSelecionado.length > 0) {
                        this.filtros.listTipoSolicitacaoSelecionado.forEach(item => {
                            tipoSolicitacoes.push(item.select);
                        });
                        tipoSolicitacoes.sort();
                    }
                    const nivelComplexidade = [];
                    if (this.filtros.listNivelComplexidadeSelecionado && this.filtros.listNivelComplexidadeSelecionado.length > 0) {
                        this.filtros.listNivelComplexidadeSelecionado.forEach(item => {
                            nivelComplexidade.push(item.select);
                        });
                        nivelComplexidade.sort();
                    }
                    const funcionalidades = [];
                    if (this.filtros.listFuncionalidadeSelecionada && this.filtros.listFuncionalidadeSelecionada.length > 0) {
                        this.filtros.listFuncionalidadeSelecionada.forEach(item => {
                            funcionalidades.push(item.select);
                        });
                        funcionalidades.sort();
                    }
                    const solicitantes = [];
                    if (this.filtros.solicitanteSelecionado && this.filtros.solicitanteSelecionado.length > 0) {
                        this.filtros.solicitanteSelecionado.forEach(item => {
                            solicitantes.push(item.select);
                        });
                        solicitantes.sort();
                    }

                    const convertFiltroPainelWS = {
                        status: status,
                        dataInicial: this.dtInicio,
                        dataFinal: this.dtFim,
                        clientes: clientes,
                        produtos: produtos,
                        descricao: null,
                        prioridades1: prioriades1,
                        prioridades2: prioriades2,
                        desenvolvedores: desenvolvedores,
                        modalidades: modalidades,
                        inTipoSolicitacao: tipoSolicitacoes,
                        inNivelComplexidade: nivelComplexidade,
                        homologador: null,
                        idUsuario: GerenciadorSessao.usuario.nrDocumento,
                        funcionalidades: funcionalidades,
                        inAtendimento: this.inAtendimento,
                        inAguardandoViabilidade: this.inAguardandoViabilidade,
                        inOcorrenciaInterna: this.filtros.inOcorrenciaInterna,
                        solicitantes: solicitantes
                    };
                    this.ocorrenciaProdutoService.gerarCsvWS(convertFiltroPainelWS)
                        .catch(erro => {
                            console.error("gerarCsvWS", erro);
                            load.dismiss();
                        });
                }).then(() => {
                    load.dismiss();
                }).catch(erro => {
                    load.dismiss();
                });
        });
    }

    popularFiltros(): void {
        if (this._chamadosTemp && this._chamadosTemp.length > 0) {
            this.limparListFiltros();
            this._chamadosTemp.forEach(item => {
                this.popularSolicitante(item);
                this.popularProdutos(item);
                this.popularFuncionalidades(item);
                this.popularClientes(item);
                this.popularPrioridades(item);
                this.popularStatus(item);
                this.addOpcaoDefaultFiltros();
                if (item.distribuicoes && item.distribuicoes.length > 0) {
                    item.distribuicoes.forEach(dist => {
                        this.popularModalidades(dist);
                        this.popularTecnicos(dist);
                    });
                }
            });
        }
        //Traz todos os tecnicos já não está carregando as distribuições
        // if (this.listUsuario && this.listUsuario.length) {
        //     this.listUsuario.forEach(element => {
        //         this.filtros.desenvolvedores.push(new Tuple(element.nome, element.idUsuario));
        //     });
        // }
        this.popularDtPrevisaUsuario();
        // console.log('popularFiltros...', this);
    }

    popularSolicitante(item) {
        // console.log("popularSolicitante", item);
        let encontrou = this.filtros.listSolicitante.find(p => p.select === item.cdUsuarioSolicitante);
        if (item.cdUsuarioSolicitante && item.dsUsuarioSolicitante && !encontrou) {
            this.filtros.listSolicitante.push(new Tuple(item.dsUsuarioSolicitante, item.cdUsuarioSolicitante));
        }
        this.filtros.listSolicitante.sort();
    }

    limparListFiltros(): void {
        this.filtros.produtos = null;
        this.filtros.tiposOcorrencia = null;
        this.filtros.clientes = null;
        this.filtros.listPrioridadeUm = null;
        this.filtros.listPrioridadeDois = null;
        this.filtros.listUsuarioSm = null;
        this.listUsuarioDtPrevisao = null;
        this.filtros.listStatusTemp = null;
        this.filtros.desenvolvedoresTarefasEmDesenvolvimento = null;
        this.filtros.desenvolvedoresTodasTarefas = null;
        this.filtros.modalidades = null;
        this.filtros.listSolicitante = null;

        this.filtros.produtos = [];
        this.filtros.listSolicitante = [];
        this.filtros.tiposOcorrencia = [];
        this.filtros.clientes = [];
        this.filtros.listPrioridadeUm = [];
        this.filtros.listPrioridadeDois = [];
        this.filtros.listUsuarioSm = [];
        this.listUsuarioDtPrevisao = [];
        // ComboMultiple
        this.filtros.listStatusTemp = [];
        this.filtros.desenvolvedoresTarefasEmDesenvolvimento = [];
        this.filtros.desenvolvedoresTodasTarefas = [];
        this.filtros.modalidades = [];

    }

    addOpcaoDefaultFiltros(): void {
        // console.log("addOpcaoDefaultFiltros...", this, GerenciadorSessao.usuario);
        if (!this.filtros.produto.select) {
            this.filtros.ocorrenciaGsm.cdProduto = this.filtros.produtos[0].select;
            this.filtros.produto = this.filtros.produtos[0];
        }
        if (!this.filtros.tipoOcorrencia.select) {
            this.filtros.tipoOcorrencia = this.filtros.tiposOcorrencia[0];
        }
        if (this.filtros.cliente && !this.filtros.cliente.select) {
            this.filtros.ocorrenciaGsm.cdCliente = this.filtros.clientes[0].select;
            if (GerenciadorSessao.usuario.cdCliente) {
                this.filtros.cliente = this.filtros.clientes.find(c => c.select === GerenciadorSessao.usuario.cdCliente);
            } else {
                this.filtros.cliente = this.filtros.clientes.find(c => c.show === "SM");
            }
        } else if (GerenciadorSessao.usuario.funcionario) {
            this.filtros.cliente = new Tuple('Selecione...', null);
            // this.filtros.cliente = this.filtros.clientes.find(c => c.show === "SM");
            this.filtros.clientes = this.filtros.clientes.filter(c => c.select !== 'SM');
        } else {
            this.filtros.cliente = this.filtros.clientes.find(c => c.select === GerenciadorSessao.usuario.cdCliente);
        }
        if (!this.filtros.prioridadeUm) {
            if (!this.filtros.prioridadeUm.select) {
                this.filtros.prioridadeUm = this.filtros.listPrioridadeUm[0];
            }
        }
        if (!this.filtros.prioridadeDois) {
            if (!this.filtros.prioridadeDois.select) {
                this.filtros.prioridadeDois = this.filtros.listPrioridadeDois[0];
            }
        }
        if (!this.filtros.modalidadeDesenvolvimento.select) {
            this.filtros.modalidadeDesenvolvimento = (this.filtros.modalidades[0]) ? this.filtros.modalidades[0] : new Tuple("Todos ...", null);
        }
        // const usuario = new Usuario();
        // usuario.idUsuario = "";
        // usuario.nome = "Todos...";
        // console.log("usuario::: ", JSON.stringify(usuario));
        // this.filtros.listUsuarioSm.push(usuario);
        // if (!this.filtros.desenvolvedorSm.select) {
        //     this.filtros.desenvolvedorSm = new Tuple(this.filtros.listUsuarioSm[0].nome, this.filtros.listUsuarioSm[0].idUsuario);
        // }

    }

    popularProdutos(item: OcorrenciaGsm): void {
        if (item.cdProduto && item.dsProduto && !this.filtros.produtos.find(p => p.select === item.cdProduto)) {
            this.filtros.produtos.push(new Tuple(item.dsProduto, item.cdProduto));
        }
        this.filtros.produtos.sort();
    }

    popularFuncionalidades(item: OcorrenciaGsm): void {
        if (item.cdFuncionalidade && item.dsFuncionalidade && !this.filtros.tiposOcorrencia.find(p => p.select === item.cdFuncionalidade)) {
            this.filtros.tiposOcorrencia.push(new Tuple(item.dsFuncionalidade, item.cdFuncionalidade));
        }
        this.filtros.tiposOcorrencia.sort();
    }

    popularClientes(item: OcorrenciaGsm): void {
        if (item.cdCliente && item.dsCliente && !this.filtros.clientes.find(p => p.select === item.cdCliente)) {
            this.filtros.clientes.push(new Tuple(item.dsCliente, item.cdCliente));
        }
        this.filtros.clientes.sort();
    }

    popularPrioridades(item: OcorrenciaGsm): void {
        if (item.nrPrioridade1 !== null && item.nrPrioridade1 !== undefined && !this.filtros.listPrioridadeUm.find(p => p.select === item.nrPrioridade1)) {
            this.filtros.listPrioridadeUm.push(new Tuple("Nível " + item.nrPrioridade1, item.nrPrioridade1));
            if (!this.filtros.listPrioridadeUmGrid.find(p => p.select === item.nrPrioridade1)) {
                this.filtros.listPrioridadeUmGrid.push(new Tuple("Nível " + item.nrPrioridade1, item.nrPrioridade1));
            }
        }
        this.filtros.listPrioridadeUm.sort();
        this.filtros.listPrioridadeUmGrid.sort();
        if (item.nrPrioridade2 !== null && item.nrPrioridade2 !== undefined && !this.filtros.listPrioridadeDois.find(p => p.select === item.nrPrioridade2)) {
            this.filtros.listPrioridadeDois.push(new Tuple("Nível " + item.nrPrioridade2, item.nrPrioridade2));
            if (!this.filtros.listPrioridadeDoisGrid.find(p => p.select === item.nrPrioridade2)) {
                this.filtros.listPrioridadeDoisGrid.push(new Tuple("Nível " + item.nrPrioridade2, item.nrPrioridade2));
            }
        }
        this.filtros.listPrioridadeDois.sort();
        this.filtros.listPrioridadeDoisGrid.sort();
    }

    popularModalidades(dist: DistribuicaoOcorrenciaGsm): void {
        if (dist.cdTipoTarefa && !this.filtros.modalidades.find(p => p.select === dist.cdTipoTarefa)) {
            this.filtros.modalidades.push(new Tuple(dist.tipoTarefa, dist.cdTipoTarefa));
        }
        this.filtros.modalidades.sort();
    }

    addTecnico(dist): void {
        const user = this.listUsuario.find(p => p.nrDocumento === dist.cdUsuarioAtendimento);
        if (user) {
            this.filtros.desenvolvedoresTarefasEmDesenvolvimento.push(new Tuple(user.nome, user.idUsuario));
            this.filtros.desenvolvedoresTarefasEmDesenvolvimento.sort();
        }
    }

    popularTecnicos(dist: DistribuicaoOcorrenciaGsm): void {
        // console.log('popularTecnicos...', dist, this);
        if (!this.filtros.desenvolvedoresTarefasEmDesenvolvimento || !this.filtros.desenvolvedoresTarefasEmDesenvolvimento.length ||
            !this.filtros.desenvolvedoresTarefasEmDesenvolvimento.find(d => d.show === dist.dsUsuarioAtendimento)) {
            this.addTecnico(dist);
        }

        //Velha
        // if (dist.cdUsuarioAtendimento && this.filtros.listStatusSelecionado.find(e => e.select === 'DE') && dist.inStatus !== "F" &&
        //     !this.filtros.listUsuarioSm.find(u => u.nrDocumento === dist.cdUsuarioAtendimento)) {
        //     const user = this.listUsuario.find(p => p.nrDocumento === dist.cdUsuarioAtendimento);
        //     if (user) {
        //         this.filtros.listUsuarioSm.push(user);
        //         this.filtros.desenvolvedoresTarefasEmDesenvolvimento.push(new Tuple(user.nome, user.idUsuario));
        //     }
        //     this.filtros.desenvolvedoresTarefasEmDesenvolvimento.sort();
        // } else if (dist.cdUsuarioAtendimento && !this.filtros.listUsuarioSm.find(u => u.nrDocumento === dist.cdUsuarioAtendimento)) {
        //     const user = this.listUsuario.find(p => p.nrDocumento === dist.cdUsuarioAtendimento);
        //     if (user) {
        //         this.filtros.listUsuarioSm.push(user);
        //         //na aba de Em Atendimento, só deverar carregar a combo de tecnicos com chamados em Atendimento ou Iniciado
        //         if (String(window.location.href).includes('home-tecnico')) {
        //             if (dist.inStatus === "A" || dist.inStatus === "I") {
        //                 this.filtros.desenvolvedoresTarefasEmDesenvolvimento.push(new Tuple(user.nome, user.idUsuario));
        //                 this.filtros.desenvolvedoresTarefasEmDesenvolvimento.sort();
        //             }
        //         } else {
        //             this.filtros.desenvolvedoresTarefasEmDesenvolvimento.push(new Tuple(user.nome, user.idUsuario));
        //             this.filtros.desenvolvedoresTarefasEmDesenvolvimento.sort();
        //         }
        //     }
        // }

        // if (this.filtros.listUsuarioSm) {
        //     if (dist.cdUsuarioAtendimento && !this.filtros.listUsuarioSm.find(u => u.nrDocumento === dist.cdUsuarioAtendimento)) {
        //         const user = this.listUsuario.find(p => p.nrDocumento === dist.cdUsuarioAtendimento);
        //         if (user) {
        //             this.filtros.listUsuarioSm.push(user);
        //             this.filtros.desenvolvedoresTodasTarefas.push(new Tuple(user.nome, user.idUsuario));
        //             this.filtros.desenvolvedoresTodasTarefas.sort();
        //         }
        //     }
        // }

        // Combo Multiple
        // if (dist.dtprevisaoEntrega && !this.listUsuarioDtPrevisao.find(d => d.id === dist.cdUsuarioAtendimento)) {
        //     const datas: Date[] = [];
        //     datas.push(new Date(dist.dtprevisaoEntrega));
        //     this.listUsuarioDtPrevisao.push({ id: this.listUsuario.find(p => p.nrDocumento === dist.cdUsuarioAtendimento).idUsuario, datas: datas });
        // } else if (dist.dtprevisaoEntrega && this.listUsuarioDtPrevisao.find(d => d.id === dist.cdUsuarioAtendimento)) {
        //     const datas: Date[] = [];
        //     datas.push(dist.dtprevisaoEntrega);
        //     const obj = this.listUsuarioDtPrevisao.find(d => d.id === dist.cdUsuarioAtendimento);
        //     obj.datas.push(new Date(dist.dtprevisaoEntrega));
        // }
    }

    popularStatus(item: OcorrenciaGsm): void {
        if (item.inStatus && item.dsStatus && !this.filtros.listStatusTemp.find(p => p.select === item.inStatus)) {
            this.filtros.listStatusTemp.push(new Tuple(item.dsStatus, item.inStatus));
        }
        this.filtros.listStatusTemp.sort();
    }

    popularDtPrevisaUsuario() {
        // Combo Multiple
        if (this.filtros && this.filtros.desenvolvedoresTodasTarefas && this.filtros.desenvolvedoresTodasTarefas.length > 0) {
            this.filtros.desenvolvedoresTodasTarefas.forEach((u: any) => {
                const objDtUser = (this.listUsuarioDtPrevisao) ? this.listUsuarioDtPrevisao.find(d => d.id === u.selectValue) : null;
                if (u && objDtUser && objDtUser.datas && objDtUser.datas.length > 0) {
                    objDtUser.datas = objDtUser.datas.sort(function (a, b) {
                        return a.getTime() < b.getTime() ? -1 : a.getTime() === b.getTime() ? 0 : 1;
                    });
                    if (typeof objDtUser.datas[objDtUser.datas.length - 1] === 'string') {
                        const parts = objDtUser.datas[objDtUser.datas.length - 1].toString().split("-");
                        const previsao = new Date(+parts[0], +parts[1], +parts[2]);
                        previsao.setDate(previsao.getDate() + 1);
                        if (previsao) {
                            u['dtPrevisaoEntrega'] = previsao.toLocaleDateString();
                        }
                    } else {
                        objDtUser.datas[objDtUser.datas.length - 1].setDate(objDtUser.datas[objDtUser.datas.length - 1].getDate() + 1);
                        u['dtPrevisaoEntrega'] = objDtUser.datas[objDtUser.datas.length - 1].toLocaleDateString();
                    }
                } else {
                    u['dtPrevisaoEntrega'] = "Sem Previsão";
                }
            });
        }
    }

    setCliente(cliente) {
        this.filtros.ocorrencia.cdCliente = cliente.selectValue;
        this.labelCliente = cliente.showValue;
    }

    setTipoDesenvolvimentoFront(desenvolvedor) {
        this.filtros.ocorrencia.tipoDesenvolvimento = desenvolvedor.codigo;
        this.filtros.modalidadeDesenvolvimento.select = desenvolvedor.codigo;
        this.filtros.modalidadeDesenvolvimento.show = desenvolvedor.valor;
    }

    setUsuarios(desenvolvedor) {
        this.filtros.ocorrencia.desenvolvedorSm = desenvolvedor.idUsuario;
        this.labelUsuarioSm = desenvolvedor.nome;
    }

    // set dos filtros
    setProdutoFiltro(produto: Tuple) {
        this.filtros.produto = produto;
        this.filtros.ocorrenciaGsm.cdProduto = produto.select;
        this.selecionarTipoOcorrenciaFiltro(this.filtros.produto);
        this.obterClienteFiltro();
    }

    setProduto(produto: Tuple) {
        this.filtros.produto = produto;
        this.filtros.ocorrenciaGsm.cdProduto = produto.select;
        this.selecionarTipoOcorrencia();
    }

    setTipoOcorrencia(tipoOcorrencia) {
        this.filtros.ocorrencia.cdTipoOcorrencia = tipoOcorrencia.select;
        this.filtros.tipoOcorrencia.select = tipoOcorrencia.select;
        this.filtros.tipoOcorrencia.show = tipoOcorrencia.show;
    }

    setTipoOcorrenciaFiltro(funcionalidade) {
        this.filtros.funcionalidade = funcionalidade;
        if (funcionalidade.select) {
            if (!this.filtros.listFuncionalidadeSelecionada.find(f => f.select === funcionalidade.select)) {
                this.filtros.listFuncionalidadeSelecionada.push(funcionalidade);
            } else {
                this.filtros.listFuncionalidadeSelecionada.splice(this.filtros.listFuncionalidadeSelecionada.indexOf(funcionalidade), 1);
            }
        } else {
            if (this.filtros.listFuncionalidadeSelecionada && this.filtros.listFuncionalidadeSelecionada.length === 0) {
                this.filtros.tiposOcorrencia.forEach(f => {
                    // if (f.select) {
                    this.filtros.listFuncionalidadeSelecionada.push(f);
                    // }
                });
            } else {
                this.filtros.listFuncionalidadeSelecionada = [];
            }
        }
        // console.log('setTipoOcorrenciaFiltro...', funcionalidade, this.filtros.listFuncionalidadeSelecionada);
        // 'fa fa-check-square'
    }

    getAdd(id): string {
        if (this.filtros.listFuncionalidadeSelecionada.find(f => f.select === id)) {
            return "fa-check-square";
        } else {
            return "fa-square-o";
        }
    }
    listFuncionalidadeSelecionada(items) {
        this.filtros.listFuncionalidadeSelecionada = items;
    }
    getAllSelected(): number {
        return this.filtros.listFuncionalidadeSelecionada.filter(f => f.select).length;
    }

    setPrioridadeUmFiltro(prioridadeUm) {
        this.filtros.prioridadeUm = prioridadeUm;
    }

    setPrioridadeDoisFiltro(prioridadeDois) {
        this.filtros.prioridadeDois = prioridadeDois;
    }

    setTipoDesenvolvimentoFrontFiltro(frontEnd) {
        // this.filtros.tipoDesenvolvimentoFront = frontEnd.codigo;
        this.filtros.modalidadeDesenvolvimento = new Tuple(
            frontEnd.valor,
            frontEnd.codigo
        );
    }
    setTipoDesenvolvimentoBackFiltro(backEnd) {
        // this.filtros.tipoDesenvolvimentoBack = backEnd.codigo;
        this.filtros.tipoDesenvolvimentoBack = new Tuple(
            backEnd.valor,
            backEnd.codigo
        );
    }
    setClienteFiltro(cliente) {
        this.filtros.ocorrenciaGsm.cdCliente = cliente.select;
        this.filtros.cliente = cliente;
    }
}
