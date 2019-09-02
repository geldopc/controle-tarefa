import { element } from 'protractor';
import { OcorrenciaGsmVersao } from './../../objects/entidades/OcorrenciaGsmVersao';
import { FiltrosPesquisaTecnicoComponent } from '../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import * as $ from "jquery";
import { SmAlertController } from '../sm-alert-controller/sm-alert-controller.component';
import { AppGsmModule } from '../../app.gsm.module';
import { Historico } from '../../objects/entidades/Historico';
import { OcorrenciaGsm, OcorrenciaGsmAnexo } from '../../objects/entidades/OcorrenciaGsm';
import { Tuple } from '../../objects/entidades/Tuple';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { FiltrosPesquisa } from '../filtros-pesquisa-tecnico/filtros-pesquisa-tecnico.component';
import { Util } from '../../services/util/Util';
import { OcorrenciaGsmService } from '../../services/OcorrenciaGsmService';
import { OcorrenciaTipoService } from '../../services/OcorrenciaTipoService';
import { Router } from '@angular/router';
import { Usuario } from '../../objects/entidades/Usuario';
import { OcorrenciaCommit } from '../../objects/entidades/OcorrenciaCommit';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'grid-ocorrencias-tecnico',
    templateUrl: './grid-ocorrencias-tecnico.component.html',
    styleUrls: ['./grid-ocorrencias-tecnico.component.scss']
})
export class GridOcorrenciasTecnicoComponent implements OnInit {

    @Input() chamadosTemp: OcorrenciaGsm[];
    public listaExibicao: OcorrenciaGsm[] = [];
    @Input() filtros: FiltrosPesquisa;
    historico: Historico = new Historico();
    ocorrenciaCommit: OcorrenciaCommit = new OcorrenciaCommit();
    editarCommitValor: OcorrenciaCommit;
    anexo: OcorrenciaGsmAnexo = new OcorrenciaGsmAnexo();
    chamadosSelecionados: Array<OcorrenciaGsm> = [];
    ocorrenciaSelecionada: OcorrenciaGsm;

    idOcorrenciaAnexo: number;
    upAnexo: string;
    downAnexo: string;
    dsAnexo: string;
    dsExtensao: string;
    ocorrencia: OcorrenciaGsm = new OcorrenciaGsm();
    produtos: Tuple[];
    labelProduto: String;
    labelTipoOcorrencia: String;
    idOcorrencia: number;
    idOcorrenciaHistorico: number;
    descricaoHistorico: string;
    cdUsuarioAtendimento: string;
    reqMsgReabertura: string;
    icone: String = "fa fa-square-o";
    refreshFinalizarOcorrencia = false;
    listFuncionalidadeSelecionada: Tuple[] = [];
    tiposOcorrencia: Tuple[];

    simNao: Tuple[] = [new Tuple("Sim", true), new Tuple("Não", false)];
    comboOcorrenciaInterna: String;

    realocar: Boolean = false;

    buildVersao: boolean;
    gerarBuild: OcorrenciaGsmVersao = new OcorrenciaGsmVersao();
    dsTipoSolicitacao: String;
    public usuario: Usuario;
    private firstInfinite: boolean = false;
    private itensPorPagina: number = 50;

    @Output() preDistribuirChange: EventEmitter<OcorrenciaGsm> = new EventEmitter<OcorrenciaGsm>();
    @Output() reCarregarGridChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() filtrosPesquisaTecnico: FiltrosPesquisaTecnicoComponent;
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

    constructor(
        private ocorrenciaService: OcorrenciaService,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        public util: Util,
        private router: Router,
        private smAlert: SmAlertController,
        private ocorrenciaTipoService: OcorrenciaTipoService,
    ) {
        // console.log("constructor", this);
    }

    ngOnInit(): void {
        // console.log("ngOnInit", this);
        this.comboOcorrenciaInterna = 'Sim';
        this.usuario = GerenciadorSessao.usuario;
    }

    ngDoCheck(): void {
       if( this.chamadosTemp && !this.firstInfinite ) {
           this.doInfinite(false);
           this.firstInfinite = true;
       }
    }

    doInfinite(infiniteScroll) {
        if (infiniteScroll == false){
            this.listaExibicao = [];
        }
        setTimeout(() => {
            console.log("    doInfinite(chamadosTemp):: ",     this.chamadosTemp.length );
            let result = this.chamadosTemp.slice(this.listaExibicao.length, this.listaExibicao.length + this.itensPorPagina);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    this.listaExibicao.push(result[i]);
                }
            }
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
            //console.log("doInfinite(listaExibicao):: ", this.listaExibicao.length);
        }, 1500);
    }

    convertNivelSolicitacao(e): String {
        switch (e) {
            case "C":
                return "Correção";
            case "N":
                return "Nova funcionalidade";
            case "A":
                return "Adaptação";
            default:
                return "Não classificado";
        }
    }

    converteReplica(replica) {
        if (replica == true) {
            return 'Sim';
        } else {
            return 'Não';
        }
    }

    checarAtualizacoes() {
        this.router.navigate(['/painel/atualizacao']);
    }

    controleAtualizacaoHomo(ocorrencia: OcorrenciaGsm) {
        return ocorrencia.inStatus === "HA" || ocorrencia.inStatus === "HB";
    }

    selecionarTipoOcorrencia(): void {
        this.listFuncionalidadeSelecionada.push(new Tuple(this.ocorrenciaSelecionada.dsFuncionalidade, ""));
        this.ocorrenciaTipoService.obterFuncionalidade(this.ocorrenciaSelecionada.cdProduto)
            .then(resposta => {
                this.tiposOcorrencia = [];
                this.tiposOcorrencia.push(new Tuple("Todos ...  ", null));
                resposta.forEach(item => {
                    this.tiposOcorrencia.push(new Tuple(item.valor, item.codigo));
                });
            });
    }

    addOrDelOcorrencia(obj: any) {
        // console.log("chamado: " + JSON.stringify(obj))
        if (this.filtros.chamadosSelecionados && this.filtros.chamadosSelecionados.length > 0) {
            const list = this.filtros.chamadosSelecionados.find(c => c.idOcorrencia === obj.idOcorrencia);

            if (list) {
                this.delOcorrencia(obj);
            } else {
                this.addOcorrencia(obj);
            }
        } else {
            this.addOcorrencia(obj);
        }
        this.getBuildVersao();
    }

    addOcorrencia(obj: any) {
        this.filtros.chamadosSelecionados.push(obj);
        obj['icon'] = 'fa fa-check-square';
        obj['add'] = true;
        obj['classPanelColor'] = 'panel-selected';
        if (this.filtros.chamadosSelecionados.length === this.chamadosTemp.length) {
            this.icone = "fa fa-check-square";
        }
    }

    editChamados(event) {
        console.log("event" + event);
    }

    alterarTecnico() {
        this.realocar = !this.realocar;
    }

    getBuildVersao(): void {
        // console.log("getBuildVersao...entrada", this.filtros.chamadosSelecionados);
        const geraBuild = this.filtros.chamadosSelecionados.filter(c => c.inStatus === "AP" || c.inStatus === "AB" || c.inStatus === "AA");
        const naoGeraBuild = this.filtros.chamadosSelecionados.filter(c => c.inStatus !== "AP" && c.inStatus !== "AB" && c.inStatus !== "AA");
        // console.log("getBuildVersao...", this, geraBuild, naoGeraBuild);
        this.buildVersao = geraBuild.length > 0 && naoGeraBuild.length === 0 ? true : false;

    }

    preFinalizarChamados() {
        this.refreshFinalizarOcorrencia = true;
        console.log("this.filtros.chamadosSelecionados:: ", JSON.stringify(this.filtros.chamadosSelecionados));
    }

    delOcorrencia(obj: any) {
        this.filtros.chamadosSelecionados.splice(this.filtros.chamadosSelecionados.indexOf(obj), 1);
        obj['icon'] = 'fa fa-square-o';
        obj['add'] = false;
        obj['classPanelColor'] = 'panel-no-selected';
        if (this.filtros.chamadosSelecionados.length === 0) {
            this.icone = "fa fa-square-o";
        }
    }

    addOrDelTodas(obj: any) {
        obj.forEach(element => {
            if (this.filtros.chamadosSelecionados && this.filtros.chamadosSelecionados.length > 0) {
                const list = this.filtros.chamadosSelecionados.find(c => c.idOcorrencia === element.idOcorrencia);
                if (list) {
                    this.delTodas(element);
                } else {
                    this.addTodas(element);
                }
            } else {
                this.addTodas(element);
            }
        });
    }

    addOrDelAll() {
        if (this.filtros.chamadosSelecionados && this.filtros.chamadosSelecionados.length > 0) {
            this.filtros.chamadosSelecionados = [];
            this.chamadosTemp.forEach(item => {
                item['icon'] = 'fa fa-square-o';
                item['add'] = false;
                this.icone = "fa fa-square-o";
            });
        } else {
            this.filtros.chamadosSelecionados = <any>JSON.parse(JSON.stringify(this.chamadosTemp));
            this.chamadosTemp.forEach(item => {
                item['icon'] = 'fa fa-check-square';
                item['add'] = true;
                this.icone = "fa fa-check-square";
            });
        }
    }

    delTodas(obj: any) {
        this.filtros.chamadosSelecionados.splice(this.filtros.chamadosSelecionados.indexOf(obj), 1);
        this.icone = 'fa fa-square-o';
        obj['icon'] = 'fa fa-square-o';
        obj['add'] = false;
        obj['classPanelColor'] = 'panel-no-selected';

    }

    addTodas(obj: any) {
        this.filtros.chamadosSelecionados.push(obj);
        this.icone = 'fa fa-check-square';
        obj['icon'] = 'fa fa-check-square';
        obj['add'] = true;
        obj['classPanelColor'] = 'panel-selected';
        // console.log("chamados selecionados: " + JSON.stringify(this.filtros.chamadosSelecionados))
    }


    obterAnexoOcorrencia(chamado) {
        this.ocorrenciaService.obterAnexoOcorrencia(chamado.idOcorrencia).then((result) => {
            chamado.anexos = result;
        });
        this.obterAnexo(chamado);
    }

    obterAnexo(chamado: any) {
        // console.log("chamado: ", chamado, this);
        // this.cdUsuarioAtendimento = GerenciadorSessao.usuario.nrDocumento;
        // chamado.forEach(element => {
        //     this.idOcorrenciaAnexo = element.listAnexo.idOcorrenciaAnexo;
        // });
        // this.anexo = new Anexo();

        this.ocorrencia = chamado;
        // if (this.produtos.length === 1) {
        //     this.labelProduto = this.produtos[0].show;
        // } else {
        //     // this.labelProduto = this.produtos.find(p => p.select === this.ocorrencia.cdProdutoServico).show;
        // }
        // if (this.tiposOcorrencia.length === 1) {
        //     this.labelTipoOcorrencia = this.tiposOcorrencia[0].show;
        // } else {
        //     this.labelTipoOcorrencia = this.tiposOcorrencia.find(p => p.select === this.ocorrencia["tipoOcorrencia"].idTipoOcorrencia).show;
        // }
    }

    obterCommitsOcorrencia(chamado) {
        this.ocorrenciaService.obterCommits(chamado.idOcorrencia).then((result) => {
            chamado.commits = result;
        });
    }

    gravarCommit() {
        let split = String(this.ocorrenciaCommit.nrCommit);
        let splitado;
        splitado = split.split(';');

        if (splitado.length > 1){
            for (let i = 0; i < splitado.length; i++) {
                let commit = new OcorrenciaCommit();
                commit.cdOcorrencia = this.ocorrenciaCommit.cdOcorrencia;
                commit.nrCommit = Number(splitado[i]);
                this.ocorrenciaSelecionada.commits.push(commit);
            }
        } else {
            let commit = new OcorrenciaCommit();
            commit.cdOcorrencia = this.ocorrenciaCommit.cdOcorrencia;
            commit.nrCommit = Number(splitado[0]);
            this.ocorrenciaSelecionada.commits.push(commit);
        }

        let obj = <any>JSON.parse(JSON.stringify(this.ocorrenciaSelecionada));
        delete obj['exibe'];
        delete obj["cor"];
        delete obj["add"];
        delete obj["icon"];
        delete obj["classPanelColor"];
        this.ocorrenciaService.gravarVariosCommits(obj)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                $("#modalCommits").hide();
            }).then(() => {
                this.ocorrenciaService.obterCommits(this.ocorrenciaCommit.cdOcorrencia).then((result) => {
                    this.ocorrenciaSelecionada.commits = result;
                });
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    obterCommits(chamado) {
        this.ocorrenciaCommit = new OcorrenciaCommit();
        this.ocorrenciaCommit.cdOcorrencia = chamado.idOcorrencia;
    }

    excluirCommit(commit) {
        this.ocorrenciaSelecionada.commits.splice(this.ocorrenciaSelecionada.commits.indexOf(commit), 1);
        this.ocorrenciaService.excluirCommit(commit)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                // $("#modalCommits").hide();
            }).then(() => {

            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    excluirTodosCommits(commit) {
        if (commit.commits.length > 0){
        let teste = commit.commits[0];
        this.ocorrenciaSelecionada.commits = [];
        this.ocorrenciaService.excluirCommitsOcorrencia(teste)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                // $("#modalCommits").hide();
            }).then(() => {

            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
        }
    }

    valorEditarCommit(commit) {
        this.editarCommitValor = commit;
    }

    editarCommit() {
        let commit = new OcorrenciaCommit();
        commit = this.editarCommitValor;
        commit.nrCommit = this.ocorrenciaCommit.nrCommit;
        this.ocorrenciaService.atualizarCommits(commit)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                $("#modalEditarCommits").hide();
            }).then(() => {
                this.ocorrenciaService.obterCommits(this.editarCommitValor.cdOcorrencia).then((result) => {
                    this.ocorrenciaSelecionada.commits = result;
                });
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });

    }

    obterHistorico(chamado) {
        this.historico = new Historico();
        this.historico.cdOcorrencia = chamado.idOcorrencia;
        this.historico.cdUsuario = GerenciadorSessao.usuario.nrDocumento;
    }

    manterHistoricoOcorrencia() {
        this.ocorrenciaService.manterHistoricoOcorrencia(this.historico)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                $("#modalHistorico").hide();
            }).then(() => {
                const chamados = this.chamadosTemp.filter(i => i.idOcorrencia === this.historico.cdOcorrencia);
                if (chamados) {
                    this.obterHistoricoOcorrencia(chamados[0]);
                }
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    gerarBranch(idDistribuicao) {
        this.ocorrenciaService.gerarBranch(idDistribuicao)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
    }

    gerarCsv() {
        this.filtrosPesquisaTecnico.gerarCsvWS();
    }

    public gerarVersao() {
        /* idOcorrencia */
        this.gerarBuild = new OcorrenciaGsmVersao();
        this.filtros.chamadosSelecionados.forEach(ocorr => {
            this.gerarBuild.idOcorrencia.push(ocorr.idOcorrencia);
            this.gerarBuild.cdProduto = ocorr.cdProduto;
            this.gerarBuild.versao = ocorr.inStatus;
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
            this.refreshFinalizarOcorrencia = true;
            this.ocorrenciaGsmService.gerarVersao(gerarBuild)
                .then(resposta => {
                    AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
                    load.dismiss();
                }).catch((err) => {
                    load.dismiss();
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível atualizar a versão." + JSON.stringify(err.msgResponse));
                });
        }).catch((err) => {
            load.dismiss();
        });
    }

    obterHistoricoOcorrencia(chamado) {
        this.ocorrenciaService.obterHistoricoOcorrencia(chamado.idOcorrencia).then((result) => {
            chamado.listHistorico = result;
        });
    }

    obterHistoricoBuilds(chamado) {
        if (chamado) {
            this.ocorrenciaGsmService.obterHistoricoBuilds(chamado.idOcorrencia).then((result) => {
                chamado.listBuilds = result;
            });
        }
    }

    removerHistorico(idOcorrencia: number, idOcorrenciaHistorico: number, dsAtendimento: string) {
        this.ocorrenciaService.excluirHistorico(idOcorrencia, idOcorrenciaHistorico, dsAtendimento)
            .then(resposta => {
                AppGsmModule.injector.get(SmAlertController).sucesso("", resposta.msgResponse);
            }).catch((err) => {
                AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
            });
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
    }

    downloadAnexo(idOcorrencia: number, anexo) {
        const load = this.loadingCtrl.create({
            content: 'Baixando Arquivo...'
        });
        load.present().then(() => {
            this.ocorrenciaService.downloadAnexoNovo(idOcorrencia, anexo)
                .then(resposta => {
                    load.dismiss();
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", "Não foi possível concluir a operação.");
                });
        }).catch(erro => {
            load.dismiss();
        });
    }


    preReabrirOcorrencia(obj) {
        this.reqMsgReabertura = null;
        this.ocorrencia = obj;
        this.obterHistorico(obj);
    }

    distribuir(chamado) {
        // console.log('distribuir', this);
        this.preDistribuirChange.emit(chamado);
    }


    getDataFormatada(data) {
        return this.util.formatarDataUS(data, 'dd/MM/yyyy');
    }

    fechar() {
        console.log('fechar...');
        const id = $("div.panel-collapse.in").attr('id');
        console.log('fechar...', id);
        $("div[id='" + id + "']").hide();
    }

    abrir(id) {
        console.log('abrir...', id);
        $('#collapse' + id).removeClass('panel-collapse collapse');
        $('#collapse' + id).addClass('panel-collapse collapse in');

    }

    reCarregarGrid() {
        console.log('reCarregarGrid...', this);
        this.refreshFinalizarOcorrencia = false;
        this.filtros.chamadosSelecionados = [];
        this.reCarregarGridChange.emit("carregarGridHomeTécnico");
    }

    abrirPanel(chamado) {
        if (this.ocorrenciaSelecionada.nrPrioridade1 || (this.ocorrenciaSelecionada.nrPrioridade1 == 0)) {
            this.filtros.prioridadeUm = this.filtros.listPrioridadeUm.find(t => t.select === this.ocorrenciaSelecionada.nrPrioridade1);
        } else {
            this.filtros.prioridadeUm = new Tuple("Todos ... ", "");
        }
        if (this.ocorrenciaSelecionada.nrPrioridade2 || (this.ocorrenciaSelecionada.nrPrioridade2 == 0)) {
            this.filtros.prioridadeDois = this.filtros.listPrioridadeDois.find(t => t.select === this.ocorrenciaSelecionada.nrPrioridade2);
        } else {
            this.filtros.prioridadeDois = new Tuple("Todos ... ", "");
        }
        if (this.ocorrenciaSelecionada.inTipoSolicitacao) {
            if (this.filtros.listTipoSolicitacao.find(t => t.select === this.ocorrenciaSelecionada.inTipoSolicitacao)) {
                this.filtros.tipoSolicitacao = this.filtros.listTipoSolicitacao.find(t => t.select === this.ocorrenciaSelecionada.inTipoSolicitacao);
            } else {
                this.filtros.tipoSolicitacao = new Tuple("Selecione ... ", null);
            }
        }
        if (this.ocorrenciaSelecionada.inNivelComplexidade) {
            if (this.filtros.listNivelComplexidade.find(t => t.select === this.ocorrenciaSelecionada.inNivelComplexidade)) {
                this.filtros.nivelComplexidade = this.filtros.listNivelComplexidade.find(t => t.select === this.ocorrenciaSelecionada.inNivelComplexidade);
            } else {
                this.filtros.nivelComplexidade = new Tuple("Selecione ... ", null);
            }
        }
        $('#listAtualizacoes').hide();
        // this.obterDistribuicoes(this.ocorrenciaSelecionada);
        this.obterHistoricoBuilds(this.ocorrenciaSelecionada);
        console.log("GridOcorrenciasTecnicoComponent:: ngDoCheck");
        setTimeout(() => {
            $('#ocorrencia' + chamado.idOcorrencia).show();
        }, 500);
    }

    fecharPanel(chamado) {
        // $('#ocorrencia' + chamado.idOcorrencia).css('display', 'none');
        $('#ocorrencia' + chamado.idOcorrencia).hide();
    }

    dsNivelComplexidade(el: string): String {
        switch (el) {
            case "B":
                return "Baixa";
            case "M":
                return "Média";
            case "A":
                return "Alta";

        }
    }

    gravarOcorrencia() {
        // console.log('gravarDistribuicao', this);
        if (this.validarCamposDistribuicao()) {
            const obj = <any>JSON.parse(JSON.stringify(this.ocorrenciaSelecionada));
            delete obj['exibe'];
            delete obj['cor'];
            delete obj['add'];
            delete obj['icon'];
            delete obj['classPanelColor'];
            if (obj && obj.listBuilds && obj.listBuilds.length >= 0) {
                delete obj['listBuilds'];
            }
            console.log("obj gravar: " + JSON.stringify(obj));
            const load = this.loadingCtrl.create({
                content: 'Gravando Ocorrência...'
            });
            load.present().then(() => {
                this.ocorrenciaGsmService.editarOcorrencia(obj)
                .then(resp => {
                    this.smAlert.sucesso('Informação', resp.msgResponse);
                    // this.filtrosPesquisaTecnico.filtrarPorStatus(this.filtros.status);
                    load.dismiss();
                    this.reCarregarGrid();
                    // $('#modalAlocar').hide();
                }).catch((err) => {
                    AppGsmModule.injector.get(SmAlertController).error("", err.msgResponse);
                    load.dismiss();
                });
            }).catch(erro => {
                load.dismiss();
            });
        }
    }

    validarCamposDistribuicao(): boolean {
        let valida = false;
        if (this.ocorrenciaSelecionada.nrPrioridade1 || this.ocorrenciaSelecionada.nrPrioridade1 > -1) {
            valida = true;
        } else {
            return false;
        }
        if (this.ocorrenciaSelecionada.nrPrioridade2 || this.ocorrenciaSelecionada.nrPrioridade2 > -1) {
            valida = true;
        } else {
            return false;
        }
        if (this.ocorrenciaSelecionada.inTipoSolicitacao) {
            valida = true;
        } else {
            return false;
        }
        if (this.ocorrenciaSelecionada.cdNivelSeveridade) {
            valida = true;
        } else {
            return false;
        }
        if (this.ocorrenciaSelecionada.inNivelComplexidade) {
            valida = true;
        } else {
            return false;
        }
        return valida;
    }

    obterDistribuicoes(chamado) {
        const load = this.loadingCtrl.create({
            content: 'Consultando as distribuições...'
        });
        load.present().then(() => {
            if (chamado) {
                this.ocorrenciaGsmService.obterDistribuicoes(chamado.idOcorrencia)
                    .then((result) => {
                        chamado.distribuicoes = result;
                        load.dismiss();
                    }).catch(err => {
                        console.error("Erro...", err);
                        load.dismiss();
                    });
            }
        }).catch(erro => {
            load.dismiss();
        });
    }
}
