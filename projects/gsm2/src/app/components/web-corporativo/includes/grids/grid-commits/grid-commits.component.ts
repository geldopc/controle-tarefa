import { Component, Input, SimpleChanges } from "@angular/core";
import * as $ from 'jquery';
import { OcorrenciaGsm } from "projects/gsm2/src/app/objects/entidades/OcorrenciaGsm";
import { OcorrenciaCommit } from "projects/gsm2/src/app/objects/entidades/OcorrenciaCommit";
import { OcorrenciaService } from "projects/gsm2/src/app/services/OcorrenciaService";
import { SmAlertController } from "../../../../sm-alert-controller/sm-alert-controller.component";
import { AlertController } from "ionic-angular";

@Component({
    selector: "app-grid-commits",
    templateUrl: "./grid-commits.component.html",
    styleUrls: ["./grid-commits.component.css"]
})
export class GridCommitsComponent {

    @Input() ocorrencia: OcorrenciaGsm;
    commit: OcorrenciaCommit;
    commits: string;

    constructor(
        private ocorrenciaService: OcorrenciaService,
        private smAlert: SmAlertController,
        private alertCtrl: AlertController,
    ) {
        // console.log("constructor...", this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log("ngOnChanges...", this);
        this.ocorrenciaService.obterCommits(this.ocorrencia.idOcorrencia)
        .then(res => {
            this.ocorrencia.commits = res;
        });
    }

    preDelCommit(commit) {
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
                    this.excluirCommit(commit);
                }
            }],
            enableBackdropDismiss: false
        });
        alert.present();
    }

    preDelTodosCommit(ocr) {
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
                    this.excluirTodosCommits(ocr);
                }
            }],
            enableBackdropDismiss: false
        });
        alert.present();
    }

    excluirTodosCommits(ocr) {
        if (ocr.commits.length) {
            let commit = ocr.commits[0];
            this.ocorrencia.commits = [];
            this.ocorrenciaService.excluirCommitsOcorrencia(commit)
            .then(res => {
                this.smAlert.sucesso("", res.msgResponse);
            }).catch(err => {
                console.error('ERRO', err);
                this.smAlert.error("", "Não foi possível concluir a operação.");
            });
        }
    }

    excluirCommit(commit) {
        this.ocorrencia.commits.splice(this.ocorrencia.commits.indexOf(commit), 1);
        this.ocorrenciaService.excluirCommit(commit)
        .then(res => {
            this.smAlert.sucesso("", res.msgResponse);
        }).catch(err => {
            console.error('ERRO', err);
            this.smAlert.error("", "Não foi possível concluir a operação.");
        });
    }

    obterCommits(ocr) {
        this.commit = new OcorrenciaCommit();
        this.commit.cdOcorrencia = ocr.idOcorrencia;
    }

    gravarCommit() {
        if (this.commits) {
            if (this.commits.indexOf(';') > -1) {
                const listCommits = this.commits.split(';');
                listCommits.forEach(item => {
                    let commit = new OcorrenciaCommit();
                    commit.cdOcorrencia = this.commit.cdOcorrencia;
                    commit.nrCommit = +item.trim();
                    this.ocorrencia.commits.push(commit);
                });
            } else {
                let commit = new OcorrenciaCommit();
                commit.cdOcorrencia = this.commit.cdOcorrencia;
                commit.nrCommit = +this.commits.trim();
                this.ocorrencia.commits.push(commit);
            }
        }
        this.ocorrenciaService.gravarVariosCommits(this.ocorrencia)
        .then(res => {
            this.ocorrencia.commits = res.obj;
            this.smAlert.sucesso("", res.msgResponse);
            $("#modalAddCommits").hide();
        }).catch(err => {
            console.error('ERRO', err);
            this.smAlert.error("", "Não foi possível concluir a operação.");
        });
    }
}
