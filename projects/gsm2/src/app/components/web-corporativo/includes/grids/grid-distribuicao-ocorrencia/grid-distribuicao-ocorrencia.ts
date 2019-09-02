import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import * as $ from 'jquery';
import { DistribuicaoOcorrenciaGsm } from 'projects/gsm2/src/app/objects/entidades/DistribuicaoOcorrenciaGsm';
import { OcorrenciaGsm } from 'projects/gsm2/src/app/objects/entidades/OcorrenciaGsm';
import { Usuario } from 'projects/gsm2/src/app/objects/entidades/Usuario';
import { OcorrenciaGsmService } from 'projects/gsm2/src/app/services/OcorrenciaGsmService';
import { OcorrenciaTipoService } from 'projects/gsm2/src/app/services/OcorrenciaTipoService';
import { GerenciadorSessao } from 'projects/gsm2/src/app/services/util/GerenciadorSessao';
import { Util } from 'projects/gsm2/src/app/services/util/Util';
import { SmAlertController } from '../../../../sm-alert-controller/sm-alert-controller.component';

@Component({
    selector: 'app-grid-distribuicao-ocorrencia',
    templateUrl: 'grid-distribuicao-ocorrencia.html',
    styleUrls: ['./grid-distribuicao-ocorrencia.scss'],
})
export class GridDistribuicaoOcorrenciaComponent implements OnInit {

    page: number = 1;
    @Input() ocorrencia: OcorrenciaGsm;
    distribuicao: DistribuicaoOcorrenciaGsm;
    listModalidade: Array<{codigo: number, valor: string, tipo: string, sigla: string}> = [];
    listTecnico: Usuario[];
    usuarioLogado = GerenciadorSessao.sessao.usuario;
    branches: {valor: string, codigo: number}[];
    branchesTemp: any[];
    branch: any = {valor: "Novo branch..", codigo: 0};
    @Output() refresh = new EventEmitter();

    constructor(
        private ocorrenciaTipoService: OcorrenciaTipoService,
        private ocorrenciaGsmService: OcorrenciaGsmService,
        private loadingCtrl: LoadingController,
        private util: Util,
        private smAlert: SmAlertController,
        private alertCtrl: AlertController,
        ) { }

    ngOnInit(): void {
        // console.log("ngOnInit...", this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log("ngOnChanges...", this, changes);
        this.ordenarDistribuicao();
    }

    ordenarDistribuicao() {
        if (this.ocorrencia.distribuicoes && this.ocorrencia.distribuicoes.length) {
            this.ocorrencia.distribuicoes.sort(function(a, b) {
                return a.dtDistribuicao < b.dtDistribuicao ? -1 : 1;
            });
        } else {
            this.ocorrencia.distribuicoes = [];
        }
    }

    getDataFormatada(data) {
        return this.util.formatarDataUS(data, 'dd/MM/yyyy');
    }

    checkResponsavelLogado(distribuicao) {
        return +GerenciadorSessao.usuario.idUsuario === +distribuicao.cdUsuarioAtendimento ||
            GerenciadorSessao.usuario.nrDocumento === distribuicao.cdUsuarioAtendimento;
    }

    obterTipoTarefa() {
        if (!this.listModalidade || !this.listModalidade.length) {
            this.ocorrenciaTipoService.obterModalidadeDesenvolvimento(null)
            .then(res => {
                this.distribuicao.tipoTarefa = 'Selecione...';
                if (res && res.length) {
                    this.listModalidade = res;
                }
            });
        }
    }

    preAddDistribuicao(): void {
        this.distribuicao = new DistribuicaoOcorrenciaGsm();
        this.obterTipoTarefa();
    }

    async preEditDistribuicao() {
        console.log('preEditDistribuicao...', this);
        await this.obterTipoTarefa();
        await this.obterBranches(this.distribuicao.cdTipoTarefa);
        await this.obterTecnicoTarefa(this.distribuicao.cdTipoTarefa);
        const tipo = this.listModalidade.find(b => +b.codigo === +this.distribuicao.cdTipoTarefa);
        if (tipo) {
            this.distribuicao.tipoTarefa = tipo.valor;
        }
        if (this.listTecnico && this.listTecnico.length) {
            this.distribuicao.usuarioAtendimento = this.listTecnico.find(u => +u.idUsuario === +this.distribuicao.cdUsuarioAtendimento);
        }
        this.setBranch();
    }

    carregarDadosDistribuicao(tipoTarefa: any) {
        this.distribuicao.tipoTarefa = tipoTarefa.valor;
        this.distribuicao.inSigla = tipoTarefa.sigla;
        this.distribuicao.cdBranch = 0;
        this.obterBranches(tipoTarefa.codigo);
        this.obterTecnicoTarefa(tipoTarefa.codigo);
        this.setBranch();
    }

    private setBranch() {
        if (this.branches && this.branches.length) {
            this.branch = this.branches.find(b => +b.codigo === +this.distribuicao.cdBranch);
        }
        if (!this.branch) {
            this.branch = {valor: "Novo branch..", codigo: 0};
        }
    }

    obterBranches(codigo) {
        this.ocorrenciaGsmService.obterBranchesAtivos(codigo)
        .then(res => {
            this.branches = [];
            this.branches.push({valor: "Não Gerar Branch...", codigo: null}, {valor: "Novo Branch...", codigo: 0});
            if (res) {
                res.forEach((item) => {
                    this.branches.push(item);
                });
                if (this.branchesTemp && this.branchesTemp.length) {
                    this.branches.forEach(b => {
                        if (!this.branchesTemp.find(t => t.codigo === b.codigo)) {
                            this.branchesTemp.push(b);
                        }
                    });
                } else {
                    this.branchesTemp = res;
                }
            }
        });
    }

    obterTecnicoTarefa(idTipoTarefa: number) {
        this.listTecnico = [];
        return this.ocorrenciaGsmService.obterfuncionariosTarefa(idTipoTarefa)
        .then(res => {
            this.distribuicao.usuarioAtendimento = new Usuario();
            this.distribuicao.usuarioAtendimento.nome = 'Selecione...';
            if (res && res.length) {
                res.forEach(item => {
                    this.listTecnico.push(new Usuario(item.idUsuario, item.nrDocumento, item.nome));
                });
            }
        });
    }

    distribuir() {
        if (this.validarDistribuicao()) {
            const load = this.loadingCtrl.create({
                content: 'Distribuindo...'
            });
            load.present().then(() => {
                delete this.distribuicao.usuarioAtendimento;
                this.distribuicao.cdOcorrencia = this.ocorrencia.idOcorrencia;
                this.ocorrenciaGsmService.distribuir(this.distribuicao)
                .then(res => {
                    this.ocorrencia.distribuicoes.push(res.obj);
                    this.refresh.emit(true);
                    load.dismiss();
                    $('#modalDistribuirOcorrencia').hide();
                    this.smAlert.sucesso('Informação', res.msgResponse);
                }).then(() => {
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                }).catch(err => {
                    console.log('ERRO', err);
                    load.dismiss();
                });
            });
        }
    }

    editarDistribuicao() {
        if (this.validarDistribuicao()) {
            const load = this.loadingCtrl.create({
                content: 'Aguarde...'
            });
            load.present().then(() => {
                delete this.distribuicao.usuarioAtendimento;
                this.distribuicao.cdOcorrencia = this.ocorrencia.idOcorrencia;
                this.ocorrenciaGsmService.editarDistribuicao(this.distribuicao)
                .then(res => {
                    this.refresh.emit(true);
                    load.dismiss();
                    $('#modalDistribuirOcorrencia').hide();
                    this.smAlert.sucesso('Informação', res.msgResponse);
                }).then(() => {
                    this.distribuicao = new DistribuicaoOcorrenciaGsm();
                }).catch(err => {
                    console.log('ERRO', err);
                    load.dismiss();
                });
            });
        }
    }

    private validarDistribuicao(): boolean {
        if (this.distribuicao.cdUsuarioAtendimento && this.distribuicao.cdTipoTarefa) {
            return true;
        } else {
            return false;
        }
    }

    checkPermiteDistribuir() {
        const ocr = this.ocorrencia;
        return ocr.cdFuncionalidade && ocr.inTipoSolicitacao && ocr.inNivelComplexidade &&
            ocr.cdNivelSeveridade && ocr.nrPrioridade1 > -1 && ocr.nrPrioridade2 > -1;
    }

    iniciarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Iniciando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.iniciarDistribuicao(idOcorrenciaDistribuicao)
            .then(res => {
                load.dismiss();
                this.ocorrencia = res.ocorrencia;
            }).catch(err => {
                console.error('ERROR', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
                load.dismiss();
            });
        });
    }

    pararDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Parando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.pararDistribuicao(idOcorrenciaDistribuicao)
            .then(res => {
                load.dismiss();
                this.ocorrencia = res.ocorrencia;
            }).catch(err => {
                console.error('ERROR', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
                load.dismiss();
            });
        });
    }

    finalizarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Finalizando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.finalizarDistribuicao(idOcorrenciaDistribuicao)
            .then(res => {
                this.refresh.emit(true);
                load.dismiss();
                this.ocorrencia = res.ocorrencia;
            }).catch(err => {
                console.error('ERROR', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
                load.dismiss();
            });
        });
    }

    reiniciarDistribuicao(idOcorrenciaDistribuicao) {
        const load = this.loadingCtrl.create({
            content: 'Reiniciando...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.reiniciarDistribuicao(idOcorrenciaDistribuicao)
            .then(res => {
                load.dismiss();
                this.ocorrencia = res.ocorrencia;
            }).catch(err => {
                console.error('ERROR', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
                load.dismiss();
            });
        });
    }

    delDistribuicao(dist) {
        const load = this.loadingCtrl.create({
            content: 'Removendo esta distribuição...'
        });
        load.present().then(() => {
            this.ocorrenciaGsmService.removerDistribuicao(dist.idOcorrenciaDistribuicao)
            .then(res => {
                const index = this.ocorrencia.distribuicoes.findIndex(a => a.idOcorrenciaDistribuicao === dist.idOcorrenciaDistribuicao);
                this.ocorrencia.distribuicoes.splice(index, 1);
                this.ocorrencia.distribuicoes = res.ocorrencia.distribuicoes;
                this.refresh.emit(true);
                load.dismiss();
            }).catch(err => {
                console.error('ERROR', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
                load.dismiss();
            });
        });
    }

    preDel(dist) {
        const alert = this.alertCtrl.create({
            message: "Confirmar a Exclusão da Distribuição",
            buttons: [{
                text: 'Não',
                handler: data => {
                    // console.log('Cancelado...', anexo);
                }
            }, {
                text: 'Sim',
                handler: data => {
                    this.delDistribuicao(dist);
                }
            }],
            enableBackdropDismiss: false
        });
        alert.present();
    }
}
