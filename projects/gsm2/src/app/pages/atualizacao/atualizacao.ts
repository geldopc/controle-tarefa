import { FiltrosPesquisa } from './../../components/filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { Component, EventEmitter, OnInit, ViewChild, Input, Output } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { IonicPage, LoadingController } from "ionic-angular";
import { PainelVisualizacaoOcorrenciasComponent } from "../../components/painel-visualizacao-ocorrencias/painel-visualizacao-ocorrencias.component";
import { OcorrenciaGsm } from "../../objects/entidades/OcorrenciaGsm";
import { Tuple } from '../../objects/entidades/Tuple';
import { Usuario } from "../../objects/entidades/Usuario";
import { Masks } from "../../components/validators/masks";
import { GerenciadorSessao } from "../../services/util/GerenciadorSessao";
import { OcorrenciaProdutoService } from '../../services/OcorrenciaProdutoService';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { Util } from '../../services/util/Util';
import { GridAtualizacaoOcorrenciasComponent } from '../../components/grid-atualizacao-ocorrencias/grid-atualizacao-ocorrencias.component';
import { OcorrenciaGsmVersao } from '../../objects/entidades/OcorrenciaGsmVersao';


@IonicPage()
@Component({
    selector: "page-atualizacao",
    templateUrl: "atualizacao.html",
    styleUrls: ["atualizacao.scss"]
})
export class AtualizacaoPage implements OnInit {


    onCpfCnpjChange = new EventEmitter();
    mask: Masks;
    cdOcorrencia: number;

    mostrar: Boolean;
    resultado: Boolean = false;

    @Output() pesquisar: EventEmitter<String> = new EventEmitter<String>();
    @Input() painel: string = "de Atualização.";
    @Input()
    inAtendimento: boolean = false;

    usuario: Usuario;

    chamadosSelecionados: Array<OcorrenciaGsm> = [];
    chamadosTemp: Array<OcorrenciaGsm> = [];
    filtros: FiltrosPesquisa = new FiltrosPesquisa();
    private _chamadosTemp: Array<OcorrenciaGsm> = [];
    totalChamados: Number;
    totalChamadosFiltrados: Number = 0;
    status: string;

    @ViewChild(PainelVisualizacaoOcorrenciasComponent)
    private painelVisualizacaoOcorrenciasComponent: PainelVisualizacaoOcorrenciasComponent;
    @ViewChild(GridAtualizacaoOcorrenciasComponent)
    private gridAtualizacaoOcorrencias: GridAtualizacaoOcorrenciasComponent;
    // todosFiltros = true;
    gerarBuild: OcorrenciaGsmVersao =  new OcorrenciaGsmVersao();

    constructor(
        private router: Router,
        private ocorrenciaProdutoService: OcorrenciaProdutoService,
        private loadingCtrl: LoadingController,
        private ocorrenciaService: OcorrenciaService,
        private util: Util,
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).gtag("set", "page", event.urlAfterRedirects);
                (<any>window).gtag("send", "pageview");
            }
        });
        this.usuario = GerenciadorSessao.usuario;
    }

    ngOnInit() {
        this.pesquisarWS('A');
        this.gerarBuild.versao = 'A';
    }

    cargaInicial(): Promise<any> {
        return new Promise<any>(resolve => {
            // this.obterStatus();
            // this.obterUsuarios();
            this.obterStatusOcorrencia().then((el) => resolve(el));
        });
    }

    obterStatusOcorrencia() {
        return this.ocorrenciaService.obterStatusOcorrencias().then(resp => {
            this.filtros.listStatusTemp = [];
            if (resp && resp.length > 0) {
                resp.forEach(item => {
                    this.filtros.listStatusTemp.push(new Tuple(item.valor, item.codigo));
                });
            }
        });
    }

    obterCor(status): String {
        // return "default";
        if (status === "TF") {
            return "success";
        } else if (status === "AD") {
             return "info";
        } else if (status === "DE") {
             return "desenvolvimento";
        } else if (
            status === "AA" ||
            status === "VA" ||
            status === "HO" ||
            status === "AB"
        ) {
             return "warning";
        } else if (status === "VB" || status === "HB") {
            return "primary";
        } else if (status === "HC" || status === "AP" || status === "VP") {
            return "default";
        }
    }

    alpha() {
        this.status = "A";
        this.filtros.listStatusSelecionado = [];
        this.filtros.listStatusSelecionado.push(new Tuple('Aguardando Atualizaçao Alpha', 'AA'));
        this.filtros.listStatusSelecionado.push(new Tuple('Gerando Alpha', 'VA'));
        this.filtros.listStatusSelecionado.push(new Tuple('Homologacao Alpha', 'HA'));
        console.log("listStatusSelecionado Alpha:: " + JSON.stringify(this.filtros.listStatusSelecionado));
        return this.filtros;
    }
    beta() {
        this.status = "B";
        this.filtros.listStatusSelecionado = [];
        this.filtros.listStatusSelecionado.push(new Tuple('Aguardando Atualizaçao Beta', 'AB'));
        this.filtros.listStatusSelecionado.push(new Tuple('Gerando Beta', 'VB'));
        this.filtros.listStatusSelecionado.push(new Tuple('Homologacao Beta', 'HB'));
        console.log("listStatusSelecionado Beta:: " + JSON.stringify(this.filtros.listStatusSelecionado));
        return this.filtros;
    }
    producao() {
        this.status = "P";
        this.filtros.listStatusSelecionado = [];
        this.filtros.listStatusSelecionado.push(new Tuple('Versao Prod', 'VP'));
        this.filtros.listStatusSelecionado.push(new Tuple('Homologacao Cliente', 'HC'));
        return this.filtros;
    }

    verificar($el): boolean{
        switch(this.status) {
             case "P":
                 return true;
             case "B":
                return ($el == "B" || $el == "A")
             case "A":
                return ($el == "A")
        }
    }

    identificarVersao(e: string) {

        this.gerarBuild.versao = e;
        switch (e) {
            case "A":
                return this.alpha();
            case "B":
                return this.beta();
            case "C":
                return this.producao();
        }
    }

    pesquisarWS(e: string) {
        this.identificarVersao(e);

        this.cargaInicial().then(() => {
            const load = this.loadingCtrl.create({
                content: "Buscando Ocorrências..."
            });
            load.present()
            .then(() => {
                const status = [];
                console.log("listStatusSelecionado:: " + JSON.stringify(this.filtros.listStatusSelecionado));
                if (this.filtros.listStatusSelecionado && this.filtros.listStatusSelecionado.length > 0) {
                    this.filtros.listStatusSelecionado.forEach(item => {
                        if (item.select != null) {
                            status.push(item.select);
                        }
                    });
                }
                console.log("status:: " + JSON.stringify(status));

                const convertFiltroPainelWS = {
                    status: status,
                    dataInicial: null,
                    dataFinal: null,
                    clientes: null,
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
                    inOcorrenciaInterna: null
                };
                this.ocorrenciaProdutoService.obterOcorrenciasGsmPorFiltrosPainelOcorrencia(convertFiltroPainelWS)
                .then(resp => {
                    this.populaOcorrenciaColorida(resp);
                }).then(() => {
                    this.popularFiltros();
                    load.dismiss();
                });
            }).catch(erro => {
                load.dismiss();
            });
        });
    }

    popularFiltros(): void {
        if (this._chamadosTemp && this._chamadosTemp.length > 0 ) {
            this.filtros.limparListFiltros();
            this._chamadosTemp.forEach(item => {
                if (item.inStatus && item.dsStatus && !this.filtros.listStatusTemp.find(p => p.select === item.inStatus)) {
                    this.filtros.listStatusTemp.push(new Tuple(item.dsStatus, item.inStatus));
                }
                this.filtros.listStatusTemp.sort();
            });
        }
    }


    populaOcorrenciaColorida(resp: OcorrenciaGsm[]) {
        this._chamadosTemp = [];
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
        }
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

    limpar() {
        this.cdOcorrencia = null;
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

    formatDataUS(dataStr) {
        if (dataStr && dataStr.indexOf("/") > -1) {
            const parts = dataStr.split("/");
            dataStr = parts[2] + "-" + (parts[1] - 1) + "-" + parts[0];
            return dataStr;
        } else {
            return dataStr;
        }
    }




}
