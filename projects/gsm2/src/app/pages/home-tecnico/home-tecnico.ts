import { Component, EventEmitter, OnInit, ViewChild, Input, Output } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AlertController, IonicPage, LoadingController } from "ionic-angular";
import * as $ from 'jquery';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { FiltrosPesquisaTecnicoComponent } from "../../components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component";
import { PainelVisualizacaoOcorrenciasComponent } from "../../components/painel-visualizacao-ocorrencias/painel-visualizacao-ocorrencias.component";
import { OcorrenciaGsm, OcorrenciaGsmAnexo } from "../../objects/entidades/OcorrenciaGsm";
import { Tuple } from '../../objects/entidades/Tuple';
import { Usuario } from "../../objects/entidades/Usuario";
import { OcorrenciaService } from "../../services/OcorrenciaService";
import { Util } from '../../services/util/Util';
import { AppGsmModule } from './../../app.gsm.module';
import { FiltrosPesquisa } from './../../components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { Masks } from "./../../components/validators/masks";
import { Ocorrencia } from "./../../objects/entidades/Ocorrencia";
import { GerenciadorSessao } from "./../../services/util/GerenciadorSessao";
import { DistribuicaoOcorrenciaGsm } from "../../objects/entidades/DistribuicaoOcorrenciaGsm";
import { OcorrenciaGsmService } from "projects/gsm2/src/app/services/OcorrenciaGsmService";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { GridOcorrenciasTecnicoComponent } from './../../components/grid-ocorrencias-tecnico/grid-ocorrencias-tecnico.component';
import { UsuarioService } from "../../services/UsuarioService";

@IonicPage()
@Component({
    selector: "page-home-tecnico",
    templateUrl: "home-tecnico.html",
    styleUrls: ["home-tecnico.scss"]
})
export class HomeTecnicoPage implements OnInit {

    labelProduto: String;
    labelTipoOcorrencia: String;
    reqMsgProd: string;
    reqMsgTipo: string;
    reqMsgDesc: string;
    reqMsgReabertura: string;
    reqMsgStatus: string;
    reqMsgPrioridadeUm: string;
    reqMsgPrioridadeDois: string;
    reqMsgTipoInterface: string;
    reqMsgAmbiente: string;
    reqMsgSolicitado: string;

    onCpfCnpjChange = new EventEmitter();
    mask: Masks;
    cdOcorrencia: number;

    mostrar: Boolean;
    resultado: Boolean = false;

    @Output() pesquisar: EventEmitter<String> = new EventEmitter<String>();
    @Input() painel: string = "em Desenv.";
    @Input()
    inAtendimento: boolean = true;
    @Input() public dtInicio: any = null;
    @Input() public dtFim: any = null;
    totalDistribuicao: any;
    totalOcorrencias: any;

    listaOcorrencias: Array<any> = [];
    usuario: Usuario;
    status: { label: string, valor: string, cor: string };
    listStatus: { label: string, valor: string, cor: string }[] = [];

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
    tiposOcorrencia: Tuple[];
    ocorrencia: Ocorrencia = new Ocorrencia();
    // novos campos siapec3
    filtro: Boolean = true;

    prioridadeUm: Tuple[];
    prioridadeDois: Tuple[];
    tipoInterface: Tuple[];
    ambienteInterface: Tuple[];

    backEndBanco: Tuple[];
    modalidadeDesenvolvimento: Array<{ codigo: number, valor: string, tipo: string }> = [];
    tipoDesenvolvimentoBack: Array<{ codigo: number, valor: string, tipo: string }> = [];
    backEndJava: Tuple[];
    frontEndAngular: Tuple[];
    frontEndWi: Tuple[];
    clientes: Tuple[];
    chamadosResponse: Array<Ocorrencia>;

    mostrarFiltros: Boolean = true;

    listOcorrenciaInterna: {
        uf: string,
        produto: string,
        prioridade1: number,
        prioridade2: number,
        ambiente: string,
        interface: string,
        funcionalidade: string,
        descricao: string,
        status: string,
        dtPrevisaoEntrega: Date,
        branch: string,
        alpha: boolean,
        beta: boolean
    }[] = [];

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '25rem',
        minHeight: '5rem',
        placeholder: 'Descreva aqui o problema...',
        translate: 'no',
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
    listStatusOcorrencia: { sigla: string, descricao: string }[] = [];
    statusOcorrencia: any;
    labelStatusOcorrencia: String = "Selecione...";
    chamadosSelecionados: Array<Ocorrencia> = [];

    // Modal Distribuição
    simNao: Tuple[] = [new Tuple("Sim", true), new Tuple("Não", false)];
    comboOcorrenciaInterna: String;
    branches: any[];
    branchesTemp: any[];
    branch: any = {valor: "Selecione...", codigo: 0};
    ocorrenciaGsm: OcorrenciaGsm = new OcorrenciaGsm();
    distribuicao: DistribuicaoOcorrenciaGsm;
    listFuncionarioTarefa: Usuario[];
    funcionarioTarefa: Usuario = new Usuario();
    solicitantes: Usuario[];
    solicitante: Usuario;
    // Cadastro Homologação
    isTabDistribuicao = false;

    @ViewChild(FiltrosPesquisaTecnicoComponent)
    public filtrosPesquisaTecnico: FiltrosPesquisaTecnicoComponent;
    @ViewChild(GridOcorrenciasTecnicoComponent)
    public grid: GridOcorrenciasTecnicoComponent;

    @Input() filtros: FiltrosPesquisa = new FiltrosPesquisa();

    @ViewChild(PainelVisualizacaoOcorrenciasComponent)
    private painelVisualizacaoOcorrenciasComponent: PainelVisualizacaoOcorrenciasComponent;
    // todosFiltros = true;
    novoUsuario: Usuario;
    alterarButton: boolean = true;
    fafa: string = 'fa fa-angle-up';

    public labelFuncionarioSm: String;
    public labelSituacao: String;
    public labelAtivo: String;

    constructor(
        private loadingCtrl: LoadingController,
        private ocorrenciaService: OcorrenciaService,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private router: Router,
        private util: Util,
        private alertCtrl: AlertController,
        private smAlert: SmAlertController,
        private usuarioService: UsuarioService
    ) {
        this.inicializarNovoUsuario();
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).gtag("set", "page", event.urlAfterRedirects);
                (<any>window).gtag("send", "pageview");
            }
        });
        this.usuario = GerenciadorSessao.usuario;
    }

    ngOnInit() {
        // console.log("ngOnInit...", this, GerenciadorSessao.usuario);
        this.ocorrenciaGsm.inOcorrenciaInterna = true;
    }

    mudarButton(event) {
		this.alterarButton = !this.alterarButton;
		this.fafa = (this.alterarButton) ?  'fa fa-angle-up' : 'fa fa-angle-down';
		event.srcElement.parentElement.setAttribute('disabled', true);
		setTimeout(function() {
			event.srcElement.parentElement.removeAttribute('disabled');
		}, 800);

	}

    pesquisaWS(): void {
        this.pesquisar.emit('pesquisou');
        if (this.inAtendimento) {
            this.filtrosPesquisaTecnico.pesquisarWS(this.grid);
        }
    }

    WhateverOcorrencia(obj: Array<Ocorrencia>) {
        this.chamadosResponse = obj;
        this.painelVisualizacaoOcorrenciasComponent.calcularPercentual(this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS, this.filtrosPesquisaTecnico.filtros.desenvolvedorSm.select);
    }

    atualizarGrid(grid: GridOcorrenciasTecnicoComponent) {
        if(grid){
            grid.doInfinite(false);
        }
    }

    retornarFiltros(filtros:  FiltrosPesquisa) {
        this.filtros = filtros;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        // this.dataSource.filter = filterValue;
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


    abrirOcorrencia(o: Ocorrencia) {
        if (o["exibe"]) {
            o["exibe"] = false;
        } else {
            this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS.forEach(item => {
                item["exibe"] = false;
            });
            o["exibe"] = true;
        }
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
        this.cdOcorrencia = null;
    }

    filtrar(list: any) {
        return new Promise<any>(resolve => {
            // pelo nome cliente
            if (this.usuario.nrDocumento) {
                this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS = this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS.filter(
                    item => String(item.cdCliente) === this.usuario.nrDocumento
                );
                if (this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS.length === 0) {
                    this.resultado = false;
                }
            }
            // pelo Id da ocorrencia
            if (this.cdOcorrencia) {
                this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS = this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS.filter(
                    item => item.idOcorrencia === this.cdOcorrencia
                );
            }
            resolve(this.filtrosPesquisaTecnico.filtros.chamadosRetornoWS);
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
            title: 'Informação',
            message: "Tem certeza que deseja encerrar a ocorrência? " + this.ocorrencia.idOcorrencia,
            enableBackdropDismiss: false,
            buttons: [{
                text: 'Não',
                handler: data => {
                    // console.log('Cancelado...', anexo);
                    this.ocorrencia = null;
                }
            }, {
                text: 'Sim',
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
        this.ocorrenciaService.encerrarOcorrencia(this.ocorrencia).then((resposta) => {
            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
        }).catch((err) => {
            AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
        });
        this.filtrosPesquisaTecnico.obterStatus();
        this.filtrosPesquisaTecnico.pesquisarWS();
    }

    preReabrirOcorrencia(obj) {
        this.filtrosPesquisaTecnico.reqMsgReabertura = null;
        this.ocorrencia = obj;
        this.obterHistorico(obj);
        // console.log('preReabrirOcorrencia...', this);
    }

    reabrirOcorrencia() {
        if (this.descricaoHistorico) {
            this.filtrosPesquisaTecnico.reqMsgReabertura = null;
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
            this.ocorrenciaService.reabrirOcorrencia(obj)
                .then(resposta => {
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    this.filtrosPesquisaTecnico.pesquisarWS();
                    $("#modalReabertura").hide();
                    this.descricaoHistorico = null;
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                });
        } else {
            this.filtrosPesquisaTecnico.reqMsgReabertura = "Campo Obrigatório";
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


    lerUrlImagem(event) {
        // console.log("lerUrlImagem: ", event);
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtensao = fileName.split('.').pop();
        this.dsAnexo = fileName;
        this.dsExtensao = fileExtensao;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            // tslint:disable-next-line:no-shadowed-variable
            reader.onload = (event: any) => {
                // console.log("FILE...", event.target.result);
                if (event.target.result) {
                    this.upAnexo = event.target.result.split(",")[1];
                    let anexo: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();
                    anexo.cdOcorrencia = this.ocorrencia.idOcorrencia;
                    anexo.idOcorrenciaAnexo =  null;
                    anexo.upAnexo =  this.upAnexo;
                    anexo.dsNome = fileName;
                    anexo.dsExtensao =  this.dsExtensao;
                    // console.log("add Anexo...", anexo);
                    const arq = this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.anexos.find(a => a.dsNome === fileName);
                    // console.log('ARQ', arq);
                    if (!arq && anexo.dsNome && anexo.dsExtensao) {
                        this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.anexos.push(anexo);
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
            title: 'Informação',
            message: "Este Aquivo já foi Anexado!",
            buttons: [{
                text: 'OK',
            }]
            , enableBackdropDismiss: false
        });
        alert.present();
    }

    removerAnexo(idOcorrenciaAnexo: number, idOcorrencia: number) {
        this.ocorrenciaService.excluirAnexo(idOcorrencia, idOcorrenciaAnexo)
            .then((resposta) => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrosPesquisaTecnico.pesquisarWS();
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    // idOcorrencia: number, idOcorrenciaAnexo: number, upAnexo: string, dsAnexo: string, dsExtensao: string
    adicionarAnexo() {
        this.ocorrenciaService.adicionarAnexo(this.idOcorrencia, this.idOcorrenciaAnexo, this.upAnexo, this.dsAnexo, this.dsExtensao).then((resposta) => {
            // console.log("resposta adicionar:" + JSON.stringify(resposta));
            AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            this.filtrosPesquisaTecnico.pesquisarWS();
        }).catch((err) => {
            AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
        });
    }

    downloadAnexo(idOcorrencia: number, anexo) {
        // console.log('downloadAnexo', anexo);
        const load = this.loadingCtrl.create({
            content: 'Baixando Arquivo...'
        });
        load.present().then(() => {
            this.ocorrenciaService.downloadAnexo(idOcorrencia, anexo.idOcorrenciaAnexo, anexo.dsAnexo)
                .then(resposta => {
                    load.dismiss();
                    // AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    // console.log("downloadAnexo: ", resposta);
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        }).catch(erro => {
            load.dismiss();
        });
        // var element = document.createElement('a');
        // if (anexo.dsExtensao.startsWith("image")) {
        //     element.setAttribute('href', anexo.upAnexo.replace(/^data:image\/[^;]+/, 'data:application/octet-stream'));
        // }
        // if (anexo.dsExtensao.startsWith("text")) {
        //     element.setAttribute('href', anexo.upAnexo.replace(/^data:text\/[^;]+/, 'data:application/octet-stream'));
        // }
        // element.setAttribute('download', anexo.dsAnexo);
        // element.style.display = 'none';
        // document.body.appendChild(element);
        // element.click();
        // document.body.removeChild(element);
    }

    obterAnexo(chamado: any) {
        // console.log("chamado: ", chamado, this);
        // this.idOcorrencia = chamado.idOcorrencia;
        // this.cdUsuarioAtendimento = GerenciadorSessao.usuario.nrDocumento;
        // chamado.forEach(element => {
        //     this.idOcorrenciaAnexo = element.listAnexo.idOcorrenciaAnexo;
        // });
        this.ocorrencia = chamado;
        if (this.produtos.length === 1) {
            this.filtrosPesquisaTecnico.labelProduto = this.produtos[0].show;
        } else {
            this.filtrosPesquisaTecnico.labelProduto = this.produtos.find(p => p.select === this.ocorrencia.cdProdutoServico).show;
        }
        if (this.tiposOcorrencia.length === 1) {
            this.filtrosPesquisaTecnico.labelTipoOcorrencia = this.tiposOcorrencia[0].show;
        } else {
            this.filtrosPesquisaTecnico.labelTipoOcorrencia = this.tiposOcorrencia.find(p => p.select === this.ocorrencia["tipoOcorrencia"].idTipoOcorrencia).show;
        }
    }

    removerHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string) {
        this.ocorrenciaService.excluirHistorico(idOcorrencia, idOcorrenciaHistorico, dsAtendimento)
            .then(resposta => {
                // console.log("resposta excluir:", resposta);
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrosPesquisaTecnico.pesquisarWS();
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    obterHistorico(chamado) {
        this.idOcorrencia = chamado.idOcorrencia;
        this.cdUsuarioAtendimento = GerenciadorSessao.usuario.nrDocumento;
        this.descricaoHistorico = null;
        // chamado.forEach(element => {
        //     this.idOcorrenciaHistorico = element.listHistorico.idOcorrenciaHistorico;
        // });
    }

    alocarTecicno(chamado) {
        this.filtrosPesquisaTecnico.alocarTecnico(chamado);
    }


    gravarTecnico() {
        console.log(this.filtrosPesquisaTecnico.labelPrioridadeUm);
        // this.ocorrencia.listTecnico.push({
        //     teste: "teste"
        // });
        // console.log("chamado: " + JSON.stringify(chamado));
        // this.obterProduto();
        // this.obterTipoInterface();
        // this.obterAmbienteInterface();
        // this.obterSolicitadoCliente();
        // this.obterPrioridadeUm();
        // this.obterPrioridadeDois();
        // chamado.forEach(element => {
        //     this.idOcorrenciaHistorico = element.listHistorico.idOcorrenciaHistorico;
        // });
    }

    get isSm() {
        return this.filtrosPesquisaTecnico.filtros.cliente && this.filtrosPesquisaTecnico.filtros.cliente.show === "SM";
    }

    salvarOcorrencia() {
        console.log("salvarOcorrencia...", this);
        if (this.filtrosPesquisaTecnico.formIsValid()) {
            const load = this.loadingCtrl.create({
                content: 'Gravando Nova Ocorrência...'
            });
            load.present().then(() => {
                // this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.idOcorrencia = 0;
                // this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.cdUsuarioSolicitante = GerenciadorSessao.usuario.nrDocumento;
                this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.dtSolicitacao = new Date();
                this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.inOcorrenciaInterna = this.isSm;
                this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.cdUsuarioCadastro = this.usuario.nrDocumento;
                // console.log("this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm:: " + JSON.stringify(this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm));
                this.ocorrenciaGsmService.manterOcorrencia(this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm)
                    .then(resposta => {
                        // console.log('manterOcorrencia....', resposta);
                        this.novaOcorrencia();
                        this.filtrosPesquisaTecnico.pesquisarWS();
                        load.dismiss();
                        AppGsmModule.injector.get(SmAlertController).sucesso("Informação", resposta.msgResponse);
                        $("#myModal").hide();
                        $("#modalNovaOcorrencia").hide();
                    }).catch(erro => {
                        load.dismiss();
                        AppGsmModule.injector.get(SmAlertController).error("", erro.msgResponse);
                    });
            }).catch(erro => {
                load.dismiss();
            });
        }
    }

    novaOcorrencia() {
        console.log('nova Ocorrencia...', this);
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        this.isTabDistribuicao = false;
        this.irParaAbaCadastro();
        this.filtrosPesquisaTecnico.novaOcorrencia();

        this.filtrosPesquisaTecnico.setProdutoFiltro(this.filtrosPesquisaTecnico.filtros.produto);
        this.filtrosPesquisaTecnico.setClienteFiltro(this.filtrosPesquisaTecnico.filtros.cliente);
        this.solicitante = new Usuario('', null, 'Selecione...');
    }

    removeList(index) {
        this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.anexos.splice(index, 1);
    }

    preRemove(index: number) {
        const anexo = this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.anexos[index];
        const alert = this.alertCtrl.create({
            title: 'Informação',
            message: "Confirmar a Exclusão do Arquivo: " + anexo.dsNome,
            buttons: [{
                text: 'Não',
                handler: data => {
                    // console.log('Cancelado...', anexo);
                }
            }, {
                text: 'Sim',
                handler: data => {
                    this.removeList(index);
                }
            }]
            , enableBackdropDismiss: false
        });
        alert.present();
    }

    addAnexos() {
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
        this.ocorrenciaService.addAnexos(obj)
            .then(resposta => {
                // console.log("resposta adicionar:", resposta);
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                this.filtrosPesquisaTecnico.pesquisarWS();
                $("#modalAddAnexo").hide();
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }


    obterGrid() {
        this.listOcorrenciaInterna.push({
            uf: 'ES',
            produto: 'Siapec3',
            prioridade1: 1,
            prioridade2: 1,
            ambiente: 'Web',
            interface: 'Corporativo',
            funcionalidade: 'Fiscalização de Rebanho',
            descricao: 'Ao efetuar a entrada de animais de outro estado (Aves) não gerar fiscalização de rebanho. Independente da quantidade de ovos ferteis.',
            status: 'pendente',
            dtPrevisaoEntrega: new Date(),
            branch: 'patch-fiscalizacao-2018',
            alpha: false,
            beta: false
        }, {
                uf: 'ES',
                produto: 'Siapec3',
                prioridade1: 1,
                prioridade2: 1,
                ambiente: 'Web',
                interface: 'Corporativo',
                funcionalidade: 'Fiscalização de Rebanho',
                // tslint:disable-next-line:max-line-length
                descricao: 'Adicionar informações referente a GTA OE (Núcleo, Anexo da GTA, Vacinações). Verificar dados exibidos no SIAPEC1. Na coluna Tipo informar que a origem foi GTA OE Após confirmação fechar a janela para evitar que clique novamente em confirmar.',
                status: 'pendente',
                dtPrevisaoEntrega: new Date(),
                branch: 'patch-fiscalizacao-2018',
                alpha: false,
                beta: false
            });
    }

    setStatusOcorrencia(status) {
        // console.log('setTipoInterface...', tipoInterface);
        this.statusOcorrencia = status.sigla;
        this.labelStatusOcorrencia = status.descricao;
        // this.obterAmbienteInterface();
    }

    setUsuarioSmFiltro(usuario) {
        console.log('setUsuarioSmFiltro...', usuario, this);
        this.filtros.desenvolvedorSm = new Tuple(usuario.nome, usuario.idUsuario);
        this.distribuicao.cdUsuarioAtendimento = usuario.nrDocumento;
    }

    preDistribuir(chamado) {
        console.log('preDistribuir', chamado);
        chamado.inOcorrenciaInterna = true;
        this.comboOcorrenciaInterna = 'Sim';
        this.ocorrenciaGsm = chamado;
        this.filtros.produto = new Tuple(this.ocorrenciaGsm.dsProduto, this.ocorrenciaGsm.cdProduto);
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        if (!this.ocorrenciaGsm.distribuicoes || this.ocorrenciaGsm.distribuicoes.length === 0) {
            this.ocorrenciaGsm.distribuicoes = [];
        }
    }

    carregarDadosTarefa(codigo) {
        this.obterBranches(codigo);
        this.obterFuncionariosTarefa(codigo);
    }

    limparDadosTarefa() {
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        this.branches = [];
        this.listFuncionarioTarefa = [];
        this.funcionarioTarefa = new Usuario();
        this.branch = null;
        this.branch = {valor: "Selecione...", codigo: 0};
        this.filtrosPesquisaTecnico.filtros.modalidadeDesenvolvimento = new Tuple("Todos ... ", "");
    }

    obterBranches(codigo) {
        // console.log('ObterBranches', codigo);
        this.ocorrenciaGsmService.obterBranchesAtivos(codigo)
        .then(resp => {
            // console.log('obterBranchesAtivos', resp);
            if (resp) {
                this.branches = resp;
                if (this.branchesTemp && this.branchesTemp.length) {
                    this.branches.forEach(b => {
                        if (!this.branchesTemp.find(t => t.codigo === b.codigo)) {
                            this.branchesTemp.push(b);
                        }
                    });
                } else {
                    this.branchesTemp = resp;
                }
            }
        });
    }

    obterFuncionariosTarefa(codigo) {
        // console.log('obterFuncionariosTarefa', codigo);
        this.ocorrenciaGsmService.obterfuncionariosTarefa(codigo)
        .then(resp => {
            // console.log('obterFuncionariosTarefa', resp);
            this.listFuncionarioTarefa = resp;
        });
    }

    distribuir() {
        // console.log('distribuir', this);
        this.filtrosPesquisaTecnico.filtros.ocorrenciaGsm.distribuicoes.push(this.distribuicao);
        if (this.isTabDistribuicao) {
            this.irParaAbaCadastro();
        }
    }

    irParaAbaCadastro() {
        $('#tabDistribuicao').removeClass("active");
        $('#tabCadastro').addClass("active");
        $('#tabBodyDistribuicao').removeClass("in active");
        $('#tabBodyCadastro').addClass("in active");
        this.isTabDistribuicao = false;
    }

    validarDistribuicao() {

    }

    novaDistribuicao() {
        // console.log('novaDistribuicao', this);
        // this.filtros = new FiltrosPesquisa();
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
    }

    gravarDistribuicao() {
        // console.log('gravarDistribuicao', this);
        this.ocorrenciaGsm.inOcorrenciaInterna = true;
        const obj = <any> JSON.parse(JSON.stringify(this.ocorrenciaGsm));
        delete obj['exibe'];
        delete obj['cor'];
        delete obj['add'];
        delete obj['icon'];
        delete obj['classPanelColor'];
        this.ocorrenciaGsmService.distribuir(obj)
        .then(resp => {
            // console.log('distribuir...', resp);
            this.smAlert.sucesso('Informação', resp.msgResponse);
            $('#modalAlocar').hide();
        });
    }

    getResponsavel(doc) {
        return this.filtrosPesquisaTecnico.filtros.listUsuarioSm.find(u => u.nrDocumento === doc).nome;
    }

    getDataFormatada(data) {
        return this.util.formatarDataUS(data, 'dd/MM/yyyy');
        // return this.util.formatarData(data, 'dd/MM/yyyy');
    }

    getTipoTarefa(codigo) {
        console.log('getTipoTarefa...', codigo, this);
        const tipo = this.filtrosPesquisaTecnico.filtros.modalidades.find(f => f.select === codigo);
        if (tipo) {
            return tipo.select;
        } else {
            return '';
        }
    }

    getBranch(cdBranch) {
        // console.log('getBranch..', cdBranch);
        if (this.branchesTemp && this.branchesTemp.length > 0) {
            const obj = this.branchesTemp.find(b => b.codigo === cdBranch);
            if (obj) {
                return obj.valor;
            } else {
                return '';
            }
        }
    }

    carregarGrid() {
        //console.log('carregarGrid...HomeTecnicoPage', this);
        this.filtrosPesquisaTecnico.pesquisarWS();
    }

    private inicializarNovoUsuario() {
        this.novoUsuario = new Usuario();
        this.novoUsuario.inVeterinarioResponsavel = false;
        this.novoUsuario.inAgronomoResponsavel = false;
        this.novoUsuario.inFocalPoint = false;
        // this.novoUsuario.inFocalPointVegetal = false;
        this.novoUsuario.inKeyUser = false;
        // this.novoUsuario.inKeyUserVegetal = false;
        this.novoUsuario.inGerenteProjeto = false;
        this.novoUsuario.inFiscalContrato = false;
        this.novoUsuario.funcionario = false;
        this.novoUsuario.inAtivo = true;
        this.novoUsuario.inSituacao = false;
        this.labelSituacao = 'Não';
        this.labelFuncionarioSm = 'Não';
        this.labelAtivo = 'Não';
    }

    setLabelFuncionarioSm(tuple: Tuple) {
        this.labelFuncionarioSm = tuple.show;
    }

    setLabelSituacao(tuple: Tuple) {
        this.labelSituacao = tuple.show;
    }

    setLabelAtivo(tuple: Tuple) {
        this.labelAtivo = tuple.show;
    }

    obterPerfis() {

    }

    obterSolicitante(idCliente) {
        const load = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        load.present().then(() => {
            this.solicitante = new Usuario('', null, 'Selecione...');
            this.usuarioService.obterUsuarios(idCliente)
            .then(res => {
                console.log();
                this.solicitantes = [];
                this.solicitantes.push(new Usuario('', null, 'Selecione...'));
                if (res) {
                    res.forEach(item => {
                        this.solicitantes.push(new Usuario(item.idUsuario, item.nrDocumento, item.nome));
                    });
                }
                load.dismiss();
            }).catch(err => {
                console.error('ERRO', err);
                load.dismiss();
            });
        }).catch(() => {
            load.dismiss();
        });
    }
}
